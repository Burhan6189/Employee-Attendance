'use client';

import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

export default function AddEmployee() {
  const [name, setName] = useState('');
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [message, setMessage] = useState('');
  const videoRef = useRef(null);

  // ✅ Load FaceAPI models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        setIsModelLoaded(true);
        console.log('✅ Models loaded successfully!');
      } catch (error) {
        console.error('❌ Error loading models:', error);
      }
    };

    loadModels();
  }, []);

  // ✅ Start Webcam
  const startVideo = async () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error('❌ Error accessing webcam:', err));
  };

  // ✅ Capture Face and Save Employee
  const handleAddEmployee = async () => {
    if (!isModelLoaded) return alert('Models are still loading...');
    if (!name) return alert('Please enter employee name.');

    // Detect face
    const detections = await faceapi.detectSingleFace(
      videoRef.current,
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks().withFaceDescriptor();

    if (!detections) {
      setMessage('❌ No face detected.');
      return;
    }

    // Send employee data to backend
    const response = await fetch('/api/add-employee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, faceDescriptor: detections.descriptor })
    });

    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div className="container">
      <h1>Add Employee</h1>

      {/* ✅ Input Employee Name */}
      <input 
        type="text" 
        placeholder="Enter Employee Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />

      {/* ✅ Start Webcam */}
      <button onClick={startVideo}>Start Webcam</button>
      <video ref={videoRef} autoPlay muted width="500" height="400" />

      {/* ✅ Capture & Save Face */}
      <button onClick={handleAddEmployee} disabled={!isModelLoaded}>
        Add Employee
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}
