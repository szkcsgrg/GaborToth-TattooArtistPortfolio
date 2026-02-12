import Hero from '../../components/Hero/Hero.tsx'

interface HomeProps {
  isRevealed: boolean
}

export default function Home({ isRevealed }: HomeProps) {
  return (
    <>
      <Hero isRevealed={isRevealed} />
    </>
  )
}
