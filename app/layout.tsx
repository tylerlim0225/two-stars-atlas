import './globals.css';
import type { Metadata, Viewport } from 'next';
import { AtlasProvider } from '@/lib/atlas-context';
import LenisProvider from '@/components/LenisProvider';

export const metadata: Metadata = {
  title: 'Two Stars Atlas · 우리만의 밤하늘',
  description: '태윤💛지은 — 모든 기억은 별이 되었다.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#06050A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Noto+Serif+KR:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-night-950 text-ivory">
        <AtlasProvider>
          <LenisProvider>{children}</LenisProvider>
        </AtlasProvider>
      </body>
    </html>
  );
}
