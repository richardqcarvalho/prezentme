import Providers from "@/app/providers";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Presentation Generator",
  description:
    "A dashboard to devs to configure a presentation to them, to help them to showcase what they know and what they have in a nice way",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} flex h-svh w-svw items-center justify-center antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
