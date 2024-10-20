import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <p>&copy; 2024 Sachsenforst. Alle Rechte vorbehalten.</p>
          <nav>
            <Link href="/impressum" className="text-blue-600 hover:text-blue-800">
              Impressum
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
