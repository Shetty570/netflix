import React from 'react'
import "./Banner.css"

function Banner() {
  return (
    <header className = "banner" style={{
        backgroundSize: "cover",
        backgroundImage: `url("https://media.dev.to/cdn-cgi/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fhjukkwcishwdbbo3vp5m.jpeg")`,
        backgroundPosition: "center center"
    }}>

        <div className="banner_contents">
            <h1 className="banner_title">Movie Name</h1>
            <div className =" banner_buttons">
                    <button className="banner_button">Play</button>
                    <button className="banner_button">My List</button>
            </div>
            <h1 className='banner_description'>Test Description</h1>
        </div>
        <div className = "banner--fadebottom"/>
    </header>
  )
}

export default Banner