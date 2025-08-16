@echo off
set /p BACKEND_URL="Enter your deployed backend URL (e.g., https://your-app.onrender.com): "

echo Updating mobile app API URL...

REM Update the API URL in mobile app
powershell -Command "(Get-Content 'mobile\src\services\api.js') -replace 'https://your-backend-url.herokuapp.com/api', '%BACKEND_URL%/api' | Set-Content 'mobile\src\services\api.js'"

echo API URL updated to: %BACKEND_URL%/api
echo Now rebuild your APK!
pause