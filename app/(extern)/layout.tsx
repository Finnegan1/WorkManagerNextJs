import PublicHeader from "@/components/headers/PublicHeader"
import Footer from "@/components/Footer"
export default function ExternalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <PublicHeader />
        <main className="container mx-auto px-4 pb-8 pt-20">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}