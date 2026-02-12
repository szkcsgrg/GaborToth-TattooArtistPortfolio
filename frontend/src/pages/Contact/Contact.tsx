import { useTranslation } from 'react-i18next'

export default function Contact() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-20">
      <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-text-primary">
        {t('pages.contact')}
      </h1>
      <p className="mt-4 text-text-secondary tracking-wider">
        {t('pages.comingSoon')}
      </p>
    </div>
  )
}
