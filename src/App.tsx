import React, { useState } from 'react';
import Room from './components/Room';

const App: React.FC = () => {
  const [roomName, setRoomName] = useState<string>('');
  const [inRoom, setInRoom] = useState<boolean>(false);

  const handleJoinRoom = () => {
    if (roomName.trim()) {
      setInRoom(true);
    } else {
      setRoomName('ahmed');
      setInRoom(true);
    }
  };

  if (inRoom) {
    return <Room roomName={roomName} />;
  }

  return (
    <div className="app">
      <h1>WebRTC Group Calling App</h1>
      <input
        type="text"
        placeholder="Enter room name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button onClick={handleJoinRoom}>Join Room</button>
    </div>
  );
};

export default App;
