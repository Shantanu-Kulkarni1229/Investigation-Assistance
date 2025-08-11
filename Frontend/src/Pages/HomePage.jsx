import React, { useState, useRef, useEffect } from "react";
import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";

const Homepage = () => {
  // Voice recognition states
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTextPanel, setShowTextPanel] = useState(false);
  const recognitionRef = useRef(null);

  // Transliteration states
  const [typingText, setTypingText] = useState("");
  const [showTypingPanel, setShowTypingPanel] = useState(false);

  const initializeRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "mr-IN"; // Marathi
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setIsProcessing(true);
      setShowTextPanel(true);
    };

    recognitionRef.current.onresult = (event) => {
      setIsProcessing(false);
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setText(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      setIsProcessing(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      setIsProcessing(false);
    };
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      initializeRecognition();
      recognitionRef.current.start();
    }
  };

  const clearVoiceText = () => {
    setText("");
    setShowTextPanel(false);
  };

  const sendVoiceText = () => {
    console.log("Sending voice text:", text);
    setText("");
    setShowTextPanel(false);
  };

  const toggleTypingPanel = () => {
    setShowTypingPanel(!showTypingPanel);
    if (showTextPanel) {
      setShowTextPanel(false);
    }
  };

  const clearTypingText = () => {
    setTypingText("");
    setShowTypingPanel(false);
  };

  const sendTypingText = () => {
    console.log("Sending typing text:", typingText);
    setTypingText("");
    setShowTypingPanel(false);
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}>
      {/* Chatbot iframe */}
      <iframe
        src="https://cdn.botpress.cloud/webchat/v3.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/08/06/18/20250806183435-8IZ9LGKM.json"
        frameBorder="0"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="Chatbot"
      />

      {/* Voice input interface */}
      {(showTextPanel || text) && (
        <div
          style={{
            position: "fixed",
            bottom: "220px",
            right: "30px",
            backgroundColor: "#fff",
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            padding: "20px",
            width: "280px",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            animation: "fadeIn 0.3s ease-out",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4 style={{ margin: 0, color: "#333", fontWeight: 500 }}>
              Marathi Voice Input
            </h4>
            <button
              onClick={clearVoiceText}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#666",
                fontSize: "20px",
                padding: "5px",
              }}
              title="Clear text"
            >
              ×
            </button>
          </div>
          
          <div
            style={{
              minHeight: "60px",
              maxHeight: "150px",
              overflowY: "auto",
              padding: "12px",
              backgroundColor: "#f8f8f8",
              borderRadius: "12px",
              color: "#333",
              border: isProcessing ? "1px dashed #4285f4" : "1px solid #eee",
            }}
          >
            {text || (isProcessing ? "Processing speech..." : "Speak now...")}
          </div>
          
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <button
              onClick={toggleListening}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                background: isListening ? "#ff4444" : "#4285f4",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {isListening ? "Stop" : "Speak"}
            </button>
            
            {text && (
              <button
                onClick={sendVoiceText}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  background: "#34a853",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Send
              </button>
            )}
          </div>
        </div>
      )}

      {/* Transliteration typing interface */}
      {showTypingPanel && (
        <div
          style={{
            position: "fixed",
            bottom: "220px",
            right: "30px",
            backgroundColor: "#fff",
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            padding: "20px",
            width: "280px",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            animation: "fadeIn 0.3s ease-out",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4 style={{ margin: 0, color: "#333", fontWeight: 500 }}>
              Marathi Typing
            </h4>
            <button
              onClick={clearTypingText}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#666",
                fontSize: "20px",
                padding: "5px",
              }}
              title="Clear text"
            >
              ×
            </button>
          </div>
          
          <ReactTransliterate
            value={typingText}
            onChangeText={(text) => setTypingText(text)}
            lang="mr"
            placeholder="Type in Marathi..."
            style={{
              minHeight: "60px",
              padding: "12px",
              backgroundColor: "#f8f8f8",
              borderRadius: "12px",
              color: "#333",
              border: "1px solid #eee",
              width: "100%",
              fontFamily: "inherit",
              fontSize: "inherit",
            }}
          />
          
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <button
              onClick={clearTypingText}
              style={{
                padding: "10px 15px",
                borderRadius: "8px",
                background: "#f1f1f1",
                color: "#333",
                border: "none",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Clear
            </button>
            <button
              onClick={sendTypingText}
              style={{
                padding: "10px 15px",
                borderRadius: "8px",
                background: "#34a853",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating action buttons */}
      <div
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          alignItems: "flex-end",
        }}
      >
        {/* Voice button */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <button
            onClick={toggleListening}
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: isListening ? "#ff4444" : "#4285f4",
              border: "none",
              color: "white",
              fontSize: "28px",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "all 0.2s ease",
              transform: isListening ? "scale(1.1)" : "scale(1)",
            }}
            title={isListening ? "Stop listening" : "Start speaking"}
          >
            {isListening ? (
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "2px",
                  backgroundColor: "white",
                }}
              />
            ) : (
              <div style={{ position: "relative" }}>
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z"
                    fill="white"
                  />
                  <path
                    d="M5 10V12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12V10M12 19V23M8 23H16"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {isProcessing && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      width: "12px",
                      height: "12px",
                      backgroundColor: "#ffcc00",
                      borderRadius: "50%",
                      border: "2px solid #4285f4",
                    }}
                  />
                )}
              </div>
            )}
          </button>
          <span style={{ color: "white", textShadow: "0 1px 3px rgba(0,0,0,0.5)", fontSize: "14px" }}>
            Marathi Voice
          </span>
        </div>

        {/* Typing button */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <button
            onClick={toggleTypingPanel}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: showTypingPanel ? "#34a853" : "#fbbc05",
              border: "none",
              color: "white",
              fontSize: "24px",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "all 0.2s ease",
            }}
            title="Marathi Typing"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 7V17H20V7H4ZM4 5H20C21.1 5 22 5.9 22 7V17C22 18.1 21.1 19 20 19H4C2.9 19 2 18.1 2 17V7C2 5.9 2.9 5 4 5Z"
                fill="white"
              />
              <path
                d="M8 9H16V11H8V9ZM8 13H14V15H8V13Z"
                fill="white"
              />
            </svg>
          </button>
          <span style={{ color: "white", textShadow: "0 1px 3px rgba(0,0,0,0.5)", fontSize: "14px" }}>
            Marathi Typing
          </span>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Homepage;