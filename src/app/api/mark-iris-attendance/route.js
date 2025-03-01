import * as tf from "@tensorflow/tfjs";
import mongoose from "mongoose";
import cv from "@techstark/opencv-js";
import IrisEmployeeModel from "@/app/models/IrisEmployee";

export async function POST(req) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const { eyeImage } = await req.json();

    if (!eyeImage) {
      return Response.json({ message: "❌ No eye image received." }, { status: 400 });
    }

    // Convert base64 image to OpenCV Mat
    const img = cv.imread(eyeImage);
    const gray = new cv.Mat();
    cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY);

    // Load Haar cascade for eye detection
    const eyeCascade = new cv.CascadeClassifier();
    eyeCascade.load("haarcascade_eye.xml");

    // Detect eyes in the image
    const eyes = new cv.RectVector();
    eyeCascade.detectMultiScale(gray, eyes, 1.1, 10);

    if (eyes.size() === 0) {
      return Response.json({ message: "❌ No eyes detected." }, { status: 404 });
    }

    let bestMatch = null;
    let minDistance = 0.5;

    const employees = await IrisEmployeeModel.find();
    for (const employee of employees) {
      const distance = tf.losses.cosineDistance(
        tf.tensor(employee.irisDescriptor),
        tf.tensor(gray.data),
        0
      );

      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = employee;
      }
    }

    if (!bestMatch) {
      return Response.json({ message: "❌ Employee Not Found!" }, { status: 404 });
    }

    bestMatch.attendance = true; 
    await bestMatch.save();

    return Response.json({ message: `✅ ${bestMatch.name} marked as present!` });
  } catch (error) {
    return Response.json({ message: "❌ Server Error" }, { status: 500 });
  }
}
