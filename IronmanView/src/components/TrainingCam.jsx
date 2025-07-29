// project/IronmanView/src/components/TrainingCam.jsx
import React, { useEffect, useRef, useState } from 'react'
import Webcam from "react-webcam";
import {io} from "socket.io-client"

function TrainingCam() {
  const wsRef = useRef(null);
  const webcamRef = React.useRef(null);
  const [imgSrc,setImgSrc] = useState("");
  <webcamRef ref={webcamRef}></webcamRef>

  useEffect(()=>{
    wsRef.current = io.connect('http://localhost:525');
    wsRef.current.on("show",(data) => {
      try{
        setImgSrc(`data:image/jpeg;base64,${data}`)
        
      }catch(error){
        console.error(error)
      }
      
    })
    
    const sendImage = setInterval(()=>{
      const imgSrc= webcamRef.current.getScreenshot();
      console.log();
      const data = {
        "image": imgSrc
      }
      wsRef.current.emit("analyze",data)
    },100);
    sendImage
    // wsRef.current.emit("analyze",webcamRef.current.getScreenshot())
    return () => {
      wsRef.current.disconnect();
    };
  },[]);
  
  
  // if (event.data) {
  //       const base64ImageData = 'data:image/jpg;base64,' + event.data;
  //       setCctvData(base64ImageData);
  //     }

  return (
    
    <div>
      <Webcam ref={webcamRef}/>
      <img src={imgSrc} alt="" />
    </div>
  )
}

export default TrainingCam