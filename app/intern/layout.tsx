import InternHeader from '../../components/headers/InternHeader';

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <InternHeader />
      <main className="container mx-auto px-4 pb-8 pt-20">
        {children}
      </main>
    </>
  )
}
