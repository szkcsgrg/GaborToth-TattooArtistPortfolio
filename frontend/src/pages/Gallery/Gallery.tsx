import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import tattoo1 from '../../assets/images/gallery/tattoo1.jpg'
import tattoo2 from '../../assets/images/gallery/tattoo2.jpg'
import tattoo3 from '../../assets/images/gallery/tattoo3.jpg'
import tattoo4 from '../../assets/images/gallery/tattoo4.jpg'
import tattoo5 from '../../assets/images/gallery/tattoo5.jpg'
import tattoo6 from '../../assets/images/gallery/tattoo6.jpg'
import tattoo7 from '../../assets/images/gallery/tattoo7.jpg'
import tattoo8 from '../../assets/images/gallery/tattoo8.jpg'
import tattoo9 from '../../assets/images/gallery/tattoo9.jpg'
import tattoo10 from '../../assets/images/gallery/tattoo10.png'
import tattoo11 from '../../assets/images/gallery/tattoo11.png'
import tattoo12 from '../../assets/images/gallery/tattoo12.png'
import tattoo13 from '../../assets/images/gallery/tattoo13.jpg'
import tattoo14 from '../../assets/images/gallery/tattoo14.jpg'
import tattoo15 from '../../assets/images/gallery/tattoo15.png'
import tattoo16 from '../../assets/images/gallery/tattoo16.jpg'

import styles from './Gallery.module.scss'

interface GalleryItem {
  id: number
  src: string
  category: string[]
}

const GALLERY_ITEMS: GalleryItem[] = [
  { id: 1, src: tattoo1, category: ['fineline', 'minimal'] },
  { id: 2, src: tattoo2, category: ['blackwork', 'abstract'] },
  { id: 3, src: tattoo3, category: ['realism'] },
  { id: 4, src: tattoo4, category: ['sketch', 'fineline'] },
  { id: 5, src: tattoo5, category: ['minimal', 'blackwork'] },
  { id: 6, src: tattoo6, category: ['realism', 'sketch'] },
  { id: 7, src: tattoo7, category: ['abstract'] },
  { id: 8, src: tattoo8, category: ['fineline'] },
  { id: 9, src: tattoo9, category: ['blackwork', 'realism'] },
  { id: 10, src: tattoo10, category: ['minimal'] },
  { id: 11, src: tattoo11, category: ['sketch', 'abstract'] },
  { id: 12, src: tattoo12, category: ['realism'] },
  { id: 13, src: tattoo13, category: ['fineline', 'minimal'] },
  { id: 14, src: tattoo14, category: ['blackwork'] },
  { id: 15, src: tattoo15, category: ['sketch'] },
  { id: 16, src: tattoo16, category: ['abstract', 'realism'] },
]

const CATEGORIES = ['all', 'fineline', 'blackwork', 'realism', 'minimal', 'sketch', 'abstract'] as const

export default function Gallery() {
  const { t } = useTranslation()
  const [activeFilter, setActiveFilter] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const filtered = activeFilter === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category.includes(activeFilter))

  // Lightbox navigation
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  const goNext = useCallback(() => {
    setLightboxIndex(prev => (prev !== null ? (prev + 1) % filtered.length : null))
  }, [filtered.length])

  const goPrev = useCallback(() => {
    setLightboxIndex(prev => (prev !== null ? (prev - 1 + filtered.length) % filtered.length : null))
  }, [filtered.length])

  // Keyboard & scroll lock for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return

    document.body.style.overflow = 'hidden'

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }

    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [lightboxIndex, closeLightbox, goNext, goPrev])

  // Reset lightbox when filter changes
  useEffect(() => {
    setLightboxIndex(null)
  }, [activeFilter])

  const filterButtons = (
    <>
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          className={`${styles.filterBtn} ${activeFilter === cat ? styles.active : ''}`}
          onClick={() => setActiveFilter(cat)}
        >
          {t(`gallery.filters.${cat}`)}
        </button>
      ))}
    </>
  )

  // ─── Mobile: Reels layout ───
  if (isMobile) {
    return (
      <div className={styles.mobileGallery}>
        <div className={styles.reelsFilterBar}>
          {filterButtons}
        </div>

        <div className={styles.reelsContainer}>
          {filtered.length === 0 ? (
            <div className={styles.reelItem}>
              <p className={styles.empty}>{t('gallery.empty')}</p>
            </div>
          ) : (
            filtered.map(item => (
              <div key={item.id} className={styles.reelItem}>
                <img
                  src={item.src}
                  alt={`Tattoo ${item.id}`}
                  className={styles.reelImage}
                  loading="lazy"
                />
                <div className={styles.reelCategory}>
                  {item.category.map(cat => (
                    <span key={cat} className={styles.reelPill}>
                      {t(`gallery.filters.${cat}`)}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  // ─── Desktop: Grid + Lightbox ───
  return (
    <div className={styles.gallery}>
      {/* Header */}
      <div className={styles.header}>
        <p className={styles.sectionLabel}>{t('gallery.label')}</p>
        <h1 className={styles.sectionTitle}>{t('gallery.title')}</h1>
        <p className={styles.sectionDescription}>{t('gallery.description')}</p>
      </div>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        {filterButtons}
      </div>

      {/* Grid */}
      <div className={styles.grid} key={activeFilter}>
        {filtered.length === 0 ? (
          <p className={styles.empty}>{t('gallery.empty')}</p>
        ) : (
          filtered.map((item, i) => (
            <div
              key={item.id}
              className={styles.imageCard}
              onClick={() => setLightboxIndex(i)}
            >
              <img
                src={item.src}
                alt={`Tattoo ${item.id}`}
                className={styles.image}
                loading="lazy"
              />
            </div>
          ))
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.lightboxClose} onClick={closeLightbox}>
            &#x2715;
          </button>

          {filtered.length > 1 && (
            <>
              <button
                className={`${styles.lightboxNav} ${styles.prev}`}
                onClick={e => { e.stopPropagation(); goPrev() }}
              >
                &#8249;
              </button>
              <button
                className={`${styles.lightboxNav} ${styles.next}`}
                onClick={e => { e.stopPropagation(); goNext() }}
              >
                &#8250;
              </button>
            </>
          )}

          <img
            src={filtered[lightboxIndex].src}
            alt={`Tattoo ${filtered[lightboxIndex].id}`}
            className={styles.lightboxImage}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
