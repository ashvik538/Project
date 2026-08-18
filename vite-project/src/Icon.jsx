import {FaInstagram, FaYoutube, FaXTwitter, FaGithub, FaLinkedin, FaFacebook} from 'react-icons/fa6'

function Icon(){
    return(
        <footer>
            <svg width="0" height="0" style={{position:'absolute'}}>
              <linearGradient id="instaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#833AB4" />
                <stop offset="50%"  stopColor="#E1306C" />
                <stop offset="100%" stopColor="#FCAF45" />
              </linearGradient>
            </svg>

            <div className="footer-icons">
              <a href="https://www.instagram.com/ThiraiTech_100" target="_blank" rel="noreferrer" aria-label="Instagram">
                <FaInstagram size={36} style={{ fill: "url(#instaGradient)" }} />
              </a>
              <a href="https://www.youtube.com/@ThiraiTech_75" target="_blank" rel="noreferrer" aria-label="YouTube">
                <FaYoutube size={36} color='#ff0000' />
              </a>
              <a href="https://www.x.com/ThiraiTech_75" target="_blank" rel="noreferrer" aria-label="X / Twitter">
                <FaXTwitter size={36} color='#e2e8f0' />
              </a>
              <a href="https://github.com/ashvik538" target="_blank" rel="noreferrer" aria-label="GitHub">
                <FaGithub size={36} color='#e2e8f0' />
              </a>
              <a href="https://www.linkedin.com/in/ashvik-j-71a056342?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <FaLinkedin size={36} color='#0a66c2' />
              </a>
              <a href="https://www.facebook.com/share/17ZHsAbR3p/" target="_blank" rel="noreferrer" aria-label="Facebook">
                <FaFacebook size={36} color='#1877f2' />
              </a>
            </div>

            <p>&copy; 2026 ashvik. All rights reserved.</p>
        </footer>
    )
}

export default Icon
