import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout.tsx'
import LoadingScreen from './components/LoadingScreen/LoadingScreen.tsx'
import Home from './pages/Home/Home.tsx'
import Gallery from './pages/Gallery/Gallery.tsx'
import ContactInfo from './pages/ContactInfo/ContactInfo.tsx'
import NotFound from './pages/NotFound/NotFound.tsx'


const API_URL = import.meta.env.VITE_API_URL || ''

export default function App() {
  const [loading, setLoading] = useState(true)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/api/visits`, { method: 'POST' }).catch(() => {})
  }, [])

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
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<ContactInfo />} />
          <Route path="/information" element={<ContactInfo />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

