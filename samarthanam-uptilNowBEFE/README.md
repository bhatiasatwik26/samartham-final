# Eventitopia

A comprehensive event management and volunteer coordination platform built with React, TypeScript, and Tailwind CSS.

## Project Structure

The project is organized with a feature-based folder structure:

```
src/
├── components/         # Shared UI components
├── data/               # Mock data and API models
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and helpers
├── pages/              # Application pages
│   ├── landing/        # Landing page components
│   │   ├── components/ # Landing-specific components
│   │   ├── Home.tsx    # Main landing page
│   │   └── index.ts    # Barrel exports
│   ├── volunteer/      # Volunteer dashboard feature
│   │   ├── components/ # Volunteer-specific components
│   │   │   ├── Achievements.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── Heatmap.tsx
│   │   │   ├── TaskSummary.tsx
│   │   │   ├── WelcomeSection.tsx
│   │   │   └── index.ts        # Barrel exports
│   │   ├── Dashboard.tsx       # Main volunteer dashboard
│   │   └── index.ts            # Barrel exports
│   ├── Events.tsx              # Events listing page
│   ├── EventDetail.tsx         # Event details page
│   ├── SignIn.tsx              # Authentication page
│   └── NotFound.tsx            # 404 page
└── App.tsx                     # Main application component with routing
```

## Features

- **Landing Page**: Introduction to the platform with feature highlights
- **Events Management**: Browse, search, and view event details
- **Volunteer Dashboard**:
  - Achievement badges and streak tracking
  - Task management and summary
  - Activity heatmap showing contribution history
  - Leaderboard with volunteer rankings

## Development

To start the development server:

```bash
npm run dev
```

## Building for Production

To create a production build:

```bash
npm run build
```

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/5faa707d-e520-4862-a223-f18fe8175964

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/5faa707d-e520-4862-a223-f18fe8175964) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/5faa707d-e520-4862-a223-f18fe8175964) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
