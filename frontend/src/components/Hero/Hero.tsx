import { useTranslation } from 'react-i18next'
import logo from '../../assets/images/logo.png'
import styles from './Hero.module.scss'

interface HeroProps {
  isRevealed: boolean
}

export default function Hero({ isRevealed }: HeroProps) {
  const { t } = useTranslation()

  return (
    <section className={styles.hero}>
      <div className={styles.background} />
      <div className={styles.overlay} />
      <div className={`${styles.content} ${isRevealed ? styles.revealed : ''}`}>
        <img src={logo} alt="TG Art Tattoo" className={styles.logo} />
        <p className={styles.description}>{t('hero.description')}</p>
      </div>
      <div className={`${styles.scrollIndicator} ${isRevealed ? styles.revealed : ''}`}>
        <span className={styles.scrollText}>{t('hero.scroll')}</span>
        <div className={styles.chevron} />
      </div>
    </section>
  )
}
