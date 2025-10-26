# Connection Status

## Server Connectivity Check

The application includes a server connectivity check feature that periodically verifies if the API server is accessible. This is implemented in:

- `app/lib/api.ts` - Contains the `checkServerConnectivity` function
- `components/ServerStatusIndicator.tsx` - Shows visual indicator of server status
- `utils/config.ts` - Contains the API base URL configuration

## Common Connection Issues

### Network Error
**Error**: `ERROR Server connectivity check failed: [AxiosError: Network Error]`

**Cause**: The mobile app cannot connect to the backend API server.

**Solution**: 
The issue typically occurs because the mobile app (running in Expo) uses `localhost` to connect to the API, but `localhost` on a mobile device refers to the device itself, not your computer running the API server.

### Resolution Steps:

1. **Ensure API server is running**:
   ```bash
   cd api
   npm run dev
   ```
   You should see: `🚀 ElSoug API Server running on port 5000`

2. **Update API URL for mobile devices**:
   - Find your computer's IP address: `ifconfig | grep "inet "`
   - Update `.env` file with your computer's IP:
     ```env
     EXPO_PUBLIC_API_BASE_URL=http://YOUR_IP_ADDRESS:5000/api/v1
     ```

3. **For Android Emulator**:
   The default URL in `utils/config.ts` already handles this: `http://10.0.2.2:5000/api/v1`

4. **Restart the Expo app** after changing environment variables:
   ```bash
   npx expo start --clear
   ```

## Health Check Endpoint

The application uses the `/health` endpoint to check server connectivity:
- URL: `http://your-server-address:5000/health`
- Method: GET
- Response: 200 status with health information if server is running

## Troubleshooting

If you continue to experience connection issues:
1. Verify the API server is running on port 5000
2. Check that your mobile device/simulator can access your computer's IP
3. Ensure firewall settings allow connections on port 5000
4. Confirm both devices are on the same network (for real devices)