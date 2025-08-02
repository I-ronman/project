// project/IronmanView/src/components/TrainingCam.jsx
import React, { useContext, useEffect, useRef, useState } from 'react'
import Webcam from "react-webcam";
import {io} from "socket.io-client"
import { CountContext } from '../context/CountContext';

function TrainingCam({viewKnee,viewLegHip}) {
  const wsRef = useRef(null);
  const webcamRef = React.useRef(null);
  const [imgSrc,setImgSrc] = useState("");
  const {setSuccessCount,setFailCount,setReportImg} = useContext(CountContext);

  <webcamRef ref={webcamRef}></webcamRef>
  const videoConstraints = {
  width: 1024,
  height: 680,
  facingMode: "user"
  };
  const viewKneeRef = useRef(viewKnee)
  const viewLegHipRef = useRef(viewLegHip)

  useEffect(() => {
  viewKneeRef.current = viewKnee;
  viewLegHipRef.current = viewLegHip
  }, [viewKnee,viewLegHip]);
  useEffect(()=>{
    wsRef.current = io.connect('http://localhost:525');
    wsRef.current.on("show",(data) => {
      try{
        setImgSrc(`data:image/jpeg;base64,${data.sendImg}`)
        
      }catch(error){
        console.error(error)
      }
      
    })
    wsRef.current.on("short_feed",(data)=>{
      console.log("숏피드")
    })
    wsRef.current.on("report",(data)=>{
      console.log(data)
    })
    wsRef.current.on("goodCount",(data)=>{
      setSuccessCount(data)
    })
    wsRef.current.on("badCount",(data)=>{
      setFailCount(data)
    })
    const sendImage = setInterval(()=>{
      const imgSrc= webcamRef.current.getScreenshot();
      const data = {
        image: imgSrc,
        viewKnee:viewKneeRef.current,
        viewLegHip:viewLegHipRef.current
      }
      if(data.image){
        wsRef.current.emit("analyze",data)
      }
    },100);
    
    
    // wsRef.current.emit("analyze",webcamRef.current.getScreenshot())
    return () => {
      wsRef.current.disconnect();
    };
  },[]);
  const handleUserMedia = () => {
    const stream = webcamRef.current?.video?.srcObject;
    console.log('stream:', stream);

    if (stream) {
      const [track] = stream.getVideoTracks();
      const capabilities = track.getCapabilities();
      console.log('zoom capabilities:', capabilities.zoom);

      if (capabilities.zoom) {
        track
          .applyConstraints({
            advanced: [{ zoom: capabilities.zoom.min }]
          })
          .then(() => {
            console.log('✅ 줌아웃 적용 완료');
          })
          .catch((err) => {
            console.error('❌ 줌 설정 실패:', err);
          });
      } else {
        console.warn('❌ 카메라가 줌 기능을 지원하지 않음');
      }
    }
  }

  return (
    
    <div>
      <img src={imgSrc} alt="" />
      <Webcam ref={webcamRef} onUserMedia={handleUserMedia} style={{ visibility: 'hidden', position: 'absolute'}} videoConstraints={videoConstraints}/>
    </div>
  )
}

export default TrainingCam