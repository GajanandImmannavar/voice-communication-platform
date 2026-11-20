// require("dotenv").config();
// require("./jobs/weeklyProgressJob");
// const http = require("http");
// const app = require("./app");
// const { Server } = require("socket.io");
// const connectDB = require("./config/db");
// connectDB();

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: { origin: "*" }
// });

// require("./sockets")(io);

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// require("dotenv").config();
// require("./jobs/weeklyProgressJob");

// const http = require("http");
// const { Server } = require("socket.io");
// const app = require("./app");
// const connectDB = require("./config/db");

// const startServer = async () => {
//   try {
//     // ✅ Connect DB FIRST
//     await connectDB();
//     console.log("MongoDB Connected");

//     const server = http.createServer(app);

//     const io = new Server(server, {
//       cors: {
//         origin: "http://localhost:5173",
//         methods: ["GET", "POST"],
//       },
//     });

//     /* ================= SOCKET LOGIC ================= */

//      /* ================= SOCKET LOGIC ================= */

// let waitingUser = null;
// let users = {};

// io.on("connection", (socket) => {
//   console.log("🟢 Connected:", socket.id);

//   // 🔥 REGISTER USER (get name from frontend)
//   socket.on("register-user", ({ name }) => {
//     users[socket.id] = { name };
//     console.log("User registered:", name);
//   });

//   // ================= JOIN CALL =================
//   socket.on("join-call", () => {
//     if (!users[socket.id]) return;

//     if (waitingUser && waitingUser !== socket.id) {
//       const partnerId = waitingUser;

//       const partnerSocket = io.sockets.sockets.get(partnerId);

//       if (partnerSocket && users[partnerId]) {
//         socket.partner = partnerId;
//         partnerSocket.partner = socket.id;

//         // 🔥 send name + initiator
//         partnerSocket.emit("matched", {
//           partnerId: socket.id,
//           initiator: false,
//           partnerName: users[socket.id].name,
//         });

//         socket.emit("matched", {
//           partnerId: partnerId,
//           initiator: true,
//           partnerName: users[partnerId].name,
//         });

//         console.log(
//           `✅ Matched: ${users[socket.id].name} <-> ${users[partnerId].name}`
//         );
//       }

//       waitingUser = null;
//     } else {
//       waitingUser = socket.id;
//       console.log("⏳ Waiting:", socket.id);
//     }
//   });

//   // ================= SIGNALING =================
//   socket.on("offer", ({ target, offer }) => {
//     io.to(target).emit("offer", {
//       offer,
//       from: socket.id,
//     });
//   });

//   socket.on("answer", ({ target, answer }) => {
//     io.to(target).emit("answer", answer);
//   });

//   socket.on("ice-candidate", ({ target, candidate }) => {
//     io.to(target).emit("ice-candidate", candidate);
//   });

//   // ================= END CALL =================
//   socket.on("end-call", () => {
//     if (socket.partner) {
//       io.to(socket.partner).emit("call-ended");

//       const p = io.sockets.sockets.get(socket.partner);
//       if (p) p.partner = null;

//       socket.partner = null;
//     }
//   });

//   // ================= DISCONNECT =================
//   socket.on("disconnect", () => {
//     console.log("🔴 Disconnected:", socket.id);

//     delete users[socket.id];

//     if (waitingUser === socket.id) {
//       waitingUser = null;
//     }

//     if (socket.partner) {
//       io.to(socket.partner).emit("user-disconnected");
//     }
//   });
// });

// /* ================================================= */



//     const PORT = process.env.PORT || 5000;

//     server.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });

//   } catch (error) {
//     console.error("Server startup error:", error);
//     process.exit(1);
//   }
// };

// startServer();

require("dotenv").config();
require("./jobs/weeklyProgressJob");

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/db");

const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected");

    const server = http.createServer(app);

    // const io = new Server(server, {
    //   cors: {
    //     origin: "http://localhost:5173",
    //     methods: ["GET", "POST"],
    //   },
    // });
    const io = new Server(server, {
    cors: {
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL,
    ].filter(Boolean),
    methods: ["GET", "POST"],
        },
     });

    // ✅ attach socket module
    require("./sockets")(io);

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();