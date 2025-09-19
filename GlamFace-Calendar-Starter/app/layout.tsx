import './globals.css'

export const metadata = {
  title: 'GlamFace Kalender',
  description: 'Terminplaner für GlamFace',
  manifest: '/manifest.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      {/* Das ist der "Kopf" der Seite: hier verlinken wir die Icons */}
      <head>
        {/* iPhone Home-Screen Icon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        {/* Favicon / Standard-Icon */}
        <link rel="icon" href="/icon.png" />
        {/* iOS: als „Web-App“ starten */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>

      <body className="bg-[#F3EEE7] text-black">
        {children}
      </body>
    </html>
  )
}
