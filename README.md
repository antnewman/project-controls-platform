# Project Controls Intelligence Platform

**AI-powered project planning with risk analysis, WBS generation, and lessons learned. Built carefully, designed for lasting results.**

Supporting IPA Innovation Space Challenges 1, 2, and 4.

---

## What You Get

### Pre-Built Features

✅ **Risk Analysis Tool (Challenge 1)**
- CSV file upload and parsing
- SME heuristics application
- Quality scoring (1-10)
- Improvement suggestions
- Export enhanced risk registers

✅ **WBS Generator (Challenge 2)**
- Project narrative input
- AI-powered WBS generation
- Phase and activity breakdown
- Dependency mapping
- Milestone identification
- CSV export

✅ **Lessons Library (Challenge 4)**
- Document upload (Gateway reviews, NISTA, assurance reports)
- AI-powered lesson extraction
- Automatic categorization and tagging
- Searchable lessons repository
- Integration with Risk Analysis and WBS Generator
- Lessons SME chatbot for guidance

✅ **Integrated Workflow (Challenges 1 + 2 + 4)**
- End-to-end project planning
- WBS → Risk identification → Lessons review → Quality analysis
- Unified results dashboard

### Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **AI**: Anthropic Claude (Sonnet 4)
- **Database**: Supabase (optional)
- **Icons**: Lucide React
- **Animations**: Framer Motion

---

## Environment Setup

This project requires API keys for Supabase and Anthropic Claude.

### Step 1: Copy the environment template
```bash
cp .env.example .env
```

### Step 2: Get your API keys

1. **Supabase**:
   - Sign up at https://supabase.com
   - Create a new project
   - Go to Settings > API
   - Copy the URL and anon/public key

2. **Anthropic Claude**:
   - Sign up at https://console.anthropic.com
   - Go to API Keys
   - Create a new key
   - Copy the key

### Step 3: Update .env file

Open `.env` and paste your actual keys:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

### Step 4: Restart dev server
```bash
npm run dev
```

**Important**: Never commit the `.env` file to git. It contains secrets!

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
