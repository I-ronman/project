import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
  const idRef = useRef();
  const pwRef = useRef();

  return(
    <div>
      
    <input type="text" id = "id" ref={idRef}/>
    <input type="text" id = "pw" ref={pwRef}/>
    <button onClick={()=>{
      const id = idRef.current.value;
      const pw = pwRef.current.value;
      axios.post("http://localhost:329/web/login",{ // post 방식으로 해당 url에 요청
        id : id,
        pw : pw
      }, {headers: {
    "Content-Type": "application/json"
  }})
      
    }}></button>

    </div>
  

  )
}

export default App
