import { useEffect, useState } from "react";
import Navbar from "./Component/Navbar";
import AlbumForm from "./Component/AlbumForm";
import styles from './css/app.module.css'
import AlbumList from "./Component/AlbumList";
import { db } from "./firebaseInit";
import { doc,collection, onSnapshot ,deleteDoc} from "firebase/firestore";
import Spinner from 'react-spinner-material';
function App() {
  const [show,setShow]=useState(false);
  console.log(show);
  const [albums,setAlbums]=useState([]);
  const [index,setIndex]=useState(0);
  const[loading,setLoading]=useState(false);
  useEffect(()=>{
    setLoading(true);
    // getting data with real-time updates
    const unsub=onSnapshot(collection(db,"albums"),(snapshot)=>{
      console.log(snapshot.docs);
      const allAlbums=snapshot.docs.map((doc)=>{
        return {
          id:doc.id,
          ...doc.data()
        }
      });
      setAlbums(allAlbums);
    });
    console.log(albums);
    setTimeout(()=>{
      setLoading(false);
    },1000);

    
  },[]);
 async function deleteAlbum(albumObj){
  console.log(albumObj,'albumobj');

  const updatedAlbum=albums.filter((al)=>al.id!==albumObj.id);
  setAlbums(updatedAlbum);
  
 //deleting data from firebase
   await deleteDoc(doc(db, "albums", albumObj.id));


 }
//  input value for search functionality
const [searchValue,setSearchValue]=useState('');

  return (
    <>
   {/* using spinner to load  */}
    {loading?<Spinner radius={120} color={"#333"} stroke={2} visible={true} />:   
    (<div className="App">
     <Navbar setSearchValue={setSearchValue}/>
     <button onClick={()=>setShow(!show)}className={show?styles.removeBtn:styles.album}>Add Album</button>
     {show?<AlbumForm setIndex={setIndex}/>:null}
     <button onClick={()=>setShow(!show)}className={show?styles.showBtn:styles.removeBtn}>Cancel</button>
     <h1 style={{width: "20rem",
    marginLeft: "21rem"}}>Your Albums</h1>
    
    
    <AlbumList ind={index}albums={albums} deleteAlbum={deleteAlbum}
    searchValue={searchValue}
    />
    </div>)
     }
    </>
    
  );
}

export default App;
