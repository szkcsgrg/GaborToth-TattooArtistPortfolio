import Hero from '../../components/Hero/Hero.tsx'
import About from '../../components/About/About.tsx'

interface HomeProps {
  isRevealed: boolean
}

export default function Home({ isRevealed }: HomeProps) {
  return (
    <>
      <Hero isRevealed={isRevealed} />
      <About isRevealed={isRevealed} />
    </>
  )
}
