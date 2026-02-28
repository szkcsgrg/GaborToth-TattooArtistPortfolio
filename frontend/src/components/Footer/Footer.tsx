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

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        {/* Navigation */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>{t('footer.navigation')}</h3>
          <nav className={styles.links}>
            <Link to="/">{t('nav.home')}</Link>
            <Link to="/gallery">{t('nav.gallery')}</Link>
            <Link to="/contact">{t('nav.contact')}</Link>
            <Link to="/information">{t('nav.information')}</Link>
          </nav>
        </div>

        {/* Contact */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>{t('footer.contact')}</h3>
          <div className={styles.links}>
            <a href="mailto:tgarttattoo@gmail.com">tgarttattoo@gmail.com</a>
            <a href="tel:+36301234567">+36 30 123 4567</a>
            <Link to="/contact">Zalaegerszeg, Hungary</Link>
          </div>
        </div>

        {/* Social */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>{t('footer.social')}</h3>
          <div className={styles.links}>
            <a href="https://www.instagram.com/tgart_tattoo/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.facebook.com/tgartofficial" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://www.tiktok.com/@tgart_tattoo" target="_blank" rel="noopener noreferrer">TikTok</a>
          </div>
        </div>

        {/* Documents */}
        <div className={styles.column}>
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
      <div className={styles.bottom}>
        <p className={styles.copyright}>
          &copy; {CURRENT_YEAR} TG Art Tattoo. {t('footer.rights')}
        </p>
      </div>
    </footer>
  )
}
