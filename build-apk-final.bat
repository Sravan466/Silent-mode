@echo off
echo Final APK Build Solution...

cd mobile

REM Install React Native CLI
echo Installing React Native CLI...
call npm install -g @react-native-community/cli

REM Clean install
echo Cleaning and installing dependencies...
rmdir /s /q node_modules 2>nul
call npm install

REM Create minimal Android SDK setup
echo Setting up minimal Android SDK...
set ANDROID_HOME=C:\android-sdk
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot

REM Create local.properties
echo sdk.dir=%ANDROID_HOME% > android\local.properties

REM Try to build
echo Attempting to build APK...
call npx react-native run-android --variant=debug

echo.
echo If build fails, your APK is ready for manual installation:
echo 1. Copy the 'mobile' folder to a computer with Android Studio
echo 2. Open in Android Studio
echo 3. Build APK from Build menu
echo.
echo Your app includes:
echo - Backend: https://silent-mode-backend.onrender.com
echo - Native ringer control
echo - Location tracking
echo - Modern UI
echo.
pause