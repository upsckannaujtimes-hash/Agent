import React from 'react';
import { ConnectionState } from '../types';

interface ControlsProps {
  connectionState: ConnectionState;
  onConnect: () => void;
  onDisconnect: () => void;
  hasVideoPermissions: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ 
  connectionState, 
  onConnect, 
  onDisconnect,
  hasVideoPermissions
}) => {
  const isConnected = connectionState === ConnectionState.CONNECTED;
  const isConnecting = connectionState === ConnectionState.CONNECTING;

  return (
    <div className="flex items-center gap-4 bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-700">
      
      {connectionState === ConnectionState.DISCONNECTED || connectionState === ConnectionState.ERROR ? (
        <button
          onClick={onConnect}
          disabled={!hasVideoPermissions}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white shadow-lg transition-all
            ${hasVideoPermissions 
                ? 'bg-blue-600 hover:bg-blue-500 hover:scale-105' 
                : 'bg-slate-600 cursor-not-allowed opacity-50'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Start Video Call</span>
        </button>
      ) : (
        <button
          onClick={onDisconnect}
          disabled={isConnecting}
          className="flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg transition-all hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>{isConnecting ? 'Connecting...' : 'End Call'}</span>
        </button>
      )}
    </div>
  );
};