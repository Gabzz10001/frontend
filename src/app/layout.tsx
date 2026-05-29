import type { Metadata } from "next"

import "./globals.css"

import { Inter } from "next/font/google"

import { Toaster } from "sonner"

const inter = Inter({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Barber Booking",

  description:
    "Modern Barber Booking Website",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${inter.className}
          antialiased
          bg-white
          text-black
        `}
      >
        {children}

        <Toaster richColors />
      </body>
    </html>
  )
}