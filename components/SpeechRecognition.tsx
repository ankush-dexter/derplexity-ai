"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface SpeechRecognitionProps {
  onTextCapture: (text: string) => void;
}

const SpeechRecognition = ({ onTextCapture }: SpeechRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  
  useEffect(() => {

    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      // @ts-ignore - TypeScript doesn't know about webkitSpeechRecognition
      const recognitionInstance = new webkitSpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcriptText = result[0].transcript;
        setTranscript(transcriptText);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
    
    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, []);
  
  const toggleListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    
    if (!isListening) {
      setIsOpen(true);
      setTranscript("");
      recognition.start();
      setIsListening(true);
    } else {
      recognition.stop();
      setIsListening(false);
      if (transcript) {
        onTextCapture(transcript);
      }
      setIsOpen(false);
    }
  };
  
  const handleClose = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    }
    if (transcript) {
      onTextCapture(transcript);
    }
    setIsOpen(false);
  };
  
  return (
    <>
      <Button 
        variant="ghost" 
        onClick={toggleListening}
        className="relative"
        aria-label="Voice search"
      >
        <Mic className={`h-5 w-5 ${isListening ? 'text-primary' : 'text-gray-400'}`} />
        {isListening && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        )}
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Voice Search</DialogTitle>
            <DialogDescription>
              Speak your query clearly...
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center gap-4 py-4">
            {isListening ? (
              <>
                <div className="relative w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full animate-ping bg-primary/40 opacity-75"></div>
                  <Mic className="h-12 w-12 text-primary animate-pulse" />
                </div>
                <p className="text-center text-sm mt-2">Listening...</p>
              </>
            ) : (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            )}
            
            {transcript && (
              <div className="mt-4 p-3 bg-secondary/20 rounded-md w-full max-h-32 overflow-y-auto">
                <p className="text-sm">{transcript}</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => {
              setTranscript("");
              setIsOpen(false);
              if (isListening) {
                recognition.stop();
                setIsListening(false);
              }
            }}>
              Cancel
            </Button>
            <Button onClick={handleClose} disabled={!transcript}>
              Use This Text
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SpeechRecognition;