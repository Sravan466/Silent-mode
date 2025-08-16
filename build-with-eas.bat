@echo off
echo Building APK with Expo Application Service...

cd mobile

echo Step 1: Install EAS CLI
call npm install -g @expo/cli eas-cli

echo Step 2: Login to Expo (you'll need to create account at expo.dev)
call eas login

echo Step 3: Initialize project
call npx eas-cli@latest init --id 9658d14d-1084-4bcc-8bc2-559e2ef7d3b3

echo Step 4: Build APK
call eas build --platform android --profile preview

echo APK build started! Check your Expo dashboard for progress.
echo Download link will be available once build completes.
pause