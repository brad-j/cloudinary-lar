import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cloudinary Last Access Reports',
  description:
    'Generate a report of the last access times for your Cloudinary assets',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
