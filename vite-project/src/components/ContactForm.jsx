import React from "react"
import ash from '/src/assets/ash.png'
import vik from '/src/assets/vik.png'


function ContactForm(){
    return(
        <div className="projects-page">
       <h1>Projects</h1>
       <img src={vik} alt="Project Vik" />
       
       <img src={ash} alt="Project Ash" />
       </div>
    )
}

export default ContactForm
