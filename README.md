# Cloudinary Last Access Reports

A Next.js application that provides a user interface for managing and viewing Cloudinary's Last Access Reports. This tool helps you track when your Cloudinary assets were last accessed.

> **Disclaimer**: This is an independent, open-source project and is not officially affiliated with, endorsed by, or connected to Cloudinary. While it uses Cloudinary's API, it is maintained independently.

⚠️ Development Status
This project is in early development and actively being worked on. While functional, you may encounter bugs or incomplete features. The API and functionality are subject to change as I improve the application. I welcome feedback and contributions to help make it better!

## Features

- Generate new Last Access Reports
- View reports from the last 6 months
- Display detailed asset information for each report
- Paginated display of assets (100 at a time)
- Clean, modern UI using shadcn/ui components

## Prerequisites

- Node.js 18+ installed
- A Cloudinary account with API access
- Basic familiarity with Next.js (optional)

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/brad-j/cloudinary-lar.git
cd cloudinary-lar
```

2. Install dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

3. Create a `.env.local` file in the root directory with your Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

You can find these credentials in your Cloudinary Console under Settings > Access Keys. Generate a new API key and secret if you don't have one.

4. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

### Viewing Reports

- The main page displays a list of your Last Access Reports from the past 6 months
- Each report shows:
  - Report ID
  - Status
  - Resource Type
  - Date Range
  - Total Assets
  - Creation Date

### Generating Reports

1. Click the "Generate Report" button
2. Fill in the required information:
   - Date Range
   - Resource Type (optional)
   - Folders to Exclude (optional)

### Viewing Report Details

1. Click on a report's ID to view its details
2. The details page shows:
   - All assets included in the report
   - Last access date for each asset
   - Asset metadata (type, format, size, etc.)

## Development

The project uses:

- Next.js 15.0.2 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Cloudinary Admin API

## Local Development vs Deployment

This application can be run either locally or deployed to a hosting platform.

### Running Locally

Perfect for development or personal use. Follow the "Getting Started" instructions above.

### Deployment

If you want to deploy the application, you can use platforms like:

- Vercel
- Netlify
- Railway
- Your own server

Remember to set the environment variables on your hosting platform.

## Limitations

- Reports older than 6 months are filtered out
- Assets are fetched in batches of 100 to maintain performance
- API rate limits apply based on your Cloudinary plan

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgements

Made with ❤️ by [Brad Johnson](https://bradjohnson.io).

## License

[MIT](LICENSE)
