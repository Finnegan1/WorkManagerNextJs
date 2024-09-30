import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import prisma from "@/lib/prisma";
import { createAdminUser } from "@/zscript_create_user";
import Head from 'next/head';
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: 'WorkManager - Saxony State Forest Service',
  description: 'Platform for forest workers to manage and communicate work activities',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  //check if admin user exists
  const adminUser = await prisma.user.findUnique({
    where: {
      email: 'admin@admin.de',
    },
  });
  
  if (!adminUser) {
    await createAdminUser()
  }

  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <Providers>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </Providers>
    </html>
  );
}
