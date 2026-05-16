import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/index.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Frontend Mentor | Weather App",
    description:
        "Check current conditions and the hourly and daily forecast for any city.",
        icons: {
          
        }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
