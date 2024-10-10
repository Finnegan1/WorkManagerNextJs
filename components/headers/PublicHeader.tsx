import Header from '@/components/headers/Header'

const publicNavigationStructure = [
  { name: 'Übersicht', href: '/' },
  { name: 'Überprüfe Route', href: '/route-test' },
]

export default function PublicHeader() {
  return (
    <Header 
      navigationStructure={publicNavigationStructure}
      logoText="PublicSite"
      logoHref="/"
    />
  )
}
