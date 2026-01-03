import React, { useEffect, useRef, useState } from 'react';
import { useGeminiLive } from './hooks/useGeminiLive';
import { Visualizer } from './components/Visualizer';
import { Controls } from './components/Controls';
import { ConnectionState } from './types';

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const { connect, disconnect, connectionState, volume } = useGeminiLive();

  // Initialize local video stream on mount
  useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 }, 
            height: { ideal: 480 },
            facingMode: 'user'
          },
          audio: false // Audio is handled by the hook
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        setPermissionError("Please allow camera access to use the video agent.");
      }
    };

    initCamera();

    return () => {
      // Cleanup stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleConnect = () => {
    if (videoRef.current) {
      connect(videoRef.current);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[100px]"></div>
      </div>

      <header className="absolute top-6 left-0 w-full text-center z-10">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Gemini Live Video Agent
        </h1>
        <p className="text-slate-400 text-sm mt-1">Real-time Multimodal Interaction</p>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex flex-col items-center justify-center gap-8 w-full max-w-4xl">
        
        {/* Permission Error Banner */}
        {permissionError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg">
            {permissionError}
          </div>
        )}

        {/* Central Visualization (The "AI") */}
        <div className="relative">
             <Visualizer 
                volume={volume} 
                active={connectionState === ConnectionState.CONNECTED} 
             />
             <div className="absolute -bottom-8 left-0 w-full text-center">
                 <span className={`text-sm font-medium transition-colors duration-300 ${connectionState === ConnectionState.CONNECTED ? 'text-blue-400' : 'text-slate-600'}`}>
                    {connectionState === ConnectionState.CONNECTED ? 'Listening & Watching' : connectionState === ConnectionState.CONNECTING ? 'Establishing Uplink...' : 'Ready to Connect'}
                 </span>
             </div>
        </div>

      </main>

      {/* User Video Feed (PIP Style) */}
      <div className="fixed bottom-24 right-6 w-32 md:w-48 aspect-[3/4] bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-slate-800 z-20 group transition-all hover:scale-105">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
        />
        <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white backdrop-blur-sm">
          YOU
        </div>
      </div>

      {/* Control Bar */}
      <div className="fixed bottom-8 z-30">
        <Controls 
          connectionState={connectionState}
          onConnect={handleConnect}
          onDisconnect={disconnect}
          hasVideoPermissions={!!stream}
        />
      </div>

    </div>
  );
}