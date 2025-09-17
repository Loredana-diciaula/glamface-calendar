import './globals.css'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'GlamFace Kalender',
  description: 'Business-Termine mit einseitiger iCal-Synchronisation',
  manifest: '/manifest.webmanifest'
}
export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="de">
      <body className="min-h-screen bg-brand">
        <div className="mx-auto max-w-md p-3">{children}</div>
      </body>
    </html>
  )
}
