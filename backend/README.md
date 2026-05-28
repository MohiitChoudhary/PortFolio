# Backend API for Portfolio

This backend serves a simple contact endpoint for your portfolio site.

## Running locally

1. Open a terminal in `backend`
2. Install packages:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

4. Open the frontend from `portfolio` and submit the contact form.

## Environment variables

- `PORT` — port number that the server listens on
- `CORS_ORIGINS` — comma-separated origins allowed by CORS; defaults to `*`

Example:

```bash
PORT=5000 CORS_ORIGINS=http://localhost:8000 npm start
```

## Hosting options

You can deploy this backend to any Node-friendly host such as:

- Render
- Railway
- Fly.io
- Vercel (Serverless functions)
- Heroku

For most hosts, set:

- `PORT` from the platform
- `CORS_ORIGINS` to your frontend origin

## Railway deployment

1. Install the Railway CLI if you want local deployment control:

```bash
npm install -g @railway/cli
```

2. From the `backend` folder, initialize Railway:

```bash
railway init
```

3. Deploy the service:

```bash
railway up
```

4. After deployment, note the generated domain, for example:

```text
https://your-app.up.railway.app
```

5. Update the frontend contact form `data-backend-url` in `index.html` to the deployed endpoint:

```html
<form id="contactForm" data-backend-url="https://your-app.up.railway.app/contact">
```

6. Set `CORS_ORIGINS` in Railway to your frontend origin, such as:

```text
https://your-frontend-domain.com
```

This keeps the backend protected and the frontend pointing to the correct deployed API.
