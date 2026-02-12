import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar.tsx'

export default function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  )
}
