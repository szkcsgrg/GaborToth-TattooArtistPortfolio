import { useState, useEffect } from 'react'
import logo from '../../assets/images/logo.png'
import styles from './LoadingScreen.module.scss'

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const preloadImg = new Image()
    preloadImg.src = '/images/landing-cover.png'

    const timer = setTimeout(() => {
      setFadeOut(true)
    }, 2800)

    return () => clearTimeout(timer)
  }, [])

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName === 'opacity' && fadeOut) {
      onComplete()
    }
  }

  return (
    <div
      className={`${styles.overlay} ${fadeOut ? styles.fadeOut : ''}`}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className={styles.content}>
        <img src={logo} alt="TG Art Tattoo" className={styles.logo} />
        <div className={styles.progressTrack}>
          <div className={styles.progressBar} />
        </div>
      </div>
    </div>
  )
}
