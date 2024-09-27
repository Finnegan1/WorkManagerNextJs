import Header from './Header';

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 pb-8 pt-20">
        {children}
      </main>
    </>
  )
}
