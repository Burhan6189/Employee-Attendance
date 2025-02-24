'use client';

import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

export default function Attendance() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [recognitionMessage, setRecognitionMessage] = useState('');
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

  // ✅ Capture Face & Mark Attendance
  const handleMarkAttendance = async () => {
    if (!isModelLoaded) return alert('Models are still loading...');

    const detections = await faceapi.detectSingleFace(
      videoRef.current,
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks().withFaceDescriptor();

    if (!detections) {
      setRecognitionMessage('❌ No face detected.');
      return;
    }

    console.log('📤 Sending face descriptor:', detections.descriptor);

    try {
      const response = await fetch('/api/mark-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faceDescriptor:Object.values(detections.descriptor) })
      });

      const data = await response.json();
      console.log('📩 API Response:', data);
      setRecognitionMessage(data.message);
    } catch (error) {
      console.error('❌ Error sending request:', error);
      setRecognitionMessage('❌ Error connecting to server.');
    }
  };

  return (
    <div className="container">
      <h1>Employee Attendance System</h1>

      {/* ✅ Start Webcam */}
      <button onClick={startVideo}>Start Webcam</button>
      <video ref={videoRef} autoPlay muted width="500" height="400" />

      {/* ✅ Detect & Mark Attendance */}
      <button onClick={handleMarkAttendance} disabled={!isModelLoaded}>
        Mark Attendance
      </button>
      {recognitionMessage && <p>{recognitionMessage}</p>}
    </div>
  );
}
