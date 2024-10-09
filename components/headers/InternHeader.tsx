import Header from './Header'

const navigationStructure = [
    { name: 'Übersicht', href: '/intern' },
    { name: 'Mein Profil', href: '/intern/profil' },
    { name: 'Nutzer Administrieren', href: '/intern/admin/nutzer' },
    { 
      name: 'Veröffentlichung',
      href: '/intern/veroeffentlichung',
      children: [
        {
          name: 'Veröffentlichung',
          href: '/intern/veroeffentlichung',
          description: 'Veröffentlichung erstellen'
        },
        {
          name: 'Templates',
          href: '/intern/veroeffentlichung/templates',
          description: 'Veröffentlichungstemplates anzeigen und verwalten'
        }
      ]
    },
    {
      name: 'Meine Arbeitsbereiche',
      href: '/intern/warnungen',
      children: [
        {
          name: 'Arbeitsbereiche anzeigen',
          href: '/intern/warnungen',
          description: 'Alle Ihre Arbeitsbereiche anzeigen und verwalten'
        },
        {
          name: 'Arbeitsbereich erstellen',
          href: '/intern/warnungen/erstellen',
          description: 'Einen neuen Arbeitsbereich erstellen'
        }
      ]
    }
  ]

export default function InternHeader() {
  return (
    <Header 
      navigationStructure={navigationStructure}
      logoText="WorkManager"
      logoHref="/intern"
    />
  )
}
