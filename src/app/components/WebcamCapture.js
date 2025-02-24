import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import axios from 'axios';

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    };
    loadModels();
  }, []);

  const captureImage = async () => {
    if (!webcamRef.current) return;
    setLoading(true);
    setMessage('');

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setMessage('Failed to capture image.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/recognize', { image: imageSrc });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error recognizing face.');
    }

    setLoading(false);
  };

  return (
    <div>
      <Webcam ref={webcamRef} screenshotFormat="image/png" />
      <button onClick={captureImage} disabled={loading}>
        {loading ? 'Processing...' : 'Capture & Recognize'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default WebcamCapture;
