import React, { useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { CountContext } from '../context/CountContext';
import axios from 'axios';
import { getSpeech } from "../utils/getSpeach";

function TrainingCamTest({
  //  isStarted, onGoodPosture, onBadPosture 추가
  isStarted,
  viewKnee,
  viewLegHip,
  onVideoEnd,
  currentExercise,
  onGoodPosture,
  onBadPosture
}) {
  const [value, setValue] = useState("")
  const wsRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const goodCountRef = useRef(null);
  const badCountRef = useRef(null);
  const [imgSrc, setImgSrc] = useState("");
  const totalCountRef = useRef(0);

  const videoMap = {
    "스쿼트": "squat.mp4",
    "버드독": "birddog0.mp4",
    "사이드 스쿼트": "sidesquat.mp4",
    // 필요 시 계속 추가
  };

  const nameKey = currentExercise?.exerciseName?.trim();
  const videoFile = nameKey && videoMap[nameKey] ? videoMap[nameKey] : null;

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
  }, [viewKnee, viewLegHip, goodCount, badCount]);

  
  //  소켓 연결 
  
  useEffect(() => {
  if (!currentExercise) return;

  try {
    wsRef.current = io('http://localhost:525', {
      path: '/socket.io',
      transports: ['websocket'], 
      autoConnect: true
    });
  } catch (e) {
    console.error('socket.io connect error:', e);
    return;
  }

  const socket = wsRef.current;

 
  socket.on("show", (data) => {
    if (!isStarted) return;

    try {
      if (data?.sendImg) {
        setImgSrc(`data:image/jpeg;base64,${data.sendImg}`);
      }

      const prevGood = goodCountRef.current ?? 0;
      const prevBad  = badCountRef.current  ?? 0;
      const newGood  = data?.good_cnt ?? prevGood;
      const newBad   = data?.bad_cnt  ?? prevBad;

      const dGood = Math.max(0, newGood - prevGood);
      const dBad  = Math.max(0, newBad - prevBad);

      for (let i = 0; i < dGood; i++) onGoodPosture();
      for (let i = 0; i < dBad;  i++) onBadPosture();

      setGoodCount(newGood);
      setBadCount(newBad);
      goodCountRef.current = newGood;
      badCountRef.current = newBad;

      totalCountRef.current = newGood + newBad;
    } catch (err) {
      console.error('show handler error:', err);
    }
  });

  
  socket.on("short_feed", (data) => {
    (async () => {
      try {
        await axios.post("http://localhost:456/short_feed", {
          image: `data:image/jpeg;base64,${data.img}`,
          exercise: data.exercise
        }).then((res) => {
          setValue(res.result);
          getSpeech(value);
        });
      } catch (e) {
    
        console.warn('short_feed skipped:', e?.message || e);
      }
    })();
  });

 
  socket.on("report", (data) => {
    (async () => {
      try {
       
        await axios.post("http://localhost:456/report", {
          image: `data:image/jpeg;base64,${data[1].img}`,
          exercise: data[1].exercise
        }).catch(() => {/* ignore */});
      } catch { /* ignore */ }

      const poseType  = data?.[0] || "";
      const base64Img = `data:image/jpeg;base64,${data?.[1]?.img || ""}`;
      const normalized = poseType.toLowerCase();
      const isGood = normalized.includes('good') || normalized.includes('best'); // ✅ 선언
      const issue  = isGood ? '1' : '0';

      setReportImg(base64Img);

      setCapturedList(prev => [
        ...prev,
        {
          img: base64Img,                        
          issue: isGood ? '1' : '0',                                  
          type: isGood ? 'good' : 'bad',          
          exerciseId: currentExercise?.exerciseId
        }
      ]);
    })();
  });

  const sendImage = setInterval(() => {
    if (!isStarted) return;

    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth || !video.videoHeight) return;

    const ctx = canvas.getContext("2d");
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg");
    if (!imageData) return;

    const payload = {
      image: imageData,
      exerciseName: (currentExercise?.exerciseName || "unknown").toLowerCase(),
      view: {
        knee: viewKneeRef.current,
        leg_hip_angle: viewLegHipRef.current,
        center_of_gravity: false,
        upper_body_slope: false,
      },
    };

    try {
      socket.emit("analyze", payload);
    } catch (e) {
      console.warn('emit analyze failed:', e?.message || e);
    }
  }, 100);

  return () => {
    clearInterval(sendImage);
    if (socket) {
      socket.off("show");
      socket.off("short_feed");
      socket.off("report");
      try { socket.disconnect(); } catch {}
    }
  };
}, [currentExercise, isStarted]);




  // 시작/정지에 따른 영상 재생/정지
 
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isStarted) v.play().catch(() => {});
    else v.pause();
  }, [isStarted]);

  return (
    <div>
      {imgSrc ? <img src={imgSrc} alt="분석된 이미지" /> : null}

      {videoFile ? (
        <video
          ref={videoRef}
          src={`/videos/${videoFile}`}
          onLoadedMetadata={() => { if (isStarted) videoRef.current?.play(); }}
          onEnded={onVideoEnd}
          muted
          style={{ display: "none" }}
        />
      ) : null}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

export default TrainingCamTest;
