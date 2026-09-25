# HypeBox App Store listing

Copy for App Store Connect. Character limits are Apple's; counts are noted next to each field.

---

## App name (30 max)

**HypeBox: Bluetooth Speaker Mic** (30)

Fallback if the name is taken: **HypeBox - Speaker Mic** (21)

## Subtitle (30 max)

**Your phone is now a mic** (23)

## Promotional text (170 max)

Music's loud and you need to talk. Hold the button and your voice comes out of the Bluetooth speaker, right on top of the playlist. No PA, no extra mic. (152)

## Description

Music's playing, the Bluetooth speaker is loud, and you need to make an announcement. No mic.

HypeBox turns the phone in your pocket into one.

Hold the button, say your thing, and it plays through the Bluetooth speaker you're already using. Your music app keeps playing, so the vibe doesn't stop.

HOW IT WORKS
- Connect your phone to a Bluetooth speaker
- Start your music in any app
- Open HypeBox and hold the button
- Talk. Let go when you're done

PICK YOUR DELAY
HypeBox records your voice in short clips and plays each one through the speaker. You choose how long each clip is, from 1 to 5 seconds. Shorter feels closer to live. Longer is steadier on slower speakers.

GOOD FOR
- House parties and birthdays
- Toasts and shout-outs
- Workout classes
- Game day
- Any room with a speaker and no PA

PRIVATE BY DESIGN
The mic only listens while you hold the button. Nothing is uploaded, there are no accounts, and there's no tracking.

Note: HypeBox has a short delay by design (the 1 to 5 seconds you pick). It's built for announcements and hype, not live singing.

## Keywords (100 max, comma-separated, no spaces after commas)

```
microphone,party,megaphone,announce,PA,loudspeaker,hype,DJ,toast,voice,birthday,karaoke,push to talk
```
(100)

Name and subtitle words (HypeBox, Bluetooth, speaker, mic, phone) are already indexed, so they're left out here on purpose.

## URLs

- Privacy Policy URL: https://leslie-23.github.io/BTmic/privacy.html
- Support URL: https://leslie-23.github.io/BTmic/support.html
- Marketing URL: https://leslie-23.github.io/BTmic/

## Category

- Primary: **Music**
- Secondary: **Utilities**

## Age rating

Answer "None" to every content question in the age rating questionnaire. No user-generated content is shared with other users, no web access, no chat, no ads, no gambling. Expected result: **4+**.

## App Review notes

Paste this into App Review Information > Notes:

> HypeBox plays your voice through a connected Bluetooth speaker while you hold the on-screen button. No login or account is needed.
>
> To test:
> 1. Pair the device with any Bluetooth speaker (headphones also work).
> 2. Optional: start music in Apple Music or another app.
> 3. Open HypeBox and allow microphone access.
> 4. Press and hold the big button in the middle of the screen and speak. Your voice plays through the speaker after the delay shown at the bottom (default 2 seconds, adjustable from 1 to 5). Release the button to stop.
>
> Without a Bluetooth speaker: the app still works. Audio plays through the iPhone's built-in speaker after the same delay. You may hear a short echo of yourself, which is expected.
>
> The microphone is only used while the button is held. Recordings are short temporary clips used for immediate playback. Nothing is uploaded, stored on a server, or shared. The app has no network features, analytics, or ads.

---

## What you still need to do

- [ ] **Apple Developer Program** membership ($99/year) on the account that will own the app.
- [ ] **Register the bundle ID** `com.lesliepaulajayi.hypebox` (EAS can do this for you on the first `eas build`).
- [ ] **Create the app record** in App Store Connect with the name, bundle ID, SKU (e.g. `hypebox-ios`) and primary language.
- [ ] **Fill in `eas.json` submit.production**: `appleId`, `ascAppId` (the numeric Apple ID on the App Information page) and `appleTeamId`.
- [ ] **Privacy nutrition label**: choose "Data Not Collected". Checked in the code: no network calls, no analytics, no crash reporting, no ads SDKs. Re-check if any of that gets added.
- [x] **Privacy policy URL**: https://leslie-23.github.io/BTmic/privacy.html (source in `docs/privacy.html`, served by GitHub Pages from `/docs` on `main`). Paste into App Store Connect > App Privacy > Privacy Policy URL.
- [x] **Support URL**: https://leslie-23.github.io/BTmic/support.html (source in `docs/support.html`). Paste into the version's Support URL field.
- [x] **Marketing URL** (optional): https://leslie-23.github.io/BTmic/
- [ ] **Turn on GitHub Pages** for the repo (Settings > Pages > Deploy from a branch > `main` / `/docs`) and check all three URLs load before submitting.
- [x] **Screenshots**: 6.9" set done in `marketing/appstore/6.9/` (1320 x 2868, re-render with `marketing/render-appstore.sh`). 6.9" is required. Add 6.5" (1284 x 2778 or 1242 x 2688) as well to cover older devices. iPad isn't needed because `supportsTablet` is off.
- [x] **Export compliance**: already answered in `app.json` (`ITSAppUsesNonExemptEncryption: false`), so App Store Connect won't ask.
- [ ] **Age rating** questionnaire (see above).
- [ ] **Pricing and availability**: pick price and countries.
- [ ] **Test on a real iPhone with a real Bluetooth speaker** before submitting (TestFlight build via `eas build -p ios --profile production` then `eas submit -p ios`).
