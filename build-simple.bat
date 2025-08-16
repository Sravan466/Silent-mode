@echo off
echo Building Silent Zone APK...

cd mobile

REM Install dependencies
echo Installing dependencies...
call npm install

REM Generate keystore
echo Generating keystore...
if not exist android\app\my-upload-key.keystore (
    keytool -genkeypair -v -storetype PKCS12 -keystore android/app/my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000 -storepass silentzone -keypass silentzone -dname "CN=Silent Zone"
)

REM Build APK
echo Building APK...
cd android
call gradlew assembleRelease

echo.
echo ========================================
echo APK BUILD COMPLETE!
echo ========================================
echo.
echo APK Location: mobile\android\app\build\outputs\apk\release\app-release.apk
echo.
echo You can now install this APK on your Android device!
echo.
pause