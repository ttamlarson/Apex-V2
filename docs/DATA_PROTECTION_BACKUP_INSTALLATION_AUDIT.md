# OVERLOAD data protection, backup and installation audit

**Audited release:** 5.10.0  
**Remediation release:** 5.11.0  
**Architecture:** static GitHub Pages PWA; local-first browser storage; no user accounts or automatic cloud sync.

## Executive summary

OVERLOAD does not currently send workout, nutrition, measurement or recovery records to an OVERLOAD backend. The primary dataset is stored in browser localStorage under the legacy key `apexProtocolData_v1`, intentionally retained for migration compatibility. This means records are tied to the browser profile and site origin on one device. They do not automatically follow a user to another phone or computer.

This is a privacy advantage compared with a centrally hosted user database, but it is also a data-loss risk: clearing website data, losing a device, browser profile corruption, private-browsing cleanup or storage exhaustion can make records unavailable. Users must export and store their own backups.

## Findings and remediation

| Area | Finding | Status |
|---|---|---|
| Data location | Primary app records are stored in browser localStorage; no app account or sync backend exists | Documented |
| Cross-device recovery | No automatic sync; users need to export/import | Documented |
| Save failures | Previous save path could throw on quota/storage errors; quiet persist failures were possible | Hardened with visible warning |
| Backup export | JSON export existed; object URL was revoked immediately after click | Fixed with delayed URL cleanup and metadata |
| Backup restore | Validation was minimal and safety copy depended on a legacy global not loaded by this app | Fixed: schema checks and a downloaded pre-restore safety backup |
| Restore compatibility | Legacy exports remain accepted when core record arrays are present | Preserved |
| Offline shell | Service worker cache used query-string versions that did not match some script URLs | Fixed with query-insensitive cache matching and aligned core assets |
| PWA identity | Manifest used stale icon query versions and did not explicitly include standard 192/512 PNG icons | Fixed |
| Installation guidance | iPhone instructions existed; Android and desktop guidance was incomplete | Expanded below |
| Third-party code | QR scanner library is loaded from unpkg and executes in the app page context | Residual risk; review/vendor and pin with SRI before handling sensitive data |
| Feedback | Beta feedback is opt-in and opens public GitHub issue creation | Keep reports free of personal or health data |

## Data protection guidance for users

- Use a device passcode and keep the operating system and browser updated.
- Do not share an unlocked browser profile with other people.
- Do not use private browsing for records you intend to keep.
- Export a backup after meaningful updates and at least weekly during regular use.
- Keep two backup copies in separate places, such as a private cloud drive and an encrypted computer backup.
- Treat exported JSON files as private health and fitness information. Store them securely and do not post them publicly.
- Before changing phones, browsers, site domains or clearing website data, export a backup and confirm it has downloaded.
- OVERLOAD does not provide server-side recovery if a device and its backups are lost.

## Backup and restore procedure

1. Open OVERLOAD → Settings → Backup & restore.
2. Choose **Export JSON backup**.
3. Confirm the file `overload-backup-YYYY-MM-DD.json` exists in Files/Downloads.
4. Copy it to a secure second location.
5. On the destination browser/device, open the same OVERLOAD site and choose **Import backup**.
6. Select the JSON file and confirm. OVERLOAD downloads a separate pre-restore safety copy before replacing local records.
7. Check workout history, programmes, nutrition, measurements, recovery and cardio records.

Never test restore over a user's only copy of real records. Use a separate test profile or device.

## Installation

### iPhone / iPad
1. Open the live URL in Safari (not an in-app browser).
2. Tap Share → Add to Home Screen.
3. Keep the suggested OVERLOAD name and add it.
4. Launch from the Home Screen. Keep Safari website data intact.
5. After a major release, open the web app online and accept the in-app update prompt. If the icon or app shell is stale, close the app, open the URL in Safari and relaunch.

### Android
1. Open the live URL in Chrome.
2. Use the browser's Install app / Add to Home screen option.
3. Confirm installation and launch from the app icon.
4. Open the app online periodically so service-worker updates can be downloaded.

### Desktop
1. Open the live URL in a supported Chromium browser such as Chrome or Edge.
2. Use the install icon in the address bar or browser menu → Install OVERLOAD.
3. Launch from the installed app shortcut. The browser tab remains a supported fallback.

## Release verification checklist

- [ ] Install from the production Pages URL on real iPhone Safari.
- [ ] Install from Chrome on Android.
- [ ] Install from Chrome or Edge desktop.
- [ ] Create a disposable test workout, food entry, measurement and recovery record.
- [ ] Export backup and inspect that the JSON file downloads.
- [ ] Restore on a separate browser profile and compare records.
- [ ] Restore an older valid export and verify legacy compatibility.
- [ ] Attempt an invalid JSON file and confirm existing records remain unchanged.
- [ ] Load once online, switch to airplane mode, relaunch and verify cached app shell.
- [ ] Publish a new release and verify the update prompt appears without clearing user storage.

## Scope and limitations

This is a source-code and configuration audit, not a formal penetration test, independent device lab test, legal privacy assessment or guarantee against browser/device failure. The production installation and backup restore checklist still needs execution on physical iOS, Android and desktop devices. No automatic cloud backup, account recovery, encryption-at-rest layer controlled by OVERLOAD, or cross-device sync has been added.
