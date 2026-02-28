import { useEffect, useRef, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './Reviews.module.scss'

interface ReviewsProps {
  isRevealed: boolean
}

// ─── Hardcoded Hungarian reviews (source of truth) ───
// TODO: When 4+ reviews exist, re-enable Swiper carousel (swiper package is installed)

interface Review {
  id: number
  name: string
  rating: number
  text: string
  date: string
}

const REVIEWS_HU: Review[] = [
  {
    id: 1,
    name: 'Szalay Jázmin',
    rating: 5,
    text: 'Teljes szívemből ajánlom mindenkinek Gábort. Egy ilyen „első tetkós" élményt kívánok mindenkinek. Szuper hangulat volt, nagyon kellemes és igényes környezet. Segítőkész, barátságos. Nem bántam meg egy percig sem, hogy őt választottam, a többi tetkómért is biztos hozzá fordulok.',
    date: '2024.11.15',
  },
  {
    id: 2,
    name: 'Veilinger Dorina',
    rating: 5,
    text: 'A tetováló művész nagyon tehetséges és kreatív, eddig 2 tetoválásom van tőle és mindkettő tökéletes, igényes munka. Emellett nagyon korrekt, jófej és türelmes is. Alig várom, hogy újabb tetoválást kapjak tőle!',
    date: '2024.10.22',
  },
  {
    id: 3,
    name: 'Kerkai Botond',
    rating: 5,
    text: 'Nagyon meg vagyok elégedve. Közvetlen és barátságos, így mindig jó hangulatban telnek az ülések. Precíz, minden apró részletre odafigyel, ami a kész tetováláson is látszik. Szívből ajánlom mindenkinek, aki igényes munkát szeretne!',
    date: '2024.09.08',
  },
]

// ─── Language-aware quotation marks ───

const QUOTE_MARKS: Record<string, { open: string; close: string }> = {
  hu: { open: '„', close: '"' },
  en: { open: '\u201C', close: '\u201D' },
  de: { open: '„', close: '"' },
  it: { open: '«', close: '»' },
}

// ─── Stars SVG ───

function Stars({ count }: { count: number }) {
  return (
    <div className={styles.stars}>
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  )
}

// ─── Component ───

export default function Reviews({ isRevealed }: ReviewsProps) {
  const { t, i18n } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const [sectionVisible, setSectionVisible] = useState(false)

  const currentLang = i18n.language?.substring(0, 2) || 'hu'
  const quotes = QUOTE_MARKS[currentLang] || QUOTE_MARKS.hu

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
      { threshold: 0.1 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const isActive = isRevealed && sectionVisible

  // Get review text — HU uses hardcoded, others use i18n
  const getReviewText = useMemo(() => {
    return (review: Review) => {
      if (currentLang === 'hu') return review.text
      return t(`reviews.items.${review.id}.text`, { defaultValue: review.text })
    }
  }, [currentLang, t])

  return (
    <section id="reviews" className={styles.reviews} ref={sectionRef}>
      {/* Header */}
      <div className={`${styles.header} ${isActive ? styles.visible : ''}`}>
        <p className={styles.sectionLabel}>04</p>
        <h2 className={styles.sectionTitle}>{t('reviews.title')}</h2>
        <p className={styles.sectionDescription}>{t('reviews.description')}</p>
      </div>

      {/* Divider */}
      <div className={`${styles.divider} ${isActive ? styles.visible : ''}`} />

      {/* Reviews grid */}
      <div className={`${styles.grid} ${isActive ? styles.visible : ''}`}>
        {REVIEWS_HU.map((review, i) => (
          <div
            key={review.id}
            className={`${styles.reviewCard} ${isActive ? styles.cardVisible : ''}`}
            style={{ transitionDelay: isActive ? `${0.4 + i * 0.15}s` : '0s' }}
          >
            <Stars count={review.rating} />
            <p className={styles.reviewText}>
              {quotes.open}{getReviewText(review)}{quotes.close}
            </p>
            {currentLang !== 'hu' && (
              <p className={styles.translatedNote}>{t('reviews.translatedFrom')}</p>
            )}
            <div className={styles.reviewFooter}>
              <span className={styles.reviewAuthor}>{review.name}</span>
              <span className={styles.reviewDate}>{review.date}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
