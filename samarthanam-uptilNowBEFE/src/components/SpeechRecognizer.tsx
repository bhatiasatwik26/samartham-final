import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic } from "lucide-react"; // Import mic icon

const SpeechRecognizer = () => {
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState<string>("");

  // Function to start speech recognition
  const startSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcriptText = event.results[0][0].transcript.toLowerCase();
      console.log("🗣️ Recognized Speech:", transcriptText);
      setTranscript(transcriptText);

      // Hide transcript after 5 seconds
      setTimeout(() => setTranscript(""), 5000);

      // Navigation commands
      if (transcriptText.includes("home")) {
        navigate("/");
      } else if (transcriptText.includes("events")) {
        navigate("/events");
      } else if (transcriptText.includes("about")) {
        navigate("/about");
      } else if (transcriptText.includes("help")) {
        navigate("/help");
      } else if (transcriptText.includes("contact")) {
        navigate("/contact");
      } else if (transcriptText.includes("sign in")) {
        navigate("/signin");
      } else if (transcriptText.includes("volunteer dashboard")) {
        navigate("/volunteer-dashboard");
      } else {
        console.log("Command not recognized.");
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };

  // Global keyboard shortcut: Press "S" to activate

  return (
    <>
      {/* Floating Compact Microphone Button */}
      <button
        onClick={startSpeechRecognition}
        className="fixed bottom-5 right-5 bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
      >
        <Mic size={20} />
      </button>

      {/* Display Recognized Transcript for 5 seconds */}
      {transcript && (
        <div className="fixed bottom-16 right-5 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg transition-opacity">
          <p>🗣️ {transcript}</p>
        </div>
      )}
    </>
  );
};

export default SpeechRecognizer;
