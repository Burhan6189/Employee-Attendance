"use client";
import { useState } from "react";
import EyeCapture from "../components/EyeCapture";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [irisDescriptor, setIrisDescriptor] = useState(null);
  const [message, setMessage] = useState("");

  const handleCapture = async (imageData) => {
    setIrisDescriptor(imageData);
  };

  const handleSubmit = async () => {
    if (!name || !email || !irisDescriptor) {
      setMessage("❌ Please complete all fields.");
      return;
    }

    const res = await fetch("/api/irisemployees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, irisDescriptor }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div>
      <h1>📋 Employee Registration</h1>
      <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <EyeCapture onCapture={handleCapture} />
      <button onClick={handleSubmit}>Register</button>
      {message && <p>{message}</p>}
    </div>
  );
}
