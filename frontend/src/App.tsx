import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout.tsx'
import LoadingScreen from './components/LoadingScreen/LoadingScreen.tsx'
import Home from './pages/Home/Home.tsx'
import Gallery from './pages/Gallery/Gallery.tsx'
import Contact from './pages/Contact/Contact.tsx'
import Information from './pages/Information/Information.tsx'
import NotFound from './pages/NotFound/NotFound.tsx'


export default function App() {
  const [loading, setLoading] = useState(true)
  const [isRevealed, setIsRevealed] = useState(false)

  const handleLoadingComplete = () => {
    setLoading(false)
    setIsRevealed(true)
  }

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home isRevealed={isRevealed} />} />
          <Route path="/galeria" element={<Gallery />} />
          <Route path="/kapcsolat" element={<Contact />} />
          <Route path="/informaciok" element={<Information />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

