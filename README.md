# Social Aid Application

This repository contains a multi-step social support application built with React, TypeScript, Vite, Redux Toolkit, React Hook Form, Axios, and i18next.

## Features

- 3-step application wizard with progress bar
- Responsive design for mobile, tablet, and desktop
- English and Arabic language support with RTL layout
- AI "Help Me Write" suggestions for the three narrative fields
- Local progress persistence using LocalStorage
- Mock API submission with graceful error handling
- Accessible form controls and keyboard-friendly interactions

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the app in your browser at `http://localhost:5173`

## OpenAI setup

Create a `.env` file in the project root with the following content:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

Then restart the development server.

## Notes

- The OpenAI integration uses `https://api.openai.com/v1/chat/completions` with model `gpt-3.5-turbo`.
- The application state and current step are persisted in LocalStorage so users can continue the form later.
- The submission process is mocked in `src/global/api/mockApi.ts` to simulate network delays and handle failures gracefully.

## Architecture

- `src/app`: Redux store and typed hooks
- `src/features/application`: form wizard components, slice, and feature styles
- `src/global/api`: API client and OpenAI integration helpers
- `src/global/i18n.ts`: application internationalization configuration
- `src/global/helpers/storage.ts`: LocalStorage persistence helpers

## Improvements

Future improvements could include:

- real backend submission endpoint
- formal form validation schema with Zod or Yup
- richer accessibility tests and keyboard focus management
- full RTL polish for language-specific labels and step flow
