@echo off
echo Building APK using React Native CLI...

cd mobile

REM Clean and install dependencies
echo Cleaning project...
call npx react-native clean
call npm install

REM Generate keystore if not exists
if not exist android\app\my-upload-key.keystore (
    echo Generating keystore...
    keytool -genkeypair -v -storetype PKCS12 -keystore android/app/my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000 -storepass silentzone -keypass silentzone -dname "CN=Silent Zone"
)

REM Set environment variables
set ANDROID_HOME=C:\Users\SRAVAN\AppData\Local\Android\Sdk
set PATH=%PATH%;%ANDROID_HOME%\platform-tools

REM Build release APK
echo Building release APK...
cd android
call gradlew.bat clean
call gradlew.bat assembleRelease

echo.
echo ========================================
echo APK BUILD COMPLETE!
echo ========================================
echo.
echo APK Location: mobile\android\app\build\outputs\apk\release\app-release.apk
echo.
pause