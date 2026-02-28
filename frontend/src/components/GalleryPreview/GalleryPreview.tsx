import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import tattoo1 from '../../assets/images/gallery/tattoo1.jpg'
import tattoo2 from '../../assets/images/gallery/tattoo2.jpg'
import tattoo3 from '../../assets/images/gallery/tattoo3.jpg'
import tattoo4 from '../../assets/images/gallery/tattoo4.jpg'
import tattoo5 from '../../assets/images/gallery/tattoo5.jpg'
import tattoo6 from '../../assets/images/gallery/tattoo6.jpg'

import styles from './GalleryPreview.module.scss'

const IMAGES = [tattoo1, tattoo2, tattoo3, tattoo4, tattoo5, tattoo6]

interface GalleryPreviewProps {
  isRevealed: boolean
}

export default function GalleryPreview({ isRevealed }: GalleryPreviewProps) {
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
      { threshold: 0.1 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const isActive = isRevealed && sectionVisible

  return (
    <section id="gallery-preview" className={styles.galleryPreview} ref={sectionRef}>
      {/* Header */}
      <div className={`${styles.header} ${isActive ? styles.visible : ''}`}>
        <p className={styles.sectionLabel}>03</p>
        <h2 className={styles.sectionTitle}>{t('galleryPreview.title')}</h2>
        <p className={styles.sectionDescription}>{t('galleryPreview.description')}</p>
      </div>

      {/* Divider */}
      <div className={`${styles.divider} ${isActive ? styles.visible : ''}`} />

      {/* Image grid with fade-out overlay */}
      <div className={styles.gridWrapper}>
        <div className={styles.grid}>
          {IMAGES.map((src, i) => (
            <div
              key={i}
              className={`${styles.imageCard} ${isActive ? styles.visible : ''}`}
              style={{ transitionDelay: isActive ? `${0.3 + i * 0.1}s` : '0s' }}
            >
              <img src={src} alt={`Tattoo ${i + 1}`} className={styles.image} loading="lazy" />
            </div>
          ))}
        </div>

        {/* Fade-out gradient overlay */}
        <div className={styles.fadeOverlay} />
      </div>

      {/* CTA link */}
      <div className={`${styles.cta} ${isActive ? styles.visible : ''}`}>
        <Link to="/gallery" className={styles.ctaLink}>
          {t('galleryPreview.viewAll')}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
