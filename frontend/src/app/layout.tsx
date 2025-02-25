import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "QUIPU | UOS 컴퓨터 학술 중앙동아리",
  description: "서울시립대 컴퓨터 학술 중앙동아리 QUIPU",
  openGraph: {
    title: "QUIPU | UOS 컴퓨터 학술 중앙동아리",
    description: "서울시립대 컴퓨터 학술 중앙동아리 QUIPU",
    url: "https://quipu-main.vercel.app/",
    type: "website",
    images: [
      {
        url: "/assets/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "QUIPU Main Web",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-spoqaHanSansNeo">{children}</body>
    </html>
  );
}
