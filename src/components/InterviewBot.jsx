import React, { useState, useEffect, useRef } from "react";

const InterviewBot = () => {
  const [response, setResponse] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const transcriptRef = useRef("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      recognitionRef.current = recognition;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        transcriptRef.current = transcript;
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      recognition.onend = () => {
        setIsRecording(false);
        if (transcriptRef.current.trim() !== "") {
          sendMessage(transcriptRef.current);
        }
      };
    } else {
      console.warn("SpeechRecognition API not supported in this browser.");
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startRecording = () => {
    if (recognitionRef.current) {
      setIsRecording(true);
      transcriptRef.current = "";
      recognitionRef.current.start();
    }
  };

  const sendMessage = async (message) => {
    if (!message.trim()) return;
    try {
      const res = await fetch("http://localhost:8001/chat", {  // adjust port if needed
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setResponse(data.response);
      speakResponse(data.response);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const speakResponse = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem", textAlign: "center" }}>
      <h2>Interview Bot</h2>
      <div style={{ marginBottom: "2rem" }}>
        {/* Replace this placeholder with your actual 3D model */}
        <div style={{ width: "100%", height: "400px", backgroundColor: "#ddd", borderRadius: "8px" }}>
          <p style={{ lineHeight: "400px", color: "#333" }}>3D Model Placeholder</p>
        </div>
      </div>
      <button onClick={startRecording} disabled={isRecording} style={{ padding: "0.5rem 1rem", margin: "1rem" }}>
        {isRecording ? "Recording..." : "Start Recording"}
      </button>
      {response && (
        <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#f0f0f0", borderRadius: "8px", color: "black" }}>
          <strong>Response:</strong> {response}
        </div>
      )}
    </div>
  );
};

export default InterviewBot;
