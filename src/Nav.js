import React from 'react';
import './Nav.css';

function Nav() {
  return (
    <div className="nav nav_black">
      <div className="nav_contents">
        <img
          className="nav_logo"
          src="https://c0.klipartz.com/pngpicture/26/116/gratis-png-logotipo-de-netflix-programa-de-television-de-netflix-transmision-de-peliculas-multimedia-logotipo-de-netflix-thumbnail.png"
          alt="Logo"
        />
        <img
          className="nav_avatar"
          src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
          alt="avatar"
        />
      </div>
    </div>
  );
}

export default Nav;
