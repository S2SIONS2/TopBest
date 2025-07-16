import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Link from 'next/link'; // Moved Link import to top

config.autoAddCss = false

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://topbest.vercel.app/'),
  title: "TopBest Games",
  description: "커뮤니티가 직접 추천하고 순위를 매기는 최고의 Steam 게임들을 만나보세요.",
  openGraph: {
    title: "TopBest Games",
    description: "커뮤니티가 직접 추천하고 순위를 매기는 최고의 Steam 게임들을 만나보세요.",
    images: [
      {
        url: '/thumbnail.png', // public 디렉토리의 썸네일 이미지 경로
        width: 1200,
        height: 630,
        alt: 'TopBest Games Thumbnail',
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="bg-gray-800 p-4 text-white">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">TopBest Games</Link>
            <div>
              <Link href="/about" className="ml-4 hover:text-gray-300">소개</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}