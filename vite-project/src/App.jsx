import { useState, useEffect } from 'react'
import Icon from './Icon'
import Home from './components/Home'
import About from './components/About'
import Contact from './components/Contact'
import ContactForm from './components/ContactForm'
import Skills from './components/Skills'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'

import './Navbar.css'

function NavBar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => { setOpen(false) }, [location])

  const links = [
    { to: '/',       label: 'Home',    cls: 'box1' },
    { to: '/about',  label: 'About',   cls: 'box2' },
    { to: '/projects', label: 'Projects', cls: 'box4' },
    { to: '/skills', label: 'Skills',  cls: 'box5' },
    { to: '/contact', label: 'Contact', cls: 'box3' },
    { to: '/admin',  label: 'Admin 🔒', cls: 'box6' },
  ]

  return (
    <>
      <ul className='navbar'>
        <li className='nav-brand'>Ashvik</li>

        {/* Desktop links */}
        <ul className='nav-links'>
          {links.map(l => (
            <li key={l.to}>
              <Link to={l.to} className={l.cls}>{l.label}</Link>
            </li>
          ))}
        </ul>

        {/* Hamburger button */}
        <button
          className={`nav-hamburger ${open ? 'open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>
      </ul>

      {/* Mobile dropdown */}
      <nav className={`nav-mobile-menu ${open ? 'open' : ''}`}>
        {links.map(l => (
          <Link key={l.to} to={l.to} className={l.cls}>{l.label}</Link>
        ))}
      </nav>
    </>
  )
}

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/projects' element={<ContactForm />} />
          <Route path='/skills' element={<Skills />} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route
            path='/admin'
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>

      <Icon />
    </>
  )
}

export default App
