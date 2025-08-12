// project/IronmanView/src/components/TrainingCam.jsx

import React, { useContext, useEffect, useRef, useState } from 'react';
import Webcam from "react-webcam";
import { io } from 'socket.io-client';
import axios from 'axios';
import { CountContext } from '../context/CountContext';

function TrainingCam({
  isStarted,
  viewKnee,
  viewLegHip,
  onVideoEnd,
  currentExercise,
  onGoodPosture,
  onBadPosture,
  viewShoulder,
  viewUpper,
}) {
  const wsRef = useRef(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const videoRef = useRef(null); // (선택) 가이드 영상 재생용
  const [imgSrc, setImgSrc] = useState("");

  // 카운트/리포트 컨텍스트
  const {
    setGoodCount,
    setBadCount,
    goodCount,
    badCount,
    setReportImg,
    setCapturedList,
  } = useContext(CountContext);

  // 최신 상태 유지용 ref
  const viewKneeRef = useRef(viewKnee);
  const viewLegHipRef = useRef(viewLegHip);
  const viewUpperRef = useRef(viewUpper);
  const viewShoulderRef = useRef(viewShoulder);
  const goodCountRef = useRef(0);
  const badCountRef = useRef(0);
  const totalCountRef = useRef(0);

  // (선택) 가이드 영상 맵
  const videoMap = {
    "스쿼트": "squat.mp4",
    "버드독": "birddog0.mp4",
    "사이드 스쿼트": "sidesquat.mp4",
    // 필요 시 추가
  };
  const nameKey = currentExercise?.exerciseName?.trim();
  const videoFile = nameKey && videoMap[nameKey] ? videoMap[nameKey] : null;

  // 최신 props를 ref에 반영
  useEffect(() => {
    viewKneeRef.current = viewKnee;
    viewLegHipRef.current = viewLegHip;
    viewShoulderRef.current = viewShoulder;
    viewUpperRef.current = viewUpper;
    goodCountRef.current = goodCount ?? 0;
    badCountRef.current = badCount ?? 0;
  }, [viewKnee, viewLegHip, viewUpper, viewShoulder, goodCount, badCount]);

  // 소켓 연결 및 이벤트 바인딩 + 프레임 전송 루프
  useEffect(() => {
    if (!currentExercise) return;

    // 1) 소켓 연결
    try {
      wsRef.current = io('http://localhost:525', {
        path: '/socket.io',
        transports: ['websocket'],
        autoConnect: true,
      });
    } catch (e) {
      console.error('socket.io connect error:', e);
      return;
    }
    const socket = wsRef.current;

    // 2) 서버 -> 클라이언트 이벤트 수신
    // show: 분석된 이미지 + 누적 카운트 수신
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

        // 증분만큼 콜백 호출
        for (let i = 0; i < dGood; i++) onGoodPosture && onGoodPosture();
        for (let i = 0; i < dBad;  i++) onBadPosture && onBadPosture();

        setGoodCount(newGood);
        setBadCount(newBad);
        goodCountRef.current = newGood;
        badCountRef.current = newBad;

        totalCountRef.current = newGood + newBad;
      } catch (err) {
        console.error('show handler error:', err);
      }
    });

    // short_feed: TTS로 짧은 피드백 받기
    socket.on("short_feed", (data) => {
      (async () => {
        try {
          const res = await axios.post("http://localhost:456/short_feed", {
            image: `data:image/jpeg;base64,${data.img}`,
            exercise: data.exercise,
            tts: { voiceName: "ko-KR-Standard-A", speakingRate: 1.0, pitch: 0.0, audioEncoding: "MP3" }
          });
          if (res?.data?.audioContent) {
            const audio = new Audio(`data:${res.data.mimeType};base64,${res.data.audioContent}`);
            audio.play().catch(err => console.warn('audio play blocked:', err));
          }
        } catch (e) {
          console.warn('short_feed skipped:', e?.message || e);
        }
      })();
    });

    // report: 캡처 이미지 / 자세 결과 저장
    socket.on("report", (data) => {
      (async () => {
        try {
          await axios.post("http://localhost:456/report", {
            image: `data:image/jpeg;base64,${data?.[1]?.img ?? data?.[1] ?? ""}`,
            exercise: data?.[1]?.exercise ?? currentExercise?.exerciseName ?? ""
          }).catch(() => { /* ignore */ });
        } catch { /* ignore */ }

        const poseType  = data?.[0] || "";
        const base64Img = `data:image/jpeg;base64,${data?.[1]?.img || data?.[1] || ""}`;
        const normalized = String(poseType).toLowerCase();
        const isGood = normalized.includes('good') || normalized.includes('best');

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

    // 3) 100ms마다 프레임 캡처 → 서버로 전송
    const sendImage = setInterval(() => {
      if (!isStarted) return;

      const videoEl = webcamRef.current?.video;
      const canvas = canvasRef.current;
      if (!videoEl || !canvas || !videoEl.videoWidth || !videoEl.videoHeight) return;

      const ctx = canvas.getContext("2d");
      canvas.width = videoEl.videoWidth;
      canvas.height = videoEl.videoHeight;
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/jpeg");
      if (!imageData) return;

      const payload = {
        image: imageData,
        exerciseName: (currentExercise?.exerciseName || "unknown").toLowerCase(),
        view: {
          knee: viewKneeRef.current,
          leg_hip_angle: viewLegHipRef.current,
          center_of_gravity: viewShoulderRef.current,
          upper_body_slope: viewUpperRef.current,
        },
      };

      try {
        socket.emit("analyze", payload);
      } catch (e) {
        console.warn('emit analyze failed:', e?.message || e);
      }
    }, 100);

    // 정리
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

  // 시작/정지에 따른 (선택) 가이드 영상 재생/정지
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isStarted) v.play().catch(() => {});
    else v.pause();
  }, [isStarted]);

  // (선택) 줌아웃 적용
  const handleUserMedia = () => {
    const stream = webcamRef.current?.video?.srcObject;
    if (stream) {
      const [track] = stream.getVideoTracks();
      const capabilities = track.getCapabilities?.();
      if (capabilities?.zoom) {
        track.applyConstraints({ advanced: [{ zoom: capabilities.zoom.min }] })
          .then(() => console.log('✅ 줌아웃 적용 완료'))
          .catch((err) => console.error('❌ 줌 설정 실패:', err));
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
      {/* 서버에서 그린 프레임 */}
      {imgSrc ? <img src={imgSrc} alt="분석된 이미지" /> : null}

      {/* 실시간 웹캠 (화면에는 숨김) */}
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        onUserMedia={handleUserMedia}
        style={{ visibility: 'hidden', position: 'absolute' }}
      />

      {/* 분석용 캔버스 (숨김) */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* (선택) 가이드 영상: currentExercise 매핑 시 재생, 끝나면 onVideoEnd 호출 */}
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
    </div>
  );
}

export default TrainingCam;
