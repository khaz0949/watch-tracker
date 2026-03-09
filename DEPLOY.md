# Deploy to Railway (Ongoing Use)

Deploy the watch tracker so your co-founders can access it on phones, laptops, and tablets.

## Prerequisites

1. **GitHub account** – to host the code
2. **Railway account** – sign up at [railway.app](https://railway.app) (free tier available)

---

## Step 1: Push code to GitHub

If you haven’t already:

```bash
cd ~/Desktop/watch-tracker

# Initialize git (if needed)
git init

# Create .gitignore if it doesn't exist
echo "node_modules
.next
.env
.env.local
data/
*.db
.DS_Store" > .gitignore

# Add and commit
git add .
git commit -m "Initial commit - watch tracker"

# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/watch-tracker.git
git branch -M main
git push -u origin main
```

> **Note:** `data/` is in `.gitignore` so the local database isn’t pushed. Railway will create a fresh DB on deploy.

---

## Step 2: Deploy on Railway

1. Go to [railway.app](https://railway.app) and sign in (GitHub is easiest).
2. Click **New Project** → **Deploy from GitHub repo**.
3. Choose your `watch-tracker` repo (you may need to grant access).
4. Railway will detect the project and start building.

---

## Step 3: Add a volume (persistent database)

1. In your Railway project, click your service.
2. Go to the **Variables** tab.
3. Add: `DATA_DIR` = `/data`
4. Go to the **Settings** tab.
5. Under **Volumes**, click **Add Volume**.
6. Mount path: `/data`
7. Click **Add**.

This keeps the SQLite database across restarts.

---

## Step 4: Generate a public URL

1. Go to the **Settings** tab.
2. Under **Networking**, click **Generate Domain**.
3. Railway will create a URL like `watch-tracker-production-xxxx.up.railway.app`.

---

## Step 5: Redeploy (if needed)

After adding the volume and `DATA_DIR`:

1. Go to **Deployments**.
2. Click the **⋮** on the latest deployment → **Redeploy**.

---

## Share with co-founders

Send them the Railway URL (e.g. `https://watch-tracker-production-xxxx.up.railway.app`). They can open it on any device.

---

## Optional: Live Chrono24 data

To refresh live prices in production:

1. Add `RETAILED_API_KEY` in Railway **Variables**.
2. Run the refresh from your local machine (pointing at prod DB) or add a cron job.  
   For now, the app works with benchmark data without any API key.

---

## Optional: Custom domain

In Railway **Settings** → **Networking**, you can add a custom domain (e.g. `watches.yourcompany.com`).
