import {FaInstagram,FaYoutube,FaXTwitter,FaGithub,FaLinkedin,FaFacebook} from 'react-icons/fa6'

function Icon(){
    return(
        <footer>
            <center>
            <svg width="0" height="0">
<linearGradient id="instaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stopColor="#833AB4" />
<stop offset="50%" stopColor="#E1306C" />
<stop offset="100%" stopColor="#FCAF45" />
</linearGradient>
</svg>
<a href="https://www.instagram.com/ThiraiTech_100" target="_blank"><FaInstagram size={40} style={{ fill: "url(#instaGradient)" }} /></a>
<a href="https://www.youtube.com/@ThiraiTech_75" target="_blank"><FaYoutube size={40} color='red' /></a>
<a href="https://www.x.com/ThiraiTech_75" target="_blank"><FaXTwitter size={40} color='black' /></a>
<a href="https://github.com/ashvik538" target="_blank"><FaGithub size={40} color='black' /></a>
<a href="https://www.linkedin.com/in/ashvik-j-71a056342?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank"><FaLinkedin size={40} color='blue' /></a>
<a href="https://www.facebook.com/share/17ZHsAbR3p/" target="_blank"><FaFacebook size={40} color='blue' /></a><br />
<p>&copy; 2026 ashvik. All rights reserved.</p>
</center>
</footer>
    )
}

export default Icon




    

    
  


