import PublicHeader from "@/components/headers/PublicHeader"

export default function ExternalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <PublicHeader />
      <main className="container mx-auto px-4 pb-8 pt-20">
        {children}
      </main>
    </div>
  )
}