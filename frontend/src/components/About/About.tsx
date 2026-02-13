import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import aboutImage from '../../assets/images/aboutimage.png'

import styles from './About.module.scss'

interface AboutProps {
  isRevealed: boolean
}

export default function About({ isRevealed }: AboutProps) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  return (
    <section id="about" className={styles.about}>
      <div>
        <img src={aboutImage} alt="About Gábor Tóth" className={styles.image} />
      </div>
      <div className={`${styles.content} ${isRevealed ? styles.revealed : ''}`}>
        <h2 className={styles.header}>{t('about.title')}</h2>
        <p className={`${styles.text} ${!expanded ? styles.textClamped : ''}`}>
          {t('about.text')}
        </p>
        <button
          type="button"
          className={styles.readMoreBtn}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? t('about.readLess') : t('about.readMore')}
        </button>
      </div>
    </section>
  )
}
