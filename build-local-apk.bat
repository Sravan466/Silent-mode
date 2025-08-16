@echo off
echo Building APK locally without Android Studio...

cd mobile

REM Remove problematic Expo dependencies
echo Removing Expo dependencies...
call npm uninstall expo babel-preset-expo

REM Install React Native CLI
echo Installing React Native CLI...
call npm install -g @react-native-community/cli

REM Clean and reinstall dependencies
echo Cleaning and reinstalling...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul
call npm install

REM Remove Expo config files
del app.json 2>nul
del eas.json 2>nul
del babel.config.js 2>nul

REM Create React Native babel config
echo module.exports = { > babel.config.js
echo   presets: ['module:metro-react-native-babel-preset'], >> babel.config.js
echo }; >> babel.config.js

REM Create React Native metro config
echo const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config'); > metro.config.js
echo const config = {}; >> metro.config.js
echo module.exports = mergeConfig(getDefaultConfig(__dirname), config); >> metro.config.js

REM Build APK
echo Building APK...
call npx react-native build-android --mode=release

echo.
echo APK built successfully!
echo Location: android\app\build\outputs\apk\release\app-release.apk
echo.
pause