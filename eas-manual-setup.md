# Manual EAS Build Setup

## Step 1: Create Expo Account
1. Go to https://expo.dev
2. Sign up for free account
3. Verify your email

## Step 2: Install EAS CLI
```bash
npm install -g @expo/cli eas-cli
```

## Step 3: Login
```bash
cd mobile
eas login
```

## Step 4: Initialize Project
```bash
npx eas-cli@latest init --id 9658d14d-1084-4bcc-8bc2-559e2ef7d3b3
```

## Step 5: Build APK
```bash
eas build --platform android --profile preview
```

## Step 6: Download APK
- Check your Expo dashboard
- Download APK when build completes
- Install on Android device

## Build Status
- Build will take 5-10 minutes
- You'll get email notification when complete
- APK download link available in dashboard