import Header from '@/components/headers/Header'

const publicNavigationStructure = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
  // Add more items as needed
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
