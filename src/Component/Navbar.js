import { useState } from "react";
import styles from '../css/Navbar.module.css';

const Navbar=({setSearchValue})=>{
    const [val,setVal]=useState('');
    function searchHandler(e){
        setVal(e.target.value);
        setSearchValue(val);
    }
    return (
        <div className={styles.parent}>
        <div className="logo">
            <img src="https://cdn.dribbble.com/users/1612143/screenshots/10585194/media/f898b8a3f282c106ea93689a01e258df.jpg?resize=400x0" height="100px" width="108px" background="#a0a0f9" />
            <i class="fi fi-rs-gallery"></i>
        </div>
        <div className="heading">
            <h1>PHOTOFOLIO</h1>
        </div>
        </div>
    )


}

export default Navbar;