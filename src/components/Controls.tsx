import React from 'react';

interface ControlsProps {
  toggleMicrophone: () => void;
  toggleCamera: () => void;
  toggleCameraQuality: () => void;
}

const Controls: React.FC<ControlsProps> = ({ toggleMicrophone, toggleCamera, toggleCameraQuality }) => {
  return (
    <div className="controls">
      <button onClick={toggleMicrophone}>Mute/Unmute</button>
      <button onClick={toggleCamera}>Toggle Camera</button>
      <button onClick={toggleCameraQuality}>Toggle Camera Quality</button>
    </div>
  );
};

export default Controls;
