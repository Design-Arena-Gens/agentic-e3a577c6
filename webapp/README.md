## Luxury Reel Automation

A Next.js application that automates sourcing luxury lifestyle clips from Pexels and publishes them to Instagram using the Graph API. Designed to run on Vercel with a daily cron trigger and a manual control panel.

### Requirements

- Pexels API key: https://www.pexels.com/api/new/
- Instagram Business or Creator account connected to a Facebook Page
- Long-lived Instagram access token with `instagram_content_publish` scope
- Instagram User ID for the target account

Configure the following environment variables (`.env.local` for local dev, Vercel Project Settings for deployment):

```
PEXELS_API_KEY=...
IG_USER_ID=...
IG_ACCESS_TOKEN=...
# optional overrides
DEFAULT_CAPTION_TEMPLATE=Experience the finer things in life. ✨ #LuxuryLifestyle #DailyInspiration
GRAPH_API_VERSION=v19.0
```

The caption template supports `{photographer}` and `{attributionUrl}` placeholders and is automatically suffixed with luxury hashtags and source credit.

### Running locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and use the “Run Now” button to trigger a manual upload. The API endpoint lives at `/api/run-automation` and accepts a `POST` request.

### Scheduled automation

To let Vercel trigger the workflow automatically, copy `vercel.cron.example.json` to `vercel.json` and deploy. The sample schedules a daily run at 09:00 UTC:

```json
{
  "crons": [
    {
      "path": "/api/run-automation",
      "schedule": "0 9 * * *"
    }
  ]
}
```

Adjust the cron expression to your preferred cadence before deployment.

> **Note**  
> Some Vercel plans limit the number of cron jobs per team. If deployment fails with a quota error, remove or consolidate existing jobs in the Vercel dashboard before enabling this schedule.

### How publishing works

1. Queries Pexels for a landscape “luxury lifestyle” video and picks a high-resolution file.
2. Confirms the clip URL is publicly accessible.
3. Builds a caption with credit and luxury hashtags.
4. Creates an Instagram upload container via the Graph API.
5. Polls processing status and publishes the reel once ready.

Errors are surfaced in the UI log and the API response for quick troubleshooting.
