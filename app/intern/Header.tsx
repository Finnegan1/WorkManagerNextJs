'use client'

import * as React from "react"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

// Define the navigation structure
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

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setIsOpen(!isOpen)

  if (!pathname) {
    return <Skeleton className="h-10 w-full" />
  }

  const isActive = (href: string) => {
    if (href === '/intern') {
      return pathname === '/intern' || pathname === '/intern/'
    }
    return pathname.startsWith(href + '/')
  }

  const navItemStyles = "bg-green-700 text-white hover:bg-green-600 hover:text-white focus:bg-green-600 focus:text-white data-[state=open]:bg-green-600 data-[state=open]:text-white text-base"

  const renderNavigationItems = (items: typeof navigationStructure, isMobile = false) => {
    return items.map((item) => (
      <NavigationMenuItem key={item.name}>
        {item.children ? (
          <>
            <NavigationMenuTrigger className={cn(
              navItemStyles,
              "flex items-center justify-start px-4 py-2 rounded-md",
              isActive(item.href) && "bg-green-600",
              isMobile && "w-full"
            )}>
              {item.name}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className={cn(
                "grid gap-3 p-4 bg-white",
                isMobile ? "w-full" : "w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]"
              )}>
                {item.children.map((child) => (
                  <ListItem
                    key={child.name}
                    title={child.name}
                    href={child.href}
                    onClick={isMobile ? toggleMenu : undefined}
                  >
                    {child.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </>
        ) : (
          <NavigationMenuLink asChild>
            <Link href={item.href} passHref>
              <div
                className={cn(
                  navItemStyles,
                  "flex items-center justify-start px-4 py-2 rounded-md",
                  isActive(item.href) && "bg-green-600",
                  isMobile && "w-full"
                )}
                onClick={isMobile ? toggleMenu : undefined}
              >
                {item.name}
              </div>
            </Link>
          </NavigationMenuLink>
        )}
      </NavigationMenuItem>
    ))
  }

  return (
    <header className="bg-green-700 text-white fixed top-0 w-full z-[100]">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              WorkManager
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="flex space-x-2">
              {renderNavigationItems(navigationStructure)}
            </NavigationMenuList>
          </NavigationMenu>
          
          {/* Mobile Navigation Toggle */}
          <div className="lg:hidden">
            <button onClick={toggleMenu} className="focus:outline-none" aria-label="Toggle menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isOpen && (<div className="lg:hidden w-full flex justify-center">
          <NavigationMenu className="lg:hidden mt-2">
            <NavigationMenuList className="flex flex-col space-y-2">
              {renderNavigationItems(navigationStructure, true)}
            </NavigationMenuList>
          </NavigationMenu>
        </div>)}
      </nav>
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string, href: string }
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <Link href={href} passHref legacyBehavior>
        <a
          ref={ref as React.LegacyRef<HTMLAnchorElement>}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-green-100 hover:text-green-700 focus:bg-green-100 focus:text-green-700",
            className
          )}
          {...props}
        >
          <div className="text-base font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </Link>
    </li>
  )
})
ListItem.displayName = "ListItem"