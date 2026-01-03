export interface StreamConfig {
  sampleRate: number;
}

export interface AudioVisualizerState {
  volume: number;
}

export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
}

export interface MessageLog {
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
}