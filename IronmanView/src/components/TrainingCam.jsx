import React, { useEffect, useRef } from 'react'
import Webcam from "react-webcam";

function TrainingCam() {
  const ws = useRef<WebSocket | null> (null)
  useEffect(()=>{
    ws.current = new WebSocket("localhost:525/analyze")
    ws.current.onopen = () => {
      console.log('WebSocket connection opened.')
      setIsLoading(false);
    }
    ws.current.onmessage = (event) => {
      if (event.data) {
        const base64ImageData = 'data:image/jpg;base64,' + event.data;
        setCctvData(base64ImageData);
      }
    };
    ws.current.onerror = () => console.log('WebSocket Error');
    ws.current.onclose = () => {
      console.log('Websocket connection is closed');
    };

    return () => {
      if (ws.current && ws.current.readyState === 1) {
        ws.current.close();
      }
    };
  },[]);
  const WebcamComponent = () => <Webcam />;
  return (
    
    <div>
      <Webcam/>
    </div>
  )
}

export default TrainingCam