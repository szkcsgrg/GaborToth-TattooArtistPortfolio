import Hero from '../../components/Hero/Hero.tsx'
import About from '../../components/About/About.tsx'
import Services from '../../components/Services/Services.tsx'
import GalleryPreview from '../../components/GalleryPreview/GalleryPreview.tsx'
import Reviews from '../../components/Reviews/Reviews.tsx'
import CallToAction from '../../components/CallToAction/CallToAction.tsx'

interface HomeProps {
  isRevealed: boolean
}

export default function Home({ isRevealed }: HomeProps) {
  return (
    <>
      <Hero isRevealed={isRevealed} />
      <About isRevealed={isRevealed} />
      <Services isRevealed={isRevealed} />
      <GalleryPreview isRevealed={isRevealed} />
      <Reviews isRevealed={isRevealed} />
      <CallToAction isRevealed={isRevealed} />
    </>
  )
}
