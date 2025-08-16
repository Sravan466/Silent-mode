@echo off
echo Building APK without Android Studio...

REM Set environment variables
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot

REM Navigate to mobile directory
cd mobile

REM Install dependencies
echo Installing dependencies...
call npm install

REM Generate release keystore if not exists
if not exist android\app\my-upload-key.keystore (
    echo Generating release keystore...
    "%JAVA_HOME%\bin\keytool" -genkeypair -v -storetype PKCS12 -keystore android/app/my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000 -storepass silentzone -keypass silentzone -dname "CN=Silent Zone, OU=Mobile, O=SilentZone, L=City, S=State, C=US"
)

REM Build APK
echo Building APK...
cd android
call gradlew assembleRelease

echo APK built successfully!
echo Location: mobile\android\app\build\outputs\apk\release\app-release.apk
pause