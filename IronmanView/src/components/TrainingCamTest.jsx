import React, { useContext, useEffect, useRef, useState } from 'react'
import { io } from "socket.io-client"
import { CountContext } from '../context/CountContext';
import axios from 'axios';

function TrainingCam({ viewKnee, viewLegHip }) {
  const wsRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState("");
  const { setSuccessCount, setFailCount, setReportImg } = useContext(CountContext);

  const viewKneeRef = useRef(viewKnee)
  const viewLegHipRef = useRef(viewLegHip)

  useEffect(() => {
    viewKneeRef.current = viewKnee;
    viewLegHipRef.current = viewLegHip;
  }, [viewKnee, viewLegHip]);

  useEffect(() => {
    wsRef.current = io.connect('http://localhost:525');

    wsRef.current.on("show", (data) => {
      try {
        setImgSrc(`data:image/jpeg;base64,${data.sendImg}`)
      } catch (error) {
        console.error(error)
      }
    });

    wsRef.current.on("short_feed", (data) => {
      console.log("숏피드")
    });

    wsRef.current.on("report", (data) => {
      console.log(data)
      setReportImg(`data:image/jpeg;base64,${data[1]}`)
      axios.post("localhost:456",data)
      .then((res)=>{
        if(data[0] == "badpose"){
          res.result
          res.img
        }
      })
    });

    wsRef.current.on("goodCount", (data) => {
      setSuccessCount(data)
    });

    wsRef.current.on("badCount", (data) => {
      setFailCount(data)
    });

    const sendImage = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas) {
        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg");

        const data = {
          image: imageData,
          viewKnee: viewKneeRef.current,
          viewLegHip: viewLegHipRef.current
        };

        if (data.image) {
          wsRef.current.emit("analyze", data);
        }
      }
    }, 100);

    return () => {
      clearInterval(sendImage);
      wsRef.current.disconnect();
    };
  }, []);

  return (
    <div>
      <img src={imgSrc} alt="분석된 이미지" />
      <video
        ref={videoRef}
        src="/videos/sidesquat.mp4"
        onLoadedMetadata={() => videoRef.current.play()}
        muted
        style={{ display: "none" }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  )
}

export default TrainingCam
