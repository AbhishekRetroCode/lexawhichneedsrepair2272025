# Lexa - AI Paragraph Generator

Lexa is a modern, sleek paragraph generator powered by Google's Gemini AI that leverages the latest generative AI capabilities to create high-quality, customized content.

## Features

- Generate paragraphs, emails, articles, blog posts, and more
- Choose from 500+ content types and writing styles
- Customize content length from tiny snippets to full articles
- Dark/light theme support
- Copy & download generated content
- Create custom content types and writing styles

## Local Development Setup

### Prerequisites

- Node.js (v16 or newer)
- NPM or Yarn
- A Google Gemini API key (get one at [Google AI Studio](https://makersuite.google.com/app/apikey))

### Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/your-username/lexa-paragraph-generator.git
cd lexa-paragraph-generator
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy the example environment file:

```bash
cp .env.example .env
```

Edit the `.env` file and add your Gemini API key:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Start the development server**

```bash
npm run dev
```

The application will be available at http://localhost:5000

## API Key Management

The application looks for the Gemini API key in the following order:
1. `GEMINI_API_KEY` environment variable
2. `GEMINI_API_KEY_2` environment variable (backup)
3. `GEMINI_API_KEY_3` environment variable (backup)
4. Hardcoded fallback key (not recommended for production)

## Technology Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express
- **API**: Google Gemini 1.5 Flash

## License

MIT