@echo off
echo Installing Android SDK...

REM Create Android SDK directory
mkdir "C:\Users\SRAVAN\AppData\Local\Android\Sdk" 2>nul

REM Download command line tools
echo Downloading Android Command Line Tools...
curl -o commandlinetools.zip https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip

REM Extract to SDK directory
echo Extracting...
powershell -command "Expand-Archive -Path commandlinetools.zip -DestinationPath 'C:\Users\SRAVAN\AppData\Local\Android\Sdk' -Force"

REM Create proper directory structure
mkdir "C:\Users\SRAVAN\AppData\Local\Android\Sdk\cmdline-tools\latest" 2>nul
move "C:\Users\SRAVAN\AppData\Local\Android\Sdk\cmdline-tools\*" "C:\Users\SRAVAN\AppData\Local\Android\Sdk\cmdline-tools\latest\" 2>nul

REM Set environment variables
setx ANDROID_HOME "C:\Users\SRAVAN\AppData\Local\Android\Sdk"
setx PATH "%PATH%;C:\Users\SRAVAN\AppData\Local\Android\Sdk\platform-tools;C:\Users\SRAVAN\AppData\Local\Android\Sdk\cmdline-tools\latest\bin"

REM Install required SDK components
echo Installing SDK components...
echo y | "C:\Users\SRAVAN\AppData\Local\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" "platform-tools"
echo y | "C:\Users\SRAVAN\AppData\Local\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" "platforms;android-34"
echo y | "C:\Users\SRAVAN\AppData\Local\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" "build-tools;34.0.0"

del commandlinetools.zip

echo Android SDK installed successfully!
echo Please restart your command prompt and run the build again.
pause