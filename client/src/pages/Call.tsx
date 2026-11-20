// import { useEffect, useRef, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import { useAuth } from "../context/AuthContext";

// const Call = () => {
//   const { user, token } = useAuth();

//   const socketRef = useRef<Socket | null>(null);
//   const peerRef = useRef<RTCPeerConnection | null>(null);
//   const streamRef = useRef<MediaStream | null>(null);

//   const localAudio = useRef<HTMLAudioElement>(null);
//   const remoteAudio = useRef<HTMLAudioElement>(null);

//   // ✅ NEW: auto scroll ref
//   const chatEndRef = useRef<HTMLDivElement | null>(null);

//   const [status, setStatus] =
//     useState<"idle" | "waiting" | "connected">("idle");

//   const [partnerName, setPartnerName] = useState("");
//   const [isMuted, setIsMuted] = useState(false);

//   const [messages, setMessages] = useState<any[]>([]);
//   const [text, setText] = useState("");

//   const [callPopup, setCallPopup] = useState<string | null>(null);
//   const [replyTo, setReplyTo] = useState<any | null>(null);

//   const canChat = status === "connected";

//   // ================= SOCKET =================
//   useEffect(() => {
//     const socket = io("http://localhost:5000", {
//       auth: { token },
//       transports: ["websocket"],
//     });

//     socketRef.current = socket;

//     socket.on("matched", async ({ partnerId, initiator, partnerName }) => {
//       setPartnerName(partnerName);
//       setStatus("connected");

//       setCallPopup(`Connected with ${partnerName}`);
//       setTimeout(() => setCallPopup(null), 2000);

//       await createPeer(socket, partnerId, initiator);
//     });

//     socket.on("offer", async ({ offer, from }) => {
//       if (!peerRef.current) {
//         await createPeer(socket, from, false);
//       }

//       await peerRef.current!.setRemoteDescription(offer);

//       const answer = await peerRef.current!.createAnswer();
//       await peerRef.current!.setLocalDescription(answer);

//       socket.emit("answer", { target: from, answer });
//     });

//     socket.on("answer", async ({ answer }) => {
//       await peerRef.current?.setRemoteDescription(answer);
//     });

//     socket.on("ice-candidate", async ({ candidate }) => {
//       if (candidate) {
//         await peerRef.current?.addIceCandidate(candidate);
//       }
//     });

//     socket.on("chat-message", (message) => {
//       setMessages((prev) => [...prev, { ...message, status: "seen" }]);
//     });

//     socket.on("call-ended", () => {
//       setCallPopup("Call ended");
//       setTimeout(() => setCallPopup(null), 2000);
//       forceEndCall();
//     });

//     socket.on("user-disconnected", () => {
//       setCallPopup("User disconnected");
//       setTimeout(() => setCallPopup(null), 2000);
//       forceEndCall();
//     });

//     return () => socket.disconnect();
//   }, []);

//   // ================= AUTO SCROLL =================
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // ================= PEER =================
//   const createPeer = async (
//     socket: Socket,
//     partner: string,
//     initiator: boolean
//   ) => {
//     const peer = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     peerRef.current = peer;

//     streamRef.current?.getTracks().forEach((track) => {
//       peer.addTrack(track, streamRef.current!);
//     });

//     peer.ontrack = (e) => {
//       const stream = e.streams[0];

//       if (remoteAudio.current) {
//         remoteAudio.current.srcObject = stream;

//         remoteAudio.current.onloadedmetadata = () => {
//           remoteAudio.current?.play().catch(() => {});
//         };
//       }
//     };

//     peer.onicecandidate = (e) => {
//       if (e.candidate) {
//         socket.emit("ice-candidate", {
//           target: partner,
//           candidate: e.candidate,
//         });
//       }
//     };

//     if (initiator) {
//       const offer = await peer.createOffer();
//       await peer.setLocalDescription(offer);
//       socket.emit("offer", { target: partner, offer });
//     }
//   };

//   // ================= START CALL =================
//   const startCall = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     streamRef.current = stream;

//     if (localAudio.current) {
//       localAudio.current.srcObject = stream;
//       localAudio.current.muted = true;
//       localAudio.current.play().catch(() => {});
//     }

//     socketRef.current?.emit("join-call");

//     setStatus("waiting");
//     setMessages([]);
//     setText("");
//     setReplyTo(null);
//   };

//   // ================= CHAT =================
//   const sendMessage = () => {
//     if (!text.trim() || !canChat) {
//       if (!canChat) {
//         setCallPopup("Start call to send message");
//         setTimeout(() => setCallPopup(null), 2000);
//       }
//       return;
//     }

//     const msg = {
//       senderId: user?.id,
//       senderName: user?.name,
//       text,
//       time: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//       replyTo: replyTo || null,
//       status: "sent",
//     };

//     socketRef.current?.emit("chat-message", { message: msg });
//     setMessages((prev) => [...prev, msg]);

//     setText("");
//     setReplyTo(null);
//   };

//   // ================= MUTE =================
//   const toggleMute = () => {
//     const track = streamRef.current?.getAudioTracks()[0];
//     if (!track) return;

//     track.enabled = !track.enabled;
//     setIsMuted(!track.enabled);
//   };

//   // ================= END CALL =================
//   const forceEndCall = () => {
//     peerRef.current?.close();
//     peerRef.current = null;

//     streamRef.current?.getTracks().forEach((t) => t.stop());
//     streamRef.current = null;

//     setStatus("idle");
//     setPartnerName("");
//     setMessages([]);
//     setText("");
//     setIsMuted(false);
//     setReplyTo(null);
//   };

//   const endCall = () => {
//     socketRef.current?.emit("end-call");
//     forceEndCall();
//   };

//   // ================= UI =================
//   return (
//     <div className="h-screen w-screen flex bg-black text-white fixed top-0 left-0">

//       {callPopup && (
//         <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-gray-800 px-4 py-2 rounded-lg text-sm z-50">
//           {callPopup}
//         </div>
//       )}

//       {/* LEFT */}
//       <div className="w-[70%] flex flex-col">

//         <div className="h-16 flex items-center justify-center border-b border-gray-800">
//           <div className="text-sm text-gray-300">
//             {status === "idle" && "Ready to connect"}
//             {status === "waiting" && "Searching partner..."}
//             {status === "connected" && `Connected with ${partnerName}`}
//           </div>
//         </div>

//         <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
//           <div className="text-6xl mb-2">👤</div>
//           <div>
//             {status === "connected"
//               ? `Talking with ${partnerName}`
//               : "No active call"}
//           </div>
//         </div>

//         <div className="h-24 flex items-center justify-center border-t border-gray-800">
//           <div className="flex gap-4">

//             {status === "idle" && (
//               <button
//                 onClick={startCall}
//                 className="px-6 py-3 bg-green-600 rounded-full"
//               >
//                 Start Call
//               </button>
//             )}

//             {status !== "idle" && (
//               <>
//                 <button
//                   onClick={toggleMute}
//                   className="px-5 py-3 bg-gray-700 rounded-full"
//                 >
//                   {isMuted ? "Unmute" : "Mute"}
//                 </button>

//                 <button
//                   onClick={endCall}
//                   className="px-5 py-3 bg-red-600 rounded-full"
//                 >
//                   End
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* RIGHT CHAT */}
//       <div className="w-[30%] flex flex-col border-l border-gray-800">

//         <div className="h-16 flex items-center px-4 border-b border-gray-800">
//           Chat
//         </div>

//         <div className="flex-1 overflow-y-auto p-3 space-y-3">

//           {messages.map((m, i) => {
//             const isMe = m.senderId === user?.id;

//             return (
//               <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
//                 <div className="max-w-[80%]">

//                   <div className="text-[11px] text-gray-300 mb-1">
//                     {isMe ? "You" : m.senderName}
//                   </div>

//                   {m.replyTo && (
//                     <div className="text-xs bg-black/40 border border-gray-700 p-2 rounded-t-lg text-gray-300">
//                       <div className="opacity-70">{m.replyTo.senderName}</div>
//                       <div className="truncate">{m.replyTo.text}</div>
//                     </div>
//                   )}

//                   <div className={`px-3 py-2 rounded-lg text-sm ${
//                     isMe ? "bg-green-700" : "bg-gray-800"
//                   }`}>
//                     <div>{m.text}</div>

//                     <div className="text-[10px] opacity-60 text-right mt-1">
//                       {m.time}
//                     </div>

//                     <button
//                       onClick={() => setReplyTo(m)}
//                       className="text-[10px] opacity-60 mt-1 hover:opacity-100"
//                     >
//                       Reply
//                     </button>
//                   </div>

//                 </div>
//               </div>
//             );
//           })}

//           {/* ✅ AUTO SCROLL TARGET */}
//           <div ref={chatEndRef} />

//         </div>

//         <div className="p-3 border-t border-gray-800">

//           {replyTo && (
//             <div className="mb-2 p-2 bg-gray-800 rounded-lg text-xs flex justify-between">
//               <div>
//                 <div className="text-gray-400">{replyTo.senderName}</div>
//                 <div className="truncate">{replyTo.text}</div>
//               </div>

//               <button onClick={() => setReplyTo(null)} className="text-red-400">
//                 ✕
//               </button>
//             </div>
//           )}

//           <div className="flex items-center gap-2">

//             <textarea
//               value={text}
//               disabled={!canChat}
//               onChange={(e) => setText(e.target.value)}
//               onKeyDown={(e) => {
//                 if (!canChat) return;

//                 if (e.key === "Enter" && !e.shiftKey) {
//                   e.preventDefault();
//                   sendMessage();
//                 }
//               }}
//               rows={2}
//               placeholder={canChat ? "Type message..." : "Chat locked"}
//               className={`flex-1 resize-none rounded-lg px-3 py-2 text-sm outline-none
//                 ${canChat ? "bg-gray-900" : "bg-gray-800 text-gray-500"}
//               `}
//             />

//             <button
//               onClick={sendMessage}
//               disabled={!canChat}
//               className={`w-10 h-10 flex items-center justify-center rounded-full
//                 ${canChat ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 cursor-not-allowed"}
//               `}
//             >
//               ➤
//             </button>

//           </div>
//         </div>
//       </div>

//       <audio ref={localAudio} autoPlay muted />
//       <audio ref={remoteAudio} autoPlay />
//     </div>
//   );
// };

// export default Call;

// working report and languge

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

const Call = () => {
  const { user, token } = useAuth();
  const location = useLocation();

  const language = location.state?.language || "English";
  const initialCallId = location.state?.callId || null;

  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const localAudio = useRef<HTMLAudioElement>(null);
  const remoteAudio = useRef<HTMLAudioElement>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [status, setStatus] =
    useState<"idle" | "waiting" | "connected">("idle");

  const [partnerName, setPartnerName] = useState("");
  const [isMuted, setIsMuted] = useState(false);

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  const [callPopup, setCallPopup] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<any | null>(null);

  const [callId, setCallId] = useState<string | null>(initialCallId);

  const canChat = status === "connected";

  // ================= SOCKET =================
  useEffect(() => {
    if (!token) return;

    // const socket = io("http://localhost:5000", {
    const socket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      withCredentials: true,
      transports: ["websocket", "polling"], // ✅ FIX
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("❌ Socket error:", err.message);
    });

    socket.on("matched", async ({ partnerId, initiator, partnerName }) => {
      setPartnerName(partnerName);
      setStatus("connected");

      setCallPopup(`Connected with ${partnerName}`);
      setTimeout(() => setCallPopup(null), 2000);

      if (callId) {
        await fetch(`${import.meta.env.VITE_API_URL}/api/call/update-receiver`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            callId,
            receiverId: partnerId,
          }),
        });
      }

      await createPeer(socket, partnerId, initiator);
    });

    socket.on("offer", async ({ offer, from }) => {
      if (!peerRef.current) {
        await createPeer(socket, from, false);
      }

      await peerRef.current!.setRemoteDescription(offer);

      const answer = await peerRef.current!.createAnswer();
      await peerRef.current!.setLocalDescription(answer);

      socket.emit("answer", { target: from, answer });
    });

    socket.on("answer", async ({ answer }) => {
      await peerRef.current?.setRemoteDescription(answer);
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      if (candidate) {
        await peerRef.current?.addIceCandidate(candidate);
      }
    });

    socket.on("chat-message", (message) => {
      setMessages((prev) => [...prev, { ...message, status: "seen" }]);
    });

    socket.on("call-ended", () => {
      setCallPopup("Call ended");
      setTimeout(() => setCallPopup(null), 2000);
      forceEndCall();
    });

    socket.on("user-disconnected", () => {
      setCallPopup("User disconnected");
      setTimeout(() => setCallPopup(null), 2000);
      forceEndCall();
    });

  //   return () => socket.disconnect();
  // }, [token]);


      return () => {
      socket.disconnect();
    };
  }, [token]);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= PEER =================
  const createPeer = async (
    socket: Socket,
    partner: string,
    initiator: boolean
  ) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerRef.current = peer;

    streamRef.current?.getTracks().forEach((track) => {
      peer.addTrack(track, streamRef.current!);
    });

    peer.ontrack = (e) => {
      const stream = e.streams[0];

      if (remoteAudio.current) {
        remoteAudio.current.srcObject = stream;
        remoteAudio.current.play().catch(() => {});
      }
    };

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          target: partner,
          candidate: e.candidate,
        });
      }
    };

    if (initiator) {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.emit("offer", { target: partner, offer });
    }
  };

  // ================= START CALL =================
  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      if (localAudio.current) {
        localAudio.current.srcObject = stream;
        localAudio.current.muted = true;
        await localAudio.current.play().catch(() => {});
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/call/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ language }),
      });

      const data = await res.json();

      if (!data.callId) {
        setCallPopup("Failed to start call");
        return;
      }

      setCallId(data.callId);

      socketRef.current?.emit("join-call", {
        callId: data.callId,
        language,
      });

      setStatus("waiting");
      setMessages([]);
      setText("");
      setReplyTo(null);
    } catch {
      setCallPopup("Microphone permission denied");
    }
  };

  // ================= CHAT =================
  const sendMessage = () => {
  if (!text.trim() || !canChat) return;

  const msg = {
    id: Date.now(), // ✅ unique id
    senderId: user?.id,
    senderName: user?.name,
    text,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    date: new Date().toLocaleDateString(), // ✅ date
    replyTo: replyTo || null,
  };

  socketRef.current?.emit("chat-message", msg); // ✅ FIX (no nested object)
  setMessages((prev) => [...prev, msg]);

  setText("");
  setReplyTo(null);
};

  // ================= MUTE =================
  const toggleMute = () => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (!track) return;

    track.enabled = !track.enabled;
    setIsMuted(!track.enabled);
  };

  // ================= END CALL =================
  const endCall = async () => {
    socketRef.current?.emit("end-call");

    if (callId) {
      await fetch(`${import.meta.env.VITE_API_URL}/api/call/end`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          callId,
          transcript: messages.map((m) => m.text).join(". "),
        }),
      });
    }

    forceEndCall();
  };

  const forceEndCall = () => {
    peerRef.current?.close();
    peerRef.current = null;

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    setStatus("idle");
    setPartnerName("");
    setMessages([]);
    setText("");
    setIsMuted(false);
    setReplyTo(null);
    setCallId(null);
  };

  // ================= REPORT =================
  const reportCall = async () => {
    if (!callId) return;

    const reason = prompt("Enter report reason");
    if (!reason) return;

    await fetch(`${import.meta.env.VITE_API_URL}/api/call/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ callId, reason }),
    });

    setCallPopup("Reported successfully");
    setTimeout(() => setCallPopup(null), 2000);
  };

  // ================= UI =================
  return (
    <div className="h-screen w-screen flex bg-black text-white fixed top-0 left-0">

      {callPopup && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-gray-800 px-4 py-2 rounded-lg text-sm z-50">
          {callPopup}
        </div>
      )}

      {/* LEFT */}
      <div className="w-[70%] flex flex-col">

        <div className="h-16 flex items-center justify-center border-b border-gray-800">
          <div className="text-sm text-gray-300">
            {status === "idle" && "Ready to connect"}
            {status === "waiting" && "Searching partner..."}
            {status === "connected" && `Connected with ${partnerName}`}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
          <div className="text-6xl mb-2">👤</div>
          <div>
            {status === "connected"
              ? `Talking with ${partnerName}`
              : "No active call"}
          </div>
        </div>

        <div className="h-24 flex items-center justify-center border-t border-gray-800">
          <div className="flex gap-4">

            {status === "idle" && (
              <button onClick={startCall} className="px-6 py-3 bg-green-600 rounded-full">
                Start Call
              </button>
            )}

            {status !== "idle" && (
              <>
                <button onClick={toggleMute} className="px-5 py-3 bg-gray-700 rounded-full">
                  {isMuted ? "Unmute" : "Mute"}
                </button>

                <button onClick={endCall} className="px-5 py-3 bg-red-600 rounded-full">
                  End
                </button>

                <button onClick={reportCall} className="px-5 py-3 bg-yellow-600 rounded-full">
                  Report
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT CHAT */}
{/* RIGHT CHAT */}
<div className="w-[30%] flex flex-col border-l border-gray-800">

  <div className="h-16 flex items-center px-4 border-b border-gray-800">
    Chat
  </div>

  <div className="flex-1 overflow-y-auto p-3 space-y-3">

    {messages.map((m, i) => {
      const isMe = m.senderId === user?.id;

      return (
        <div key={m.id || i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
          <div className="max-w-[80%]">

            {/* NAME */}
            <div className="text-[11px] text-gray-300 mb-1">
              {isMe ? "You" : m.senderName}
            </div>

            {/* REPLY PREVIEW */}
            {m.replyTo && (
              <div className="text-xs bg-black/40 border border-gray-700 p-2 rounded-t-lg text-gray-300">
                <div className="opacity-70">{m.replyTo.senderName}</div>
                <div className="truncate">{m.replyTo.text}</div>
              </div>
            )}

            {/* MESSAGE BOX */}
            <div
              onDoubleClick={() => setReplyTo(m)} // ✅ reply like WhatsApp
              className={`px-3 py-2 rounded-lg text-sm cursor-pointer ${
                isMe ? "bg-green-700" : "bg-gray-800"
              }`}
            >
              <div>{m.text}</div>

              {/* TIME */}
              <div className="text-[10px] opacity-60 text-right mt-1">
                {m.time}
              </div>
            </div>

          </div>
        </div>
      );
    })}

    <div ref={chatEndRef} />
  </div>

  <div className="p-3 border-t border-gray-800">

    {/* REPLY BOX */}
    {replyTo && (
      <div className="mb-2 p-2 bg-gray-800 rounded-lg text-xs flex justify-between">
        <div>
          <div className="text-gray-400">{replyTo.senderName}</div>
          <div className="truncate">{replyTo.text}</div>
        </div>

        <button onClick={() => setReplyTo(null)} className="text-red-400">
          ✕
        </button>
      </div>
    )}

    <div className="flex items-center gap-2">

      <textarea
        value={text}
        disabled={!canChat}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (!canChat) return;

          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        rows={2}
        placeholder={canChat ? "Type message 😊" : "Chat locked"}
        className={`flex-1 resize-none rounded-lg px-3 py-2 text-sm outline-none
          ${canChat ? "bg-gray-900" : "bg-gray-800 text-gray-500"}
        `}
      />

      <button
        onClick={sendMessage}
        disabled={!canChat}
        className={`w-10 h-10 flex items-center justify-center rounded-full
          ${canChat ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 cursor-not-allowed"}
        `}
      >
        ➤
      </button>

    </div>
  </div>
</div>

      <audio ref={localAudio} autoPlay muted />
      <audio ref={remoteAudio} autoPlay />
    </div>
  );
};

export default Call;