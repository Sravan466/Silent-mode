@echo off
echo Building APK with EAS (Interactive Mode)...

cd mobile

echo.
echo INSTRUCTIONS:
echo 1. When prompted about keystore, press Y (Yes)
echo 2. When prompted about slug, press Y (Yes) 
echo 3. Wait for build to complete (5-10 minutes)
echo 4. Download APK from Expo dashboard
echo.

pause

npx eas-cli@latest build --platform android --profile preview

echo.
echo Build submitted! Check your Expo dashboard for download link.
echo Visit: https://expo.dev/accounts/[your-username]/projects/zonemute/builds
echo.
pause