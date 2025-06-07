# Setting Up Road Distance Calculation with OpenRouteService API

## Overview

This application now uses the OpenRouteService API to calculate actual road distances between locations instead of straight-line (as-the-crow-flies) distances. This provides more accurate route planning and distance calculations.

## Getting an API Key

To use the OpenRouteService API, you need to obtain a free API key:

1. Go to [OpenRouteService Sign Up](https://openrouteservice.org/dev/#/signup)
2. Create an account and sign in
3. Navigate to your dashboard
4. Create a new API key with the "Matrix" service enabled
5. Copy your API key

## Configuring the Application

1. Open the file `src/utils/routeApi.ts`
2. Replace the placeholder API key with your actual API key:

```typescript
const ORS_API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
```

## API Usage Limits

The free tier of OpenRouteService API has the following limitations:

- 2,000 requests per day
- 40 requests per minute
- Maximum of 50 locations per request for the Matrix API

If you need higher limits, consider upgrading to a paid plan or implementing request throttling in the application.

## Fallback Mechanism

The application includes a fallback mechanism that will automatically revert to straight-line distance calculations if:

1. The API key is not configured
2. The API request fails for any reason
3. API usage limits are exceeded

This ensures the application remains functional even without API access.

## Technical Implementation

The road distance calculation is implemented in the following files:

- `src/utils/routeApi.ts` - API client for OpenRouteService
- `src/utils/distance.ts` - Distance calculation functions with API integration
- `src/utils/optimization.ts` - Route optimization using the distance calculations
- `src/context/RouteContext.tsx` - Context provider with async route optimization

## Troubleshooting

If you encounter issues with the API:

1. Check that your API key is correctly entered
2. Verify that you have enabled the Matrix service for your API key
3. Check the browser console for error messages
4. Ensure you haven't exceeded the API usage limits