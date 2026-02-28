import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import styles from './CallToAction.module.scss'

interface CallToActionProps {
  isRevealed: boolean
}

export default function CallToAction({ isRevealed }: CallToActionProps) {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const [sectionVisible, setSectionVisible] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const isActive = isRevealed && sectionVisible

  return (
    <section className={styles.cta} ref={sectionRef}>
      <div className={`${styles.content} ${isActive ? styles.visible : ''}`}>
        <h2 className={styles.title}>{t('cta.title')}</h2>
        <p className={styles.description}>{t('cta.description')}</p>
        <Link to="/contact" className={styles.button}>
          {t('cta.button')}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
