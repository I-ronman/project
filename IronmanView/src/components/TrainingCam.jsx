// project/IronmanView/src/components/TrainingCam.jsx

import React, { useContext, useEffect, useRef, useState } from 'react';
import Webcam from "react-webcam";
import { io } from 'socket.io-client';
import { CountContext } from '../context/CountContext';

function TrainingCam({ viewKnee, viewLegHip }) {
  const wsRef = useRef(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null); // 분석용 캔버스 추가
  const [imgSrc, setImgSrc] = useState("");

  const {
    setGoodCount,
    setBadCount,
    setReportImg,
    setCapturedList,  // ✅ 캡처 목록 추가
  } = useContext(CountContext);

  const viewKneeRef = useRef(viewKnee);
  const viewLegHipRef = useRef(viewLegHip);

  useEffect(() => {
    viewKneeRef.current = viewKnee;
    viewLegHipRef.current = viewLegHip;
  }, [viewKnee, viewLegHip]);

  useEffect(() => {
    wsRef.current = io.connect('http://localhost:525');

    wsRef.current.on("show", (data) => {
      try {
        setImgSrc(`data:image/jpeg;base64,${data.sendImg}`);
      } catch (error) {
        console.error(error);
      }
    });

    wsRef.current.on("report", (data) => {
      const poseType = data[0];
      const base64Img = `data:image/jpeg;base64,${data[1]}`;
      const normalized = poseType.toLowerCase();
      const issue = (normalized.includes('good') || normalized.includes('best')) ? '1' : '0';

      setReportImg(base64Img);
      setCapturedList(prev => [...prev, { img: base64Img, issue }]);
    });

    wsRef.current.on("goodCount", (data) => setGoodCount(data));
    wsRef.current.on("badCount", (data) => setBadCount(data));

    const sendImage = setInterval(() => {
      const video = webcamRef.current?.video;
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
          viewLegHip: viewLegHipRef.current,
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

  // 줌아웃 적용 (선택사항)
  const handleUserMedia = () => {
    const stream = webcamRef.current?.video?.srcObject;
    if (stream) {
      const [track] = stream.getVideoTracks();
      const capabilities = track.getCapabilities?.();
      if (capabilities?.zoom) {
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
      }
    }
  };

  const videoConstraints = {
    width: 1024,
    height: 680,
    facingMode: "user",
  };

  return (
    <div>
      <img src={imgSrc} alt="분석된 이미지" />
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        onUserMedia={handleUserMedia}
        style={{ visibility: 'hidden', position: 'absolute' }}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default TrainingCam;
