import React, { useState, useEffect, useRef } from "react";

const VoiceChat = () => {
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
      const res = await fetch(`"http://localhost:8000"/chat`, {
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
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem", textAlign: "center" }}>
      <h2>Voice Chatbot</h2>
      <button onClick={startRecording} disabled={isRecording} style={{ padding: "0.5rem 1rem", margin: "1rem" }}>
        {isRecording ? "Recording..." : "Start Recording"}
      </button>
      {response && (
        <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#f0f0f0", borderRadius: "8px" }}>
          <strong>Response:</strong> {response}
        </div>
      )}
    </div>
  );
};

export default VoiceChat;
// import React, { useState, useEffect, useRef } from "react";

// const VoiceChat = () => {
//   const [response, setResponse] = useState("");
//   const [isRecording, setIsRecording] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const recognition = useRef(null);

//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (SpeechRecognition) {
//       recognition.current = new SpeechRecognition();
//       recognition.current.continuous = false;
//       recognition.current.interimResults = false;
//       recognition.current.lang = "en-US";

//       recognition.current.onresult = async (event) => {
//         const transcript = event.results[0][0].transcript;
//         setIsProcessing(true);
//         try {
//           const response = await processMessage(transcript);
//           setResponse(response);
//           speakResponse(response);
//         } catch (error) {
//           console.error("Error:", error);
//           setResponse("Sorry, I encountered an error. Please try again.");
//         }
//         setIsProcessing(false);
//       };

//       recognition.current.onerror = (event) => {
//         console.error("Speech recognition error:", event.error);
//         setIsProcessing(false);
//       };

//       recognition.current.onend = () => {
//         setIsRecording(false);
//       };
//     }
//   }, []);

//   const processMessage = async (message) => {
//     const res = await fetch("http://localhost:8000/chat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ message }),
//     });
//     const data = await res.json();
//     return data.response;
//   };

//   const speakResponse = (text) => {
//     if ("speechSynthesis" in window) {
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.rate = 1.1;
//       utterance.pitch = 0.8;
//       window.speechSynthesis.speak(utterance);
//     }
//   };

//   const toggleRecording = () => {
//     if (!isRecording) {
//       setIsRecording(true);
//       recognition.current.start();
//     }
//   };

//   return (
//     <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem", textAlign: "center" }}>
//       <h2>Voice Assistant</h2>
//       <button
//         onClick={toggleRecording}
//         disabled={isRecording || isProcessing}
//         style={{
//           padding: "1.5rem",
//           borderRadius: "50%",
//           background: isRecording ? "#ff4444" : "#4CAF50",
//           border: "none",
//           cursor: "pointer",
//           fontSize: "1.2rem"
//         }}
//       >
//         {isProcessing ? "⏳ Processing..." : isRecording ? "🎤 Listening..." : "🎤 Start Speaking"}
//       </button>
      
//       {response && (
//         <div style={{
//           marginTop: "2rem",
//           padding: "1.5rem",
//           backgroundColor: "#f8f9fa",
//           borderRadius: "15px",
//           boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
//         }}>
//           <strong style={{ color: "#2c3e50" }}>Response:</strong>
//           <p style={{ marginTop: "0.5rem", lineHeight: "1.6" }}>{response}</p>
//         </div>
//       )}

//       {!recognition.current && (
//         <p style={{ color: "#e74c3c", marginTop: "1rem" }}>
//           Warning: Speech recognition is not supported in your browser.
//         </p>
//       )}
//     </div>
//   );
// };

// export default VoiceChat;