import { tokenDecoded } from '@/lib/utils/auth'
import Header, { NavigationItem } from './Header'

const navigationStructureAdmin = [
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

const navigationStructurePublisher = [
  { name: 'Übersicht', href: '/intern' },
  { name: 'Mein Profil', href: '/intern/profil' },
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

const navigationStructureUser = [
  { name: 'Übersicht', href: '/intern' },
  { name: 'Mein Profil', href: '/intern/profil' },
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

export default async function InternHeader() {
  const token = await tokenDecoded()
  let navigationStructure: NavigationItem[] = []
  switch (token.user.role) {
    case 'ADMIN':
      navigationStructure = navigationStructureAdmin
      break
    case 'PUBLISHER':
      navigationStructure = navigationStructurePublisher
      break
    default:
      navigationStructure = navigationStructureUser
      break
  }
  return (
    <Header 
      navigationStructure={navigationStructure}
      logoText="WorkManager"
      logoHref="/intern"
    />
  )
}
