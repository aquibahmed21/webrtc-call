import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

const useWebRTC = (roomName: string, socket: Socket) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  const [isMicrophoneMuted, setIsMicrophoneMuted] = useState<boolean>(false);
  const [isCameraOff, setIsCameraOff] = useState<boolean>(false);
  const [cameraQuality, setCameraQuality] = useState<string>('high');

  useEffect(() => {
    const initWebRTC = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);

        socket.on('new-peer', async (peerId: string) => {
          const peerConnection = new RTCPeerConnection();
          stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

          peerConnection.ontrack = (event) => {
            setRemoteStreams(prevStreams => [...prevStreams, event.streams[0]]);
          };

          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          socket.emit('offer', { offer, peerId, roomName });

          socket.on('answer', async (data: any) => {
            if (data.peerId === peerId) {
              await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            }
          });

          socket.on('candidate', async (data: any) => {
            if (data.peerId === peerId) {
              await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
          });
        });

        socket.on('offer', async (data: any) => {
          const peerConnection = new RTCPeerConnection();
          stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

          peerConnection.ontrack = (event) => {
            setRemoteStreams(prevStreams => [...prevStreams, event.streams[0]]);
          };

          await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socket.emit('answer', { answer, peerId: data.peerId, roomName });

          peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
              socket.emit('candidate', { candidate: event.candidate, peerId: data.peerId, roomName });
            }
          };
        });
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    initWebRTC();
  }, [roomName, socket]);

  const toggleMicrophone = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
      setIsMicrophoneMuted(!isMicrophoneMuted);
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
      setIsCameraOff(!isCameraOff);
    }
  };

  const toggleCameraQuality = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities();
      let newQuality: string;

      switch (cameraQuality) {
        case 'high':
          newQuality = 'medium';
          videoTrack.applyConstraints({ width: { ideal: 640 }, height: { ideal: 480 } });
          break;
        case 'medium':
          newQuality = 'low';
          videoTrack.applyConstraints({ width: { ideal: 320 }, height: { ideal: 240 } });
          break;
        case 'low':
          newQuality = 'high';
          videoTrack.applyConstraints({ width: { ideal: 1280 }, height: { ideal: 720 } });
          break;
        default:
          newQuality = 'high';
      }

      setCameraQuality(newQuality);
    }
  };

  return {
    localStream,
    remoteStreams,
    toggleMicrophone,
    toggleCamera,
    toggleCameraQuality,
  };
};

export default useWebRTC;
