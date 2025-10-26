# Connection Issues and Solutions

## Common Network Error

If you're seeing this error:

```
ERROR y check failed: [AxiosError: Network Error]
```

This typically means the mobile app cannot connect to the backend API server.

## Root Cause

The mobile app (running in Expo on a simulator or device) cannot connect to `localhost:500` because:

- `localhost` refers to the device itself, not your computer running the API server
- The API server is running on your computer at `localhost:500`
- The mobile app needs to connect to your computer's IP address

## Solutions

### 1. For iOS Simulator

Use your computer's IP address instead of localhost:

1. Find your computer's IP address:

   - On macOS: Open Terminal and run `ifconfig | grep "inet "`
   - Look for your WiFi IP (usually starts with 192.168.x.x or 10.x.x.x)

2. Update your `.env` file:
   ```env
   EXPO_PUBLIC_API_BASE_URL=http://YOUR_IP_ADDRESS:5000/api/v1
   ```

### 2. For Android Emulator

The default configuration in `utils/config.ts` already handles this:

```ts
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://10.0.2.2:5000/api/v1";
```

The IP `10.0.2.2` is the host computer from the Android emulator.

### 3. For Real Devices (iOS/Android)

1. Make sure your mobile device and computer are on the same WiFi network
2. Find your computer's IP address (as described above)
3. Update your `.env` file:
   ```env
   EXPO_PUBLIC_API_BASE_URL=http://YOUR_IP_ADDRESS:5000/api/v1
   ```

### 4. Verify API Server is Running

Make sure your API server is running:

```bash
cd api
npm run dev
```

You should see:

```
🚀 ElSoug API Server running on port 5000
```

### 5. Test the Connection

Test that your API server is accessible from your mobile device:

- On your computer: `curl http://localhost:5000/health`
- From your mobile device browser: `http://YOUR_COMPUTER_IP:5000/health`

## Troubleshooting Steps

1. **Check if the API server is running**: Look for the message `🚀 ElSoug API Server running on port 5000`

2. **Verify the IP address**: Ensure the IP address in your `.env` file is correct and accessible

3. **Check firewall settings**: Make sure your computer's firewall allows connections on port 5000

4. **Restart Expo**: After changing the environment variable, restart your Expo app:

   ```bash
   npm start
   ```

5. **Clear Expo cache** if still having issues:
   ```bash
   npx expo start --clear
   ```

## Environment Configuration Examples

### Development with iOS Simulator

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:5000/api/v1
```

### Development with Android Emulator

```env
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:5000/api/v1
```

### Production

```env
EXPO_PUBLIC_API_BASE_URL=https://your-deployed-api-url.com/api/v1
```
