import './globals.css';
import { ThemeProvider } from '@/hooks/useTheme';
import AppShell from '@/components/layout/AppShell';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';

export const metadata = {
  title: {
    default: `${SITE_NAME} — Genshin Impact Companion`,
    template: `%s | ${SITE_NAME}`,
  },
  icons: {
    icon: '/images/paimon_icon.png',
    shortcut: '/images/paimon_icon.png',
    apple: '/images/paimon_icon.png',
  },
  keywords: ['Genshin Impact', 'guide', 'builds', 'characters', 'weapons', 'artifacts', 'team builder', 'farming'],
  openGraph: {
    title: `${SITE_NAME} — Genshin Impact Companion`,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    type: 'website',
    images: [{ url: '/images/paimon_icon.png' }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/paimon_icon.png" />
      </head>
      <body>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
