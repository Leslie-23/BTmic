export default `
<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body>
<script>
var stream = null;
var ctx = null;
var sourceNode = null;
var gainNode = null;
var analyser = null;
var levelInterval = null;
var analyserData = null;

function msg(obj) {
  try { window.ReactNativeWebView.postMessage(JSON.stringify(obj)); } catch(e) {}
}

function start() {
  if (ctx) stop();

  msg({ type: 'debug', message: 'Requesting mic...' });

  navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  })
  .then(function(s) {
    stream = s;
    msg({ type: 'debug', message: 'Got mic stream, creating AudioContext...' });

    ctx = new (window.AudioContext || window.webkitAudioContext)();

    // AudioContext may start suspended — must resume
    var resumePromise = ctx.state === 'suspended' ? ctx.resume() : Promise.resolve();

    return resumePromise.then(function() {
      msg({ type: 'debug', message: 'AudioContext state: ' + ctx.state });

      sourceNode = ctx.createMediaStreamSource(stream);

      // Gain for volume boost
      gainNode = ctx.createGain();
      gainNode.gain.value = 2.5;

      // Analyser for voice level metering
      analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserData = new Uint8Array(analyser.frequencyBinCount);

      // Chain: mic -> gain -> analyser -> speakers
      sourceNode.connect(gainNode);
      gainNode.connect(analyser);
      analyser.connect(ctx.destination);

      // Send audio level to RN at ~15fps for voice-reactive animation
      levelInterval = setInterval(function() {
        if (!analyser) return;
        analyser.getByteTimeDomainData(analyserData);
        var sum = 0;
        for (var i = 0; i < analyserData.length; i++) {
          var v = (analyserData[i] - 128) / 128;
          sum += v * v;
        }
        var rms = Math.sqrt(sum / analyserData.length);
        // Normalize to 0-1 range (rms is typically 0-0.5 for speech)
        var level = Math.min(1, rms * 3);
        msg({ type: 'level', value: level });
      }, 66);

      msg({ type: 'status', active: true });
    });
  })
  .catch(function(err) {
    msg({ type: 'error', message: (err.name || '') + ': ' + (err.message || 'Mic access failed') });
  });
}

function stop() {
  if (levelInterval) { clearInterval(levelInterval); levelInterval = null; }
  try { if (sourceNode) sourceNode.disconnect(); } catch(e) {}
  try { if (gainNode) gainNode.disconnect(); } catch(e) {}
  try { if (analyser) analyser.disconnect(); } catch(e) {}
  try { if (ctx) ctx.close(); } catch(e) {}
  try { if (stream) stream.getTracks().forEach(function(t) { t.stop(); }); } catch(e) {}
  sourceNode = null;
  gainNode = null;
  analyser = null;
  analyserData = null;
  ctx = null;
  stream = null;
  msg({ type: 'status', active: false });
}
</script>
</body>
</html>
`;
