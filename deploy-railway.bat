@echo off
echo Deploying to Railway...

cd backend

REM Install Railway CLI
npm install -g @railway/cli

REM Login and deploy
railway login
railway init
railway add
railway deploy

echo Backend deployed! Copy the URL and update mobile app.
pause