# Deployment Guide

This project is ready for deployment! Follow these steps to deploy the Frontend to **Vercel** and the Backend to **Render**.

## 1. Backend Deployment (Render)

1.  Push your code to a Git repository (GitHub/GitLab/Bitbucket).
2.  Log in to [Render](https://render.com/).
3.  Click **New +** and select **Web Service**.
4.  Connect your repository and select the `Backend` folder as the **Root Directory**.
5.  **Configure the service:**
    *   **Name:** `mern-dashboard-backend` (or similar)
    *   **Runtime:** Node
    *   **Build Command:** `npm install`
    *   **Start Command:** `node server.js`
6.  **Environment Variables (Crucial):**
    Add the following variables in the "Environment" tab:
    *   `NODE_ENV`: `production`
    *   `MONGO_URI`: Your MongoDB connection string (from MongoDB Atlas).
    *   `JWT_SECRET`: A strong secret key for authentication.
    *   `CLIENT_URL`: The URL of your future Vercel frontend (e.g., `https://your-app.vercel.app`). *You can update this after deploying the frontend.*
7.  Click **Create Web Service**.
8.  **Copy the Backend URL** provided by Render (e.g., `https://mern-dashboard-backend.onrender.com`).

## 2. Frontend Deployment (Vercel)

1.  Log in to [Vercel](https://vercel.com/).
2.  Click **Add New...** -> **Project**.
3.  Import your repository.
4.  **Configure the project:**
    *   **Framework Preset:** Vite
    *   **Root Directory:** `Frontend` (Click "Edit" next to Root Directory and select the `Frontend` folder).
5.  **Environment Variables:**
    Expand the "Environment Variables" section and add:
    *   `VITE_API_URL`: The Backend URL you copied from Render, **PLUS `/api`** at the end.
        *   Example: `https://mern-dashboard-backend.onrender.com/api`
6.  Click **Deploy**.

## 3. Final Connection

1.  Once the Frontend is deployed, copy its URL (e.g., `https://your-app.vercel.app`).
2.  Go back to your **Render Dashboard** > **Environment**.
3.  Update the `CLIENT_URL` variable to your new Vercel URL.
4.  Render will automatically redeploy the backend.

## Troubleshooting

-   **CORS Errors:** If you see CORS errors in the browser console, ensure the `CLIENT_URL` in Render *exactly* matches your Vercel URL (check for trailing slashes).
-   **White Screen on Refresh:** Ensure `vercel.json` exists in the Frontend folder (it handles routing).
-   **Database Connection:** Ensure "Network Access" in MongoDB Atlas allows connections from anywhere (`0.0.0.0/0`) or whitelist Render's IP addresses.
