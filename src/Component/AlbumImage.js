import { useEffect, useState } from "react";
import styles from "../css/albumImage.module.css";
// firebase storage
import firebase from "firebase/app";
import { storage } from "../firebaseInit";
import {
  uploadBytes,
  listAll,
  getDownloadURL,
  ref,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";
import {
  addDoc,
  doc,
  setDoc,
  arrayUnion,
  updateDoc,
  getDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "../firebaseInit";
//bootstrap overlay or tooltip
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
// bootstrap modal
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
// bootstrap carousel
import Carousel from "react-bootstrap/Carousel";
// react-toastify
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
  import "react-toastify/dist/ReactToastify.css";
  import CustomToastContent from "../CustomToastContent";
const AlbumImage = ({ img, myAlbum, index, deleteAlbum }) => {
  const [isHover, setIsHover] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imgUrl, setImgUrl] = useState([]);
  // storing albumSpecific photos here and storing in state
  const [albumSpecificPhoto, setAlbumSpecifPhoto] = useState([]);

  async function handleAlbumSpecifiPhoto() {
    const documentRef = doc(db, "photoAlbum", myAlbum.id);
    const docSnap = await getDoc(documentRef);
    const albumPhoto = docSnap.data();
    if (albumPhoto === undefined || albumPhoto == null) {
      setAlbumSpecifPhoto([]);
    } else {
      setAlbumSpecifPhoto(albumPhoto.photos);
    }
  }

  // 1st modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //second modal
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  
  function handleShows(e) {
    if (e.target.id === "mybtn") {
      console.log("yes working");
    }
    let res = window.confirm("Are you sure want to delete this album?");
    console.log("alert", res);
    if (res === true) {
      deleteAlbum(myAlbum);
      //toastify message
      // toast.success('album deleted successfully!!',{autoClose:8000});
      toast.success(<CustomToastContent message="album deleted successfully!!!"/>)
    }
  }

  //for file submission
  async function handleSubmit(event) {
    event.preventDefault();
    if (selectedFile !== null) {
      let file = selectedFile.name;
      //console.log(file,'file');

      //creating storage reference
      const imgRef = ref(storage, `files/${v4()}`);
      uploadBytes(imgRef, selectedFile).then((value) => {
        //console.log(value,'value');
        getDownloadURL(value.ref).then(async (url) => {
          setImgUrl((data) => [...data, url]); //it will give me array
          const documentRef = doc(db, "photoAlbum", myAlbum.id);
          const docSnap = await getDoc(documentRef);
          if (docSnap.exists()) {
            console.log("yes exist");
            console.log(docSnap.data(), "data");
            let photoArray = docSnap.data().photos;
            photoArray.push(url);
            //then after adding url to photoarray ,update it
            await updateDoc(doc(db, "photoAlbum", myAlbum.id), {
              photos: photoArray,
            });
          } else {
            console.log("does not exist");
            let docRef = doc(db, "photoAlbum", myAlbum.id);
            setDoc(docRef, {
              photos: [url],
            });
          }
        });
      });

      // toast message
      toast(<CustomToastContent message="photo uploaded successfully!!!"/>)

    } else {
      console.log("file not found");
      toast(<CustomToastContent message="you have not selected photos!!!"/>)
    }

    //clearing the input file  by default it does not get cleared due to broswer security restriction.
    setSelectedFile(null);


  }
  useEffect(() => {
    listAll(ref(storage, "files")).then((imgs) => {
      //console.log(imgs);
      imgs.items.forEach((val) => {
        getDownloadURL(val).then((url) => {
          setImgUrl((data) => [...data, url]);
        });
      });
    });
  }, []);

  console.log("imgUrlArray", imgUrl);

  function fileChangeHandler(e) {
    let fileObject = e.target.files[0];
    setSelectedFile(fileObject);
  }

  console.log(albumSpecificPhoto, "specif photo");
  async function handlePicDelete(index) {
    // 1.delete image from storage
    let image = albumSpecificPhoto[index];
    console.log(image, "deleted image");
    const docRef = ref(storage, `files/${image}`);

    // Delete the file
    deleteObject(docRef)
      .then(() => {
        // File deleted successfully
        console.log("File deleted successfully");
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        console.log("There is some error");
      });

    //2.delete image from local state and then from cloud firestore  Collection
    albumSpecificPhoto.splice(index,1);
    setAlbumSpecifPhoto(albumSpecificPhoto);
    await updateDoc(doc(db, "photoAlbum", myAlbum.id), {
      photos: albumSpecificPhoto,
    });
    //toastify message
    toast.success(<CustomToastContent message="photo deleted successfully!!!"/>)
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.imageSection} onClick={handleShows}>
          {isHover && (
            <>
            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Tooltip!</Tooltip>}>
            <button
              key={index}
              id="mybtn"
              style={{
                position: "absolute",
                top: "7rem",
                left: "5rem",
                transform: "scale(1.5)",
                border: "none",
                background: "red",
                borderRadius: "4px",
                color: "#fff",
              }}
            >
              Double click to Delete
            </button>
            </OverlayTrigger>
           
            </>
            
          )}
          <img
            onMouseOver={() => setIsHover(true)}
            className={styles.img}
            src={myAlbum.img}
            onMouseOut={() => setIsHover(false)}
            alt="album not found"
          />
        </div>
        <div className={styles.heading}>
          <h3 style={{ width: "53%", color: "#ffff", marginLeft: "5px" }}>
            {myAlbum.album}
          </h3>
          {/* modal will open here for adding images */}
          <button className={styles.btn} onClick={handleShow}>
            Add Photo
          </button>

          {/* Bootstrap Modals  starts here*/}
          <Modal show={show} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
              <Modal.Title>choose photo to upload</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmit}>
                <input type="file" name="images" onChange={fileChangeHandler} />
                <br />
                <br />

                <button
                  className={styles.btn1}
                  style={{ transform: "scale(1)" }}
                >
                  Submit
                </button>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              {/* <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button> */}
            </Modal.Footer>
          </Modal>
          {/* Bootstrap Modal; ended here. */}
          {/*modal will open here for viewing images  */}
          <button
            className={styles.btn1}
            onClick={async () => {
              try {
                handleShow2();
                await handleAlbumSpecifiPhoto();
              } catch (error) {
                console.log(error);
              }
            }}
          >
            View Photos
          </button>
        </div>

        {/* bootstrap modal starts here */}
        <Modal show={show2} onHide={handleClose2} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>View uploaded Photos</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {albumSpecificPhoto.length === 0 ? (
              <h2>You have not Uploaded photos yet!!!</h2>
            ) : (
              <Carousel>
                {albumSpecificPhoto.map((pics, index) => (
                  <Carousel.Item>
                    <Carousel.Caption>
                      <button style={{transform:"sacle(1.5)",border:"none",background:"red",borderRadius:"4px"}} onClick={() => handlePicDelete(index)}>DeletePic</button>
                      </Carousel.Caption>
                    <img
                      key={index}
                      src={pics}
                      height="400px"
                      width="500px"
                      alt="pic not found"
                    />
                    
                  </Carousel.Item>
                ))}
              </Carousel>
            )}
            {/*carousel ends here  */}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose2}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        {/* bootstrap modal ends here. */}
      </div>
    </>
  );
};
export default AlbumImage;
