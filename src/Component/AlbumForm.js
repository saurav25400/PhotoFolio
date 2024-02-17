
import { useRef } from 'react';
import styles from '../css/albumForm.module.css'
import { db } from '../firebaseInit';
import { collection, addDoc } from "firebase/firestore";
import { images } from '../images';
import {toast} from 'react-toastify';
import CustomToastContent from '../CustomToastContent';
const AlbumForm=({setIndex})=>{
    const inputRef=useRef();
    function clearInput(){
        inputRef.current.value="";
    }
    async function albumHandler(e){
        e.preventDefault();
        let data= inputRef.current.value;
        let randomIndex= Math.floor((Math.random() * (images.length)));  //se may be index i.e ..last index <n
        setIndex(randomIndex);
        // Add a new document with a generated id.
       const docRef = await addDoc(collection(db, "albums"), {
      album:data,
      img:images[randomIndex]
    });

    //toast message

    toast.success(<CustomToastContent message="album created successfully!!!"/>)
    }
    return (<>
    <div className={styles.container}>
    <div className={styles.parent}>
        <form onSubmit={albumHandler}>
            <input className={styles.input}type="text" ref={inputRef} name="album" placeholder='Album Name' required/>
            <button onClick={clearInput}className={styles.button}>Clear</button>
            <button className={styles.buttons}>Create</button>
        </form>
    </div>
    </div>
    </>)
}
export default AlbumForm;