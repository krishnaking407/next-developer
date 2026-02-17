# Deployment Guide for Creator Hub

This guide will help you deploy your project to GitHub and host it live on Vercel.

## Prerequisites

-   A GitHub account: [Sign up here](https://github.com/signup)
-   A Vercel account: [Sign up here](https://vercel.com/signup) (Recommended to sign up with GitHub)

## Step 1: Initialize Git (Already Done)
We have already initialized a local Git repository and committed your code.

## Step 2: Create a GitHub Repository
1.  Log in to your [GitHub account](https://github.com).
2.  Click the **+** icon in the top-right corner and select **New repository**.
3.  **Repository name**: Enter `creator-hub` (or any name you prefer).
4.  **Description**: Start-up landing page for creators (optional).
5.  **Public/Private**: Choose as per your preference.
6.  **Initialize this repository with**: DO NOT check any boxes (Readme, .gitignore, License). We want an empty repository to push our existing code to.
7.  Click **Create repository**.

## Step 3: Connect Local Code to GitHub
Once the repository is created, you will see a "Quick setup" page. Copy the URL under "…or push an existing repository from the command line". It looks like:
`https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git`

Run the following commands in your terminal (replace the URL with yours):

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Vercel
1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** > **Project**.
3.  Under **Import Git Repository**, find your new `creator-hub` repository and click **Import**.
4.  Vercel will automatically detect that this is a Vite project and configure the build settings.
5.  Click **Deploy**.

Wait a minute, and your site will be live! You'll get a URL like `https://creator-hub.vercel.app`.

## Troubleshooting
-   **Permission denied (publickey)**: Ensure your SSH keys are set up on GitHub, or use the HTTPS URL (handling login credentials might be required).
-   **Build failed**: Check the logs on Vercel. Common issues include missing dependencies or environment variables.
