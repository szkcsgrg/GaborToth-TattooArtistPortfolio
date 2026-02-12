import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import navLogo from '../../assets/images/logo.png'
import styles from './Navbar.module.scss'

const LANGUAGES = ['hu', 'en', 'de', 'it'] as const

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLinks = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/galeria', label: t('nav.gallery') },
    { to: '/kapcsolat', label: t('nav.contact') },
    { to: '/informaciok', label: t('nav.information') },
  ]

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          <img src={navLogo} alt="TG Art Tattoo" />
        </NavLink>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {navLinks.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) => isActive ? styles.active : ''}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li className={styles.langMobile}>
            {LANGUAGES.map((lng) => (
              <button
                key={lng}
                className={`${styles.langBtn} ${i18n.language === lng ? styles.langActive : ''}`}
                onClick={() => i18n.changeLanguage(lng)}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </li>
        </ul>

        <div className={styles.langDesktop}>
          {LANGUAGES.map((lng) => (
            <button
              key={lng}
              className={`${styles.langBtn} ${i18n.language === lng ? styles.langActive : ''}`}
              onClick={() => i18n.changeLanguage(lng)}
            >
              {lng.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  )
}
