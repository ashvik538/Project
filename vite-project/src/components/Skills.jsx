import React from "react"

function Skills(){
    return(
        <>
        <section class="skills">
  <h2>Tech Stack</h2>
  
  <div class="skill-group">
    <h3>Frontend</h3>
    <ul class="skill-list">
      <li>React.js</li>
      <li>JavaScript (ES6+)</li>
      <li>Tailwind CSS</li>
      <li>HTML5 / CSS3</li>
      <li>Redux / Context API</li>
    </ul>
  </div>

  <div class="skill-group">
    <h3>Backend</h3>
    <ul class="skill-list">
      <li>Node.js</li>
      <li>Express.js</li>
      <li>REST APIs</li>
      <li>JWT Auth</li>
      <li>MongoDB + Mongoose</li>
    </ul>
  </div>

  <div class="skill-group">
    <h3>Tools & Deploy</h3>
    <ul class="skill-list">
      <li>Git & GitHub</li>
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