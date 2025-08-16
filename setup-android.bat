@echo off
echo Setting up Android environment...

REM Set Android SDK path
set ANDROID_HOME=C:\Users\SRAVAN\Android\Sdk
set ANDROID_SDK_ROOT=%ANDROID_HOME%

REM Add to PATH
set PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin;%ANDROID_HOME%\cmdline-tools\latest\bin

echo Android environment variables set!
echo ANDROID_HOME: %ANDROID_HOME%

REM Download command line tools if not exists
if not exist "%ANDROID_HOME%\cmdline-tools" (
    echo Downloading Android Command Line Tools...
    curl -o commandlinetools.zip https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip
    powershell -command "Expand-Archive -Path commandlinetools.zip -DestinationPath %ANDROID_HOME%"
    mkdir "%ANDROID_HOME%\cmdline-tools\latest"
    move "%ANDROID_HOME%\cmdline-tools\*" "%ANDROID_HOME%\cmdline-tools\latest\"
    del commandlinetools.zip
)

REM Install required SDK components
echo Installing Android SDK components...
echo y | "%ANDROID_HOME%\cmdline-tools\latest\bin\sdkmanager.bat" "platform-tools"
echo y | "%ANDROID_HOME%\cmdline-tools\latest\bin\sdkmanager.bat" "platforms;android-34"
echo y | "%ANDROID_HOME%\cmdline-tools\latest\bin\sdkmanager.bat" "build-tools;34.0.0"

echo Setup complete!
pause