import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import aboutImage from '../../assets/images/aboutimage.jpeg'

import styles from './About.module.scss'

interface AboutProps {
  isRevealed: boolean
}

export default function About({ isRevealed }: AboutProps) {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const [sectionVisible, setSectionVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const paragraphs = t('about.paragraphs', { returnObjects: true }) as string[]

  const [imageParallax, setImageParallax] = useState(0)

  // IntersectionObserver for scroll-triggered reveal
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
      { threshold: 0.15 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Image parallax: subtle float effect (desktop only)
  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover)').matches
    if (!canHover) return

    const section = sectionRef.current
    if (!section) return

    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      // Only compute when section is in viewport
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      const offset = rect.top * -0.08
      setImageParallax(offset)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = isRevealed && sectionVisible

  return (
    <section id="about" className={styles.about} ref={sectionRef}>
      {/* Header */}
      <div className={`${styles.header} ${isActive ? styles.visible : ''}`}>
      {/* <p className={styles.sectionLabel}>01</p> */}
        <h2 className={styles.sectionTitle}>{t('about.title')}</h2>
      </div>

      {/* Divider */}
      <div className={`${styles.divider} ${isActive ? styles.visible : ''}`} />

      {/* Content: image + text */}
      <div className={styles.content}>
        <div
          className={`${styles.imageWrapper} ${isActive ? styles.visible : ''}`}
          style={isActive ? { transform: `translateY(${imageParallax}px)` } : undefined}
        >
          <img src={aboutImage} alt="About Gábor Tóth" className={styles.image} />
        </div>

        <div className={`${styles.textWrapper} ${isActive ? styles.visible : ''}`}>
          {/* First paragraph — always visible */}
          <p className={styles.text}>{paragraphs[0]}</p>

          {/* Remaining paragraphs — hidden on mobile until expanded */}
          <div className={`${styles.restText} ${expanded ? styles.expanded : ''}`}>
            {paragraphs.slice(1).map((p, i) => (
              <p key={i} className={styles.text}>{p}</p>
            ))}
          </div>

          <button
            type="button"
            className={styles.readMoreBtn}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? t('about.readLess') : t('about.readMore')}
          </button>
        </div>
      </div>
    </section>
  )
}
