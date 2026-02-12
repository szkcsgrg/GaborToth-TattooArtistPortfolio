import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-20 gap-4">
      <h1 className="text-4xl sm:text-6xl font-light tracking-[0.3em] text-text-primary">
        {t('notFound.title')}
      </h1>
      <p className="text-text-secondary tracking-wider">
        {t('notFound.message')}
      </p>
      <Link
        to="/"
        className="mt-6 text-sm uppercase tracking-[0.15em] text-text-secondary border border-border px-6 py-3 transition-colors hover:text-text-primary hover:border-text-primary"
      >
        {t('notFound.back')}
      </Link>
    </div>
  )
}
