"use client";
import React, { useState } from "react";
import EyeScanner from "../components/EyeCapture";
import * as faceapi from "face-api.js";

const AttendancePage = () => {
  const [message, setMessage] = useState("");

  const processImage = async (imageData) => {
    const img = new Image();
    img.src = imageData;

    img.onload = async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");

      const detections = await faceapi.detectSingleFace(canvas).withFaceLandmarks();
      if (!detections) {
        setMessage("❌ No eye detected.");
        return;
      }

      const eyeDescriptor = detections.landmarks.getLeftEye(); // Extract eye features

      const response = await fetch("/api/mark-iris-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eyeDescriptor }),
      });

      const data = await response.json();
      setMessage(data.message);
    };
  };

  return (
    <div>
      <h1>Eye Scanner Attendance</h1>
      <EyeScanner onCapture={processImage} />
      <p>{message}</p>
    </div>
  );
};

export default AttendancePage;
