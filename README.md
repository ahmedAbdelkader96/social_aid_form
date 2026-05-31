# Social Aid aidForm

This repository contains a multi-step social support aidForm built with React, TypeScript, Vite, Redux Toolkit, React Hook Form, Axios, and i18next.

## Features

- 3-step aidForm wizard with progress bar
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

## AI setup

Create a `.env` file in the project root with the following content:

```env
VITE_AI_API_KEY=your_ai_api_key_here
VITE_AI_API_URL=https://api.groq.com/openai/v1/chat/completions
```

Then restart the development server.

## Notes

- The AI integration uses a Groq/OpenAI-compatible chat completions endpoint by default.
- The aidForm state and current step are persisted in LocalStorage so users can continue the form later.
- The submission process is mocked in `src/shared/api/mockApi.ts` to simulate network delays and handle failures gracefully.

## Architecture

- `src/app`: Redux store and typed hooks
- `src/features/aidForms`: form wizard components, slice, and feature styles
- `src/shared/api`: API client and AI integration helpers
- `src/shared/i18n.ts`: aidForm internationalization configuration
- `src/shared/helpers/storage.ts`: LocalStorage persistence helpers

## Improvements

Future improvements could include:

- real backend submission endpoint
- formal form validation schema with Zod or Yup
- richer accessibility tests and keyboard focus management
- full RTL polish for language-specific labels and step flow



