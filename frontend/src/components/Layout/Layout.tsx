import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../Navbar/Navbar.tsx'
import Footer from '../Footer/Footer.tsx'
import styles from './Layout.module.scss'

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname === '/contact') {
      // Wait for render, then scroll to contact section
      requestAnimationFrame(() => {
        const el = document.getElementById('contact-section')
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
          return
        }
      })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
