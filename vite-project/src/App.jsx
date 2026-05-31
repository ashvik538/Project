import Icon from './Icon'
import Home from './components/Home'
import About from './components/About'
import Contact from './components/Contact'
import ContactForm from './components/ContactForm'
import Skills from './components/Skills'
import {BrowserRouter,Routes,Route,Link} from 'react-router-dom'

import './Navbar.css'


function App() {
  

  return (
    <>
      
     <BrowserRouter>
     <ul className='navbar'>
        <li><Link to="/" className='box1'>Home</Link></li>
        <li><Link to="/about" className='box2'>About</Link></li>
        <li><Link to="/projects" className='box4'>Projects</Link></li>
        <li><Link to="/skills" className='box5'>Skills</Link></li>
        <li><Link to="/contact" className='box3'>Contact</Link></li>

      </ul>
     <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/about' element={<About/>} />
      <Route path='/contact' element={<Contact/>} />
      <Route path='/projects' element={<ContactForm/>} />
      <Route path='/skills' element={<Skills/>} />

      
      
     </Routes>
     </BrowserRouter>
     

     

     <Icon/>
     
      
      
    </>
  )
}

export default App
