{# NewsDigest

NewsDigest is a Next.js application that summarizes news articles from URLs using AI.

## Features

-   **URL Input:** Input field for users to paste the URL of a news article.
-   **Article Summarization:** AI-powered summarization tool that extracts key information from the article content.
-   **Summarized Output:** Display the summarized content in a clear, concise format.
-   **Copy to Clipboard:** Provides a button for users to copy the summarized content to their clipboard.

## Prerequisites

Before running the application, ensure you have the following:

-   Node.js installed (version 18 or higher)
-   npm or yarn package manager

## Getting Started

1.  Clone the repository:

    ```bash
    git clone <repository_url>
    cd <project_directory>
    ```

2.  Install the dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3.  Set up your environment variables:

    Create a `.env` file in the root directory of the project and add your Google Gemini API key:

    ```
    GOOGLE_GENAI_API_KEY=YOUR_API_KEY
    ```

4.  Run the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Genkit Development

To start Genkit development, use:

```bash
npm run genkit:dev
```

To watch for changes in Genkit files, use:

```bash
npm run genkit:watch
```

## Build & Run for Production

To build the application for production:

```bash
npm run build
```

To run the production build:

```bash
npm run start
```

## Contributing

Feel free to contribute to the project by submitting pull requests, reporting issues, or suggesting new features.

