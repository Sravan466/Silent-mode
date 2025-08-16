@echo off
echo Setting up Codemagic build...

REM Initialize git if not already done
if not exist .git (
    echo Initializing Git repository...
    git init
    git branch -M main
)

REM Add all files
echo Adding files to Git...
git add .

REM Commit changes
echo Committing changes...
git commit -m "Add Silent Zone React Native app with Codemagic config"

echo.
echo ========================================
echo NEXT STEPS:
echo ========================================
echo.
echo 1. Create a GitHub repository named 'silent-zone-app'
echo 2. Run these commands:
echo    git remote add origin https://github.com/YOUR_USERNAME/silent-zone-app.git
echo    git push -u origin main
echo.
echo 3. Go to codemagic.io and connect your GitHub repository
echo 4. Click "Check for configuration file"
echo 5. Your APK will be built automatically!
echo.
pause