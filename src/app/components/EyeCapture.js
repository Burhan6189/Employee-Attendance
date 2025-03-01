import { useEffect, useRef, useState } from "react";

export default function EyeCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    async function startCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    }
    startCamera();
  }, []);

  const captureEye = () => {
    setIsCapturing(true);
    const ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, 300, 150);
    const imageData = canvasRef.current.toDataURL("image/png");
    onCapture(imageData);
    setIsCapturing(false);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay style={{ width: "300px" }}></video>
      <canvas ref={canvasRef} width="300" height="150" style={{ display: "none" }}></canvas>
      <button onClick={captureEye} disabled={isCapturing}>Capture Eye</button>
    </div>
  );
}
