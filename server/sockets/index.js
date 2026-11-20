// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// let waitingUser = null;
// let users = {};

// module.exports = (io) => {
//   io.on("connection", async (socket) => {
//     console.log("🟢 Connected:", socket.id);

//     const token = socket.handshake.auth?.token;

//     if (!token) {
//       socket.disconnect();
//       return;
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findById(decoded.id);

//       if (!user) return socket.disconnect();

//       users[socket.id] = {
//         id: user._id.toString(),
//         name: user.name,
//       };

//       console.log("✅ User:", user.name);
//     } catch (err) {
//       return socket.disconnect();
//     }

//     // ================= MATCHING =================
//     socket.on("join-call", () => {
//       if (waitingUser && waitingUser !== socket.id) {
//         const partnerId = waitingUser;

//         const partnerSocket = io.sockets.sockets.get(partnerId);

//         if (partnerSocket) {
//           socket.partner = partnerId;
//           partnerSocket.partner = socket.id;

//           partnerSocket.emit("matched", {
//             partnerId: socket.id,
//             initiator: false,
//             partnerName: users[socket.id]?.name,
//           });

//           socket.emit("matched", {
//             partnerId,
//             initiator: true,
//             partnerName: users[partnerId]?.name,
//           });

//           // ✅ ONLINE STATUS
//           socket.emit("partner-online");
//           partnerSocket.emit("partner-online");
//         }

//         waitingUser = null;
//       } else {
//         waitingUser = socket.id;
//       }
//     });

//     // ================= WEBRTC =================
//     socket.on("offer", ({ target, offer }) => {
//       io.to(target).emit("offer", { offer, from: socket.id });
//     });

//     socket.on("answer", ({ target, answer }) => {
//       io.to(target).emit("answer", { answer, from: socket.id });
//     });

//     socket.on("ice-candidate", ({ target, candidate }) => {
//       io.to(target).emit("ice-candidate", { candidate, from: socket.id });
//     });

//     // ================= CHAT =================
//     socket.on("chat-message", ({ message }) => {
//       const partner = socket.partner;

//       if (partner) {
//         io.to(partner).emit("chat-message", message);
//       }
//     });

//     // ✅ TYPING FEATURE
//     socket.on("typing", () => {
//       if (socket.partner) {
//         io.to(socket.partner).emit("typing");
//       }
//     });

//     socket.on("stop-typing", () => {
//       if (socket.partner) {
//         io.to(socket.partner).emit("stop-typing");
//       }
//     });

//     // ================= END =================
//     socket.on("end-call", () => {
//       if (socket.partner) {
//         io.to(socket.partner).emit("call-ended");
//         io.to(socket.partner).emit("partner-offline"); // ✅
//         socket.partner = null;
//       }
//     });

//     socket.on("disconnect", () => {
//       console.log("🔴 Disconnected:", socket.id);

//       delete users[socket.id];

//       if (waitingUser === socket.id) waitingUser = null;

//       if (socket.partner) {
//         io.to(socket.partner).emit("user-disconnected");
//         io.to(socket.partner).emit("partner-offline"); // ✅
//       }
//     });
//   });
// };

const jwt = require("jsonwebtoken");
const User = require("../models/User");

let waitingUsers = {}; // ✅ language based
let users = {};

module.exports = (io) => {
  io.on("connection", async (socket) => {
    console.log("🟢 Connected:", socket.id);

    const token = socket.handshake.auth?.token;

    if (!token) {
      socket.disconnect();
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) return socket.disconnect();

      users[socket.id] = {
        id: user._id.toString(),
        name: user.name,
      };
    } catch (err) {
      return socket.disconnect();
    }

    // ================= MATCHING =================
    socket.on("join-call", ({ language }) => {
      socket.language = language;

      if (!waitingUsers[language]) {
        waitingUsers[language] = [];
      }

      if (waitingUsers[language].length > 0) {
        const partnerId = waitingUsers[language].shift();
        const partnerSocket = io.sockets.sockets.get(partnerId);

        if (partnerSocket) {
          socket.partner = partnerId;
          partnerSocket.partner = socket.id;

          socket.emit("matched", {
            partnerId,
            initiator: true,
            partnerName: users[partnerId]?.name,
          });

          partnerSocket.emit("matched", {
            partnerId: socket.id,
            initiator: false,
            partnerName: users[socket.id]?.name,
          });
        }
      } else {
        waitingUsers[language].push(socket.id);
      }
    });

    // ================= WEBRTC =================
    socket.on("offer", ({ target, offer }) => {
      io.to(target).emit("offer", { offer, from: socket.id });
    });

    socket.on("answer", ({ target, answer }) => {
      io.to(target).emit("answer", { answer, from: socket.id });
    });

    socket.on("ice-candidate", ({ target, candidate }) => {
      io.to(target).emit("ice-candidate", { candidate, from: socket.id });
    });

    // ================= CHAT =================
    // ================= CHAT =================
    // socket.on("chat-message", (message) => {
    //   if (socket.partner) {
    //     io.to(socket.partner).emit("chat-message", message);
    //   }
    // });

    // ================= CHAT =================
socket.on("chat-message", (message) => {
  console.log("📩 Full message received:", message);
  console.log("👥 Sender:", socket.id);
  console.log("🤝 Partner:", socket.partner);

  if (socket.partner) {
    io.to(socket.partner).emit("chat-message", message);
    console.log("✅ Message forwarded to partner:", socket.partner);
  } else {
    console.log("❌ No partner connected");
  }
});

    // ================= END =================
    socket.on("end-call", () => {
      if (socket.partner) {
        io.to(socket.partner).emit("call-ended");
        socket.partner = null;
      }
    });

    socket.on("disconnect", () => {
      delete users[socket.id];

      for (let lang in waitingUsers) {
        waitingUsers[lang] = waitingUsers[lang].filter(
          (id) => id !== socket.id
        );
      }

      if (socket.partner) {
        io.to(socket.partner).emit("user-disconnected");
      }
    });
  });
};