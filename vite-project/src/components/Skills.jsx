import React from "react"

function Skills(){
    return(
        <>
        <section className="skills">
  <h2>Tech Stack</h2>
  
  <div className="skill-group">
    <h3>Frontend</h3>
    <ul className="skill-list">
      <li>React.js</li>
      <li>JavaScript (ES6+)</li>
      <li>Tailwind CSS</li>
      <li>HTML5 / CSS3</li>
      <li>Redux / Context API</li>
    </ul>
  </div>

  <div className="skill-group">
    <h3>Backend</h3>
    <ul className="skill-list">
      <li>Node.js</li>
      <li>Express.js</li>
      <li>REST APIs</li>
      <li>JWT Auth</li>
      <li>MongoDB + Mongoose</li>
    </ul>
  </div>

  <div className="skill-group">
    <h3>Tools &amp; Deploy</h3>
    <ul className="skill-list">
      <li>Git &amp; GitHub</li>
      <li>Vercel / Render</li>
      <li>Postman</li>
      <li>VS Code</li>
      <li>NPM</li>
    </ul>
  </div>
</section>
        </>
    )
}

export default Skills