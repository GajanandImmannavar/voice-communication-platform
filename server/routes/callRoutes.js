// const express = require("express");
// const router = express.Router();

// const {
//   startCall,
//   endCall,
//   reportCall,
//   getMyFeedback
// } = require("../controllers/callController");

// const authMiddleware = require("../middlewares/authMiddleware");

// // START CALL
// router.post("/start", authMiddleware, startCall);

// // END CALL + GENERATE AI FEEDBACK
// router.post("/end", authMiddleware, endCall);

// // GET LOGGED-IN USER'S FEEDBACK FOR A CALL
// router.get("/:callId/feedback", authMiddleware, getMyFeedback);

// // REPORT CALL
// router.post("/report", authMiddleware, reportCall);

// module.exports = router;


// const express = require("express");
// const router = express.Router();

// const {
//   startCall,
//   endCall,
//   reportCall,
//   getMyFeedback,
//   updateReceiver // ✅ NOW EXISTS
// } = require("../controllers/callController");

// const authMiddleware = require("../middlewares/authMiddleware");

// router.post("/start", authMiddleware, startCall);
// router.post("/end", authMiddleware, endCall);
// router.post("/report", authMiddleware, reportCall);
// router.get("/:callId/feedback", authMiddleware, getMyFeedback);

// // ✅ FIXED (now valid function)
// router.put("/update-receiver", authMiddleware, updateReceiver);

// module.exports = router;


// new for uiux


const express = require("express");
const router = express.Router();

const callController = require("../controllers/callController");
const authMiddleware = require("../middlewares/authMiddleware");

// ================= CALL ROUTES =================

// ✅ START CALL
router.post("/start", authMiddleware, callController.startCall);

// ✅ END CALL + AI FEEDBACK
router.post("/end", authMiddleware, callController.endCall);

// ✅ REPORT CALL
router.post("/report", authMiddleware, callController.reportCall);

// ✅ GET MY FEEDBACK
router.get("/:callId/feedback", authMiddleware, callController.getMyFeedback);

// ✅ UPDATE RECEIVER (VERY IMPORTANT FOR RANDOM MATCH)
router.put("/update-receiver", authMiddleware, callController.updateReceiver);

module.exports = router;