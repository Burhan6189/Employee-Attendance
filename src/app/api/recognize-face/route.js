'use client';
import { useState } from 'react';

export default function Attendance() {
  const [uploadMessage, setUploadMessage] = useState('');
  const [recognitionMessage, setRecognitionMessage] = useState('');

  // ✅ Handle Employee Image Upload
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const name = prompt('Enter employee name:'); // Ask for employee name
    if (!name) return alert('Employee name is required!');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', file);

    const response = await fetch('/api/add-employee', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setUploadMessage(data.message);
  };

  // ✅ Handle Face Recognition
  const handleRecognition = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/recognize-face', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setRecognitionMessage(data.message);
  };

  return (
    <div className="container">
      <h1>Employee Attendance System</h1>

      {/* ✅ Employee Image Upload */}
      <div>
        <h2>Upload Employee Image</h2>
        <input type="file" onChange={handleUpload} />
        {uploadMessage && <p>{uploadMessage}</p>}
      </div>

      {/* ✅ Face Recognition */}
      <div>
        <h2>Recognize Face for Attendance</h2>
        <input type="file" onChange={handleRecognition} />
        {recognitionMessage && <p>{recognitionMessage}</p>}
      </div>
    </div>
  );
}
