#!/bin/zsh
# Renders appstore.html into appstore/6.9/ (1320x2868). Usage: ./render-appstore.sh
# Headless Chrome sometimes hangs after writing the file, so wait for it then kill.
cd "$(dirname "$0")"
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p appstore/6.9
for i in 1 2 3 4; do
  out="appstore/6.9/hypebox-$i.png"; rm -f "$out"
  "$CH" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
    --user-data-dir="$(mktemp -d)" --force-device-scale-factor=1 --window-size=1320,2868 \
    --virtual-time-budget=6000 --screenshot="$out" "file://$PWD/appstore.html?s=$i" 2>/dev/null &
  pid=$!
  for t in {1..60}; do [[ -s "$out" ]] && break; sleep 0.5; done
  sleep 1; kill $pid 2>/dev/null; wait $pid 2>/dev/null
done
ls -l appstore/6.9
