import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import styles from './Footer.module.scss'

const CURRENT_YEAR = new Date().getFullYear()

const DOCUMENTS = [
  { key: 'termsPrivacy', href: '/documents/terms-and-privacy.pdf' },
  { key: 'consent', href: '/documents/beleegyezo-nyilatkozat.pdf' },
  { key: 'parentalConsent', href: '/documents/szuloi-beleegyezo-nyilatkozat.pdf' },
]

export default function Footer() {
  const { t } = useTranslation()
  const footerRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = footerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <footer className={styles.footer} ref={footerRef}>
      <div className={styles.content}>
        {/* Navigation */}
        <div className={`${styles.column} ${visible ? styles.visible : ''}`} style={{ transitionDelay: '0s' }}>
          <h3 className={styles.columnTitle}>{t('footer.navigation')}</h3>
          <nav className={styles.links}>
            <Link to="/">{t('nav.home')}</Link>
            <Link to="/gallery">{t('nav.gallery')}</Link>
            <Link to="/contact">{t('nav.contact')}</Link>
            <Link to="/information">{t('nav.information')}</Link>
          </nav>
        </div>

        {/* Contact */}
        <div className={`${styles.column} ${visible ? styles.visible : ''}`} style={{ transitionDelay: '0.1s' }}>
          <h3 className={styles.columnTitle}>{t('footer.contact')}</h3>
          <div className={styles.links}>
            <a href="mailto:info@tgarttattoo.hu">info@tgarttattoo.hu</a>
            {/* <a href="tel:+36301234567">+36 30 123 4567</a> */}
            <Link to="/contact">Zalaegerszeg, Hungary</Link>
          </div>
        </div>

        {/* Social */}
        <div className={`${styles.column} ${visible ? styles.visible : ''}`} style={{ transitionDelay: '0.2s' }}>
          <h3 className={styles.columnTitle}>{t('footer.social')}</h3>
          <div className={styles.links}>
            <a href="https://www.instagram.com/tgart_tattoo/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.facebook.com/tgartofficial" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://www.tiktok.com/@tgart_tattoo" target="_blank" rel="noopener noreferrer">TikTok</a>
          </div>
        </div>

        {/* Documents */}
        <div className={`${styles.column} ${visible ? styles.visible : ''}`} style={{ transitionDelay: '0.3s' }}>
          <h3 className={styles.columnTitle}>{t('footer.documents')}</h3>
          <div className={styles.links}>
            {DOCUMENTS.map((doc) => (
              <a key={doc.key} href={doc.href} target="_blank" rel="noopener noreferrer">
                {t(`footer.docs.${doc.key}`)}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={`${styles.bottom} ${visible ? styles.visible : ''}`}>
        <p className={styles.copyright}>
          &copy; {CURRENT_YEAR} TG Art Tattoo. {t('footer.rights')}
        </p>
      </div>
    </footer>
  )
}
