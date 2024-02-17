
import { useState } from "react";
import AlbumImage from "./AlbumImage";
import { images } from "../images";
import styles from '../css/imageList.module.css'


const AlbumList=({albums,ind,deleteAlbum,searchValue})=>{
    const [image,setImage]=useState(images);
    return (
        <>
        <div  className={styles.container}>
            {albums.map((al)=>(
                <>
                 <AlbumImage myAlbum={al} img={image} index={ind} deleteAlbum={deleteAlbum}/>
                </>
            ))}
       
        
        </div>
        </>
    )

}
export default AlbumList;