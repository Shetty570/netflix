import React, {useState , useEffect} from 'react';
import './Nav.css';
import logo from "./asset/Netflix_Logo_PMS.png"

function Nav() {

  const[show, setShow] = useState(false)

   const transistionNavBar = () =>{
    if (window.scrollY>100) {
      setShow(true)
    }else{
      setShow(false)
    }

   }


   useEffect(() =>{
    window.addEventListener("scroll",transistionNavBar);
    return () => window.removeEventListener("scroll",transistionNavBar);
   },[]);



  return (
    <div className={`nav ${show && `nav_black`}`}>
      <div className="nav_contents">
        <img
          className="nav_logo"
          src={logo}
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
