import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import logo from '../../assets/images/logo.png'
import styles from './Hero.module.scss'

interface HeroProps {
  isRevealed: boolean
}

export default function Hero({ isRevealed }: HeroProps) {
  const { t } = useTranslation()
  const heroRef = useRef<HTMLElement>(null)
  const [bgOffset, setBgOffset] = useState(0)

  // Parallax: background moves at 0.4× scroll speed (desktop only)
  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover)').matches
    if (!canHover) return

    const handleScroll = () => {
      const hero = heroRef.current
      if (!hero) return
      const { bottom } = hero.getBoundingClientRect()
      if (bottom < 0) return // hero scrolled past — skip
      setBgOffset(window.scrollY * 0.4)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className={styles.hero} ref={heroRef}>
      <div
        className={styles.background}
        style={{ transform: `translateY(${bgOffset}px)` }}
      />
      <div className={styles.overlay} />
      <div className={`${styles.content} ${isRevealed ? styles.revealed : ''}`}>
        <img src={logo} alt="TG Art Tattoo" className={styles.logo} />
        <p className={styles.description}>{t('hero.description')}</p>
      </div>
      <button type="button" onClick={scrollToAbout} className={`${styles.scrollIndicator} ${isRevealed ? styles.revealed : ''}`}>
        <span className={styles.scrollText}>{t('hero.scroll')}</span>
        <div className={styles.chevron} />
      </button>
    </section>
  )
}
