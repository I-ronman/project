// project/IronmanView/src/components/TrainingCamTest.jsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { CountContext } from '../context/CountContext';
import axios from 'axios';

function TrainingCamTest({ viewKnee, viewLegHip, onVideoEnd }) {
  const wsRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const goodCountRef = useRef(null);
  const badCountRef = useRef(null);
  const [imgSrc, setImgSrc] = useState("");

  const {
    setGoodCount,
    setBadCount,
    goodCount,
    badCount,
    setReportImg,
    setCapturedList
  } = useContext(CountContext);

  const viewKneeRef = useRef(viewKnee);
  const viewLegHipRef = useRef(viewLegHip);

  useEffect(() => {
    viewKneeRef.current = viewKnee;
    viewLegHipRef.current = viewLegHip;
    goodCountRef.current = goodCount;
    badCountRef.current = badCount;
  }, [viewKnee, viewLegHip,goodCount,badCount]);

  useEffect(() => {
    wsRef.current = io.connect('http://localhost:525');

    wsRef.current.on("show", (data) => {
      try {
        setImgSrc(`data:image/jpeg;base64,${data.sendImg}`);
      } catch (error) {
        console.error(error);
      }
      setBadCount(data.bad_cnt)
      setGoodCount(data.good_cnt)

    });

    wsRef.current.on("short_feed", (data) => {
      console.log("숏피드");
      axios.post("http://localhost:456/short_feed",{"image":`data:image/jpeg;base64,${data.img}`, exercise:data.exercise})
      .then(response => {
        console.log(response)
      })
    });

    wsRef.current.on("report", (data) => {
      axios.post("http://localhost:456/report",{"image":`data:image/jpeg;base64,${data[1].img}`, exercise:data[1].exercise})
      .then(response => {
        console.log(response)
      })
      const poseType = data[0];
      const base64Img = `data:image/jpeg;base64,${data[1]}`;
      console.log(data)
      const normalized = poseType.toLowerCase();
      const issue = (normalized.includes('good') || normalized.includes('best')) ? '1' : '0';

      setReportImg(base64Img); // 미리보기 용도
      setCapturedList(prev => [...prev, { img: base64Img, issue }]);
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
          exerciseName:"birddog",
          view : {knee:viewKneeRef.current, leg_hip_angle:viewLegHipRef.current,center_of_gravity:false,upper_body_slope:false}
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
        src="/videos/birddog4.mp4"
        onLoadedMetadata={() => videoRef.current.play()}
        onEnded={onVideoEnd}
        muted
        style={{ display: "none" }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

export default TrainingCamTest;
