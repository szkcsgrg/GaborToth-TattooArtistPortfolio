import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './ContactInfo.module.scss'

const DOCUMENTS = [
  { key: 'termsPrivacy', file: '/documents/terms-and-privacy.pdf' },
  { key: 'consent', file: '/documents/beleegyezo-nyilatkozat.pdf' },
  { key: 'parentalConsent', file: '/documents/szuloi-beleegyezo-nyilatkozat.pdf' },
]

const FAQ_COUNT = 10

const SIZES = ['small', 'medium', 'large', 'xlarge'] as const
const BODY_PARTS = [
  'forearm', 'upperArm', 'fullSleeve', 'shoulder', 'chest', 'ribs',
  'upperBack', 'lowerBack', 'thigh', 'calf', 'ankle', 'wrist',
  'neck', 'hand', 'other',
] as const

export default function ContactInfo() {
  const { t } = useTranslation()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const answerRefs = useRef<(HTMLDivElement | null)[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index))
  }

  // Contact form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    size: '',
    bodyPart: '',
    description: '',
  })
  const [referenceImage, setReferenceImage] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitErrors, setSubmitErrors] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitStatus('idle')
    setSubmitErrors([])

    const body = new FormData()
    body.append('name', formData.name)
    body.append('email', formData.email)
    body.append('size', formData.size)
    body.append('bodyPart', formData.bodyPart)
    body.append('description', formData.description)
    if (referenceImage) {
      body.append('referenceImage', referenceImage)
    }

    try {
      const res = await fetch('/api/contact', { method: 'POST', body })
      const data = await res.json()

      if (data.success) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', size: '', bodyPart: '', description: '' })
        setReferenceImage(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
      } else {
        setSubmitStatus('error')
        setSubmitErrors(data.errors || [data.error || t('contactInfo.form.errorGeneric')])
      }
    } catch {
      setSubmitStatus('error')
      setSubmitErrors([t('contactInfo.form.errorGeneric')])
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* ─── Information Section ─── */}
      <section className={styles.section}>
        <div className={styles.header}>
          <p className={styles.sectionLabel}>{t('contactInfo.infoLabel')}</p>
          <h1 className={styles.sectionTitle}>{t('contactInfo.infoTitle')}</h1>
          <p className={styles.sectionDescription}>{t('contactInfo.infoDescription')}</p>
        </div>

        {/* FAQ Accordion */}
        <div className={styles.faqList}>
          {Array.from({ length: FAQ_COUNT }, (_, i) => {
            const isOpen = openIndex === i
            const ref = answerRefs.current[i]
            const height = isOpen && ref ? ref.scrollHeight : 0

            return (
              <div key={i} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => toggleFaq(i)}
                >
                  {t(`contactInfo.faq.${i}.q`)}
                  <span className={`${styles.faqIcon} ${isOpen ? styles.open : ''}`} />
                </button>
                <div
                  className={styles.faqAnswerWrapper}
                  style={{ maxHeight: height }}
                >
                  <div
                    className={styles.faqAnswer}
                    ref={el => { answerRefs.current[i] = el }}
                  >
                    {t(`contactInfo.faq.${i}.a`)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ─── Documents Divider ─── */}
      <section className={styles.docsDivider}>
        <div className={styles.dividerLine} />
        <h2 className={styles.docsTitle}>{t('contactInfo.docsTitle')}</h2>
        <div className={styles.docsLinks}>
          {DOCUMENTS.map(doc => (
            <a
              key={doc.key}
              href={doc.file}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.docLink}
            >
              <svg className={styles.docIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              {t(`contactInfo.docs.${doc.key}`)}
            </a>
          ))}
        </div>
        <div className={styles.dividerLine} />
      </section>

      {/* ─── Contact Section ─── */}
      <section className={styles.section} id="contact-section">
        <div className={styles.header}>
          <p className={styles.sectionLabel}>{t('contactInfo.contactLabel')}</p>
          <h2 className={styles.sectionTitle}>{t('contactInfo.contactTitle')}</h2>
          <p className={styles.sectionDescription}>{t('contactInfo.contactDescription')}</p>
        </div>

        <div className={styles.contactLayout}>
          {/* Map + Details */}
          <div>
            <div className={styles.mapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2730.5!2d16.8445!3d46.8417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476923513de7b5d7%3A0x1e0d1fb4e1234567!2sBerzsenyi+D%C3%A1niel+u.+11%2C+Zalaegerszeg%2C+8900!5e0!3m2!1shu!2shu!4v1"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps - TG Art Tattoo, Zalaegerszeg"
              />
            </div>

            <div className={styles.contactDetails}>
              <div className={styles.contactItem}>
                <svg className={styles.contactItemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span className={styles.contactText}>
                  <a href="mailto:info@tgarttattoo.com">info@tgarttattoo.com</a>
                </span>
              </div>
              <div className={styles.contactItem}>
                <svg className={styles.contactItemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className={styles.contactText}>8900, Zalaegerszeg, Berzsenyi Dániel u. 11/100</span>
              </div>
              <div className={styles.socialLinks}>
                <a href="https://www.instagram.com/tg_art_tattoo/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a href="https://www.facebook.com/tgarttattoo" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@tg_art_tattoo" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="TikTok">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="name">
                  {t('contactInfo.form.name')}
                </label>
                <input
                  id="name"
                  type="text"
                  className={styles.formInput}
                  placeholder={t('contactInfo.form.namePlaceholder')}
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="email">
                  {t('contactInfo.form.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  className={styles.formInput}
                  placeholder={t('contactInfo.form.emailPlaceholder')}
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="size">
                  {t('contactInfo.form.size')}
                </label>
                <select
                  id="size"
                  className={styles.formSelect}
                  value={formData.size}
                  onChange={e => setFormData(prev => ({ ...prev, size: e.target.value }))}
                >
                  <option value="" disabled>{t('contactInfo.form.sizePlaceholder')}</option>
                  {SIZES.map(s => (
                    <option key={s} value={s}>{t(`contactInfo.form.sizes.${s}`)}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="bodyPart">
                  {t('contactInfo.form.bodyPart')}
                </label>
                <select
                  id="bodyPart"
                  className={styles.formSelect}
                  value={formData.bodyPart}
                  onChange={e => setFormData(prev => ({ ...prev, bodyPart: e.target.value }))}
                >
                  <option value="" disabled>{t('contactInfo.form.bodyPartPlaceholder')}</option>
                  {BODY_PARTS.map(bp => (
                    <option key={bp} value={bp}>{t(`contactInfo.form.bodyParts.${bp}`)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                {t('contactInfo.form.referenceImage')}
              </label>
              <button
                type="button"
                className={styles.fileUpload}
                onClick={() => fileInputRef.current?.click()}
              >
                <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {referenceImage ? (
                  <span className={styles.fileName}>{referenceImage.name}</span>
                ) : (
                  <span className={styles.filePlaceholder}>{t('contactInfo.form.uploadPrompt')}</span>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className={styles.fileInput}
                accept="image/png,image/jpeg,image/webp,image/heic"
                onChange={e => setReferenceImage(e.target.files?.[0] || null)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="description">
                {t('contactInfo.form.description')}
              </label>
              <textarea
                id="description"
                className={styles.formTextarea}
                placeholder={t('contactInfo.form.descriptionPlaceholder')}
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                className={`${styles.submitBtn} ${submitting ? styles.submitting : ''}`}
                disabled={submitting}
              >
                {submitting ? t('contactInfo.form.sending') : t('contactInfo.form.submit')}
              </button>

              {submitStatus === 'success' && (
                <p className={styles.successMessage}>{t('contactInfo.form.successMessage')}</p>
              )}
              {submitStatus === 'error' && submitErrors.map((err, i) => (
                <p key={i} className={styles.errorMessage}>{err}</p>
              ))}
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
