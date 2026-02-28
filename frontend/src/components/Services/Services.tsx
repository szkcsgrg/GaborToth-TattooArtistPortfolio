import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './Services.module.scss'

interface ServicesProps {
  isRevealed: boolean
}

// ─── SVG Icons (stroke-based, currentColor) ───

function TattooMachineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="14" y="8" width="14" height="20" rx="2" />
      <line x1="18" y1="8" x2="18" y2="4" />
      <line x1="26" y1="8" x2="26" y2="4" />
      <line x1="16" y1="4" x2="28" y2="4" />
      <line x1="21" y1="28" x2="21" y2="44" />
      <line x1="14" y1="16" x2="8" y2="16" />
      <line x1="8" y1="16" x2="8" y2="24" />
      <line x1="8" y1="24" x2="14" y2="24" />
    </svg>
  )
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 38l2-8L34 4l6 6L14 36z" />
      <line x1="28" y1="10" x2="34" y2="16" />
      <line x1="6" y1="38" x2="8" y2="30" />
    </svg>
  )
}

function PenToolIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="24,4 4,44 24,34 44,44" />
      <line x1="24" y1="34" x2="24" y2="20" />
      <circle cx="24" cy="20" r="2" />
    </svg>
  )
}

function DiscIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="20" />
      <circle cx="24" cy="24" r="8" />
      <circle cx="24" cy="24" r="2" />
    </svg>
  )
}

function TabletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="6" width="28" height="36" rx="3" />
      <line x1="38" y1="16" x2="28" y2="32" />
      <line x1="42" y1="12" x2="38" y2="16" />
    </svg>
  )
}

// ─── Service data ───

const SERVICES = [
  { key: 'tattooing', number: '01', Icon: TattooMachineIcon, featured: true },
  { key: 'customDesign', number: '02', Icon: PencilIcon, featured: false },
  { key: 'logoDesign', number: '03', Icon: PenToolIcon, featured: false },
  { key: 'cdCoverDesign', number: '04', Icon: DiscIcon, featured: false },
  { key: 'digitalDrawing', number: '05', Icon: TabletIcon, featured: false },
] as const

// ─── Component ───

export default function Services({ isRevealed }: ServicesProps) {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const [sectionVisible, setSectionVisible] = useState(false)
  const canTilt = useRef(false)

  // Check for hover-capable device (desktop)
  useEffect(() => {
    canTilt.current = window.matchMedia('(hover: hover)').matches
  }, [])

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

  const isActive = isRevealed && sectionVisible

  // 3D tilt handlers — write directly to DOM, no state
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!canTilt.current) return
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(0)`
  }, [])

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!canTilt.current) return
    e.currentTarget.style.transform = ''
  }, [])

  const featured = SERVICES[0]
  const secondary = SERVICES.slice(1)

  return (
    <section id="services" className={styles.services} ref={sectionRef}>
      {/* Header */}
      <div className={`${styles.header} ${isActive ? styles.visible : ''}`}>
        <p className={styles.sectionLabel}>02</p>
        <h2 className={styles.sectionTitle}>{t('services.title')}</h2>
        <p className={styles.sectionDescription}>{t('services.description')}</p>
      </div>

      {/* Divider */}
      <div className={`${styles.divider} ${isActive ? styles.visible : ''}`} />

      {/* Featured card */}
      <div
        className={`${styles.featuredCard} ${isActive ? styles.visible : ''}`}
        style={{ transitionDelay: isActive ? '0.3s' : '0s' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <span className={styles.cardNumber}>{featured.number}</span>
        <featured.Icon className={styles.cardIcon} />
        <div className={styles.featuredText}>
          <h3 className={styles.cardTitle}>{t(`services.${featured.key}.title`)}</h3>
          <p className={styles.cardDescription}>{t(`services.${featured.key}.description`)}</p>
        </div>
      </div>

      {/* Secondary cards grid */}
      <div className={styles.grid}>
        {secondary.map((service, i) => (
          <div
            key={service.key}
            className={`${styles.card} ${isActive ? styles.visible : ''}`}
            style={{ transitionDelay: isActive ? `${0.45 + i * 0.15}s` : '0s' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <span className={styles.cardNumber}>{service.number}</span>
            <service.Icon className={styles.cardIcon} />
            <h3 className={styles.cardTitle}>{t(`services.${service.key}.title`)}</h3>
            <p className={styles.cardDescription}>{t(`services.${service.key}.description`)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
