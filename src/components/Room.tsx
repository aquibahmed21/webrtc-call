import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import VideoStream from './VideoStream';
import Controls from './Controls';
import useWebRTC from '../hooks/useWebRTC';

const socket: Socket = io('http://localhost:5000');

interface RoomProps {
  roomName: string;
}

const Room: React.FC<RoomProps> = ({ roomName }) => {
  const { localStream, remoteStreams, toggleMicrophone, toggleCamera, toggleCameraQuality } = useWebRTC(roomName, socket);

  useEffect(() => {
    socket.emit('join-room', roomName);

    return () => {
      socket.emit('leave-room', roomName);
    };
  }, [roomName]);

  return (
    <div className="room">
      <h2>Room: {roomName}</h2>
      <div className="video-grid">
        {localStream && <VideoStream stream={localStream} />}
        {remoteStreams.map((stream, index) => (
          <VideoStream key={index} stream={stream} />
        ))}
      </div>
      <Controls
        toggleMicrophone={toggleMicrophone}
        toggleCamera={toggleCamera}
        toggleCameraQuality={toggleCameraQuality}
      />
    </div>
  );
};

export default Room;
