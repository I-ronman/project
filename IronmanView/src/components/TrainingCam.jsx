// project/IronmanView/src/components/TrainingCam.jsx
import React, { useContext, useEffect, useRef, useState } from 'react'
import Webcam from "react-webcam";
import {io} from "socket.io-client"
import { CountContext } from '../context/CountContext';

function TrainingCam({viewKnee}) {
  const wsRef = useRef(null);
  const webcamRef = React.useRef(null);
  const [imgSrc,setImgSrc] = useState("");
  const {setSuccessCount,setFailCount} = useContext(CountContext);
  <webcamRef ref={webcamRef}></webcamRef>
  const videoConstraints = {
  width: 1024,
  height: 680,
  facingMode: "user"
  };
  const viewKneeRef = useRef(viewKnee)

  useEffect(() => {
  viewKneeRef.current = viewKnee;
  }, [viewKnee]);
  useEffect(()=>{
    wsRef.current = io.connect('http://localhost:525');
    wsRef.current.on("show",(data) => {
      try{
        setImgSrc(`data:image/jpeg;base64,${data.sendImg}`)
        
      }catch(error){
        console.error(error)
      }
      
    })
    wsRef.current.on("goodCount",(data)=>{
      setSuccessCount(data)
    })
    wsRef.current.on("badCount",(data)=>{
      setFailCount(data)
    })
    const sendImage = setInterval(()=>{
      const imgSrc= webcamRef.current.getScreenshot();
      console.log();
      const data = {
        image: imgSrc,
        viewKnee:viewKneeRef.current
      }
      if(data.image){
        console.log(data.viewKnee)
        wsRef.current.emit("analyze",data)
      }
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
      <img src={imgSrc} alt="" />
      <Webcam ref={webcamRef} style={{ visibility: 'hidden', position: 'absolute'}} videoConstraints={videoConstraints}/>
    </div>
  )
}

export default TrainingCam