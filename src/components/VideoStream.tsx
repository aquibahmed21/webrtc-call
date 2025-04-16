import React, { useRef, useEffect } from 'react';

interface VideoStreamProps {
  stream: MediaStream;
}

const VideoStream: React.FC<VideoStreamProps> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return <video ref={videoRef} autoPlay playsInline />;
};

export default VideoStream;
