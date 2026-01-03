# Google Places API Setup Guide

## Overview
This application uses Google Places API for real-time city autocomplete functionality with a graceful fallback to a local MySQL database.

## Getting Your API Key

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "GlobeTrotter" (or any name you prefer)
4. Click "Create"

### Step 2: Enable Places API
1. In the Google Cloud Console, navigate to "APIs & Services" → "Library"
2. Search for "Places API"
3. Click on "Places API" and then click "Enable"

### Step 3: Create API Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Your API key will be generated
4. **Important**: Click "Restrict Key" to secure it:
   - Under "API restrictions", select "Restrict key"
   - Check "Places API"
   - Click "Save"

### Step 4: Add to Environment
1. Copy your API key
2. Open `backend/.env` file
3. Replace `YOUR_GOOGLE_PLACES_API_KEY_HERE` with your actual API key:
   ```
   GOOGLE_PLACES_API_KEY=AIzaSyD...your_actual_key_here
   ```

## Testing the API

### Test with curl:
```bash
# Start your backend server
cd backend
npm run dev

# In another terminal, test the autocomplete endpoint:
curl "http://localhost:5000/api/cities/autocomplete?query=paris"
```

### Expected Response:
```json
{
  "success": true,
  "data": [
    {
      "placeId": "ChIJD7fiBh9u5kcRYJSMaMOCCwQ",
      "name": "Paris",
      "country": "France",
      "description": "Paris, France"
    }
  ],
  "source": "google"
}
```

## Fallback System

If the Google Places API fails (no API key, quota exceeded, network error), the system automatically falls back to the local MySQL database:

```json
{
  "success": true,
  "data": [...],
  "source": "database_fallback"
}
```

## Seeding Fallback Database

To populate the fallback city database:

```bash
cd backend
npm run seed:cities
```

This will seed ~50 popular cities worldwide with:
- Name and country
- Geographic coordinates
- Cost index (1-5)
- Popularity score
- Continent classification

## API Pricing & Quotas

### Free Tier
- **$200 free credit per month** (covers ~28,000 autocomplete requests)
- Places Autocomplete: $2.83 per 1,000 requests
- Places Details: $17 per 1,000 requests

### Recommendations
1. **Enable billing** in Google Cloud Console
2. **Set quota limits** to avoid unexpected charges
3. **Use the fallback database** for development/testing
4. The autocomplete debounces at 300ms to minimize API calls

## Troubleshooting

### "GOOGLE_PLACES_API_KEY not configured" Error
- Make sure you've added the API key to `backend/.env`
- Restart your backend server after updating `.env`

### "REQUEST_DENIED" Error
- Check that Places API is enabled in Google Cloud Console
- Verify API key restrictions aren't too strict
- Ensure billing is enabled for your project

### API Key Not Working
- Wait a few minutes after creating the key (can take up to 5 minutes to activate)
- Clear any browser/server cache
- Check the API key has no extra spaces when copied

## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use API restrictions** - Restrict to Places API only
3. **Set application restrictions** - Restrict to your backend server IP if deployed
4. **Monitor usage** - Set up billing alerts in Google Cloud Console
5. **Rotate keys periodically** - Generate new keys every few months

## Development vs Production

### Development
- Can use database fallback without API key for testing
- Seed the database with popular cities

### Production
- **Must have** Google API key for best user experience
- Set up proper error monitoring
- Configure rate limiting on your backend
- Consider caching popular searches

## Related Files

- Backend service: `backend/services/googlePlacesService.js`
- API routes: `backend/routes/cities.js`
- Frontend component: `src/pages/CreateTrip.tsx`
- Database seed: `backend/scripts/seed-cities.js`
- Database schema: `DATABASE_SCHEMA.sql` (cities table)

## Support

For issues with Google Places API:
- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service/overview)
- [Google Cloud Support](https://cloud.google.com/support)

For application-specific issues:
- Check the console logs in both frontend and backend
- Verify database connection is working
- Test the fallback endpoint: `/api/cities/search?query=paris`
