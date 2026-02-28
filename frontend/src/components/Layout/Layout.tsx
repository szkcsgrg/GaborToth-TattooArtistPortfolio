import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar.tsx'
import Footer from '../Footer/Footer.tsx'
import styles from './Layout.module.scss'

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
