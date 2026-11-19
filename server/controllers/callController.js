// const axios = require("axios");
// const Call = require("../models/CallSession");

// /**
//  * START CALL
//  */
// exports.startCall = async (req, res) => {
//   try {
//     const { receiverId, language } = req.body;

//     if (!receiverId || !language) {
//       return res.status(400).json({ message: "receiverId and language are required" });
//     }

//     const call = await Call.create({
//       caller: req.user._id,
//       receiver: receiverId,
//       language,
//       feedbacks: []
//     });

//     res.status(201).json({
//       message: "Call started",
//       callId: call._id
//     });
//   } catch (error) {
//     console.error("Start call error:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * END CALL + USER-SPECIFIC AI FEEDBACK
//  */
// exports.endCall = async (req, res) => {
//   try {
//     const { callId, transcript } = req.body;
//     const userId = req.user._id.toString();

//     if (!callId) return res.status(400).json({ message: "callId required" });

//     const call = await Call.findById(callId);
//     if (!call) return res.status(404).json({ message: "Call not found" });

//     const alreadyGiven = call.feedbacks.find(f => f.user.toString() === userId);
//     if (alreadyGiven) return res.status(400).json({ message: "Feedback already generated for this user" });

//     call.endedAt = new Date();

//     if (!transcript || transcript.trim().length < 20) {
//       call.feedbacks.push({
//         user: req.user._id,
//         transcript,
//         aiFeedback: {},
//         suggestions: [],
//         score: 0
//       });

//       await call.save();
//       return res.json({ message: "Transcript too short", score: 0 });
//     }

//     // ---------- SPLIT INTO SENTENCES ----------
//     const sentences = transcript.match(/[^.!?]+[.!?]+/g) || [transcript];
//     const CHUNK_SIZE = 5;
//     const chunks = [];
//     for (let i = 0; i < sentences.length; i += CHUNK_SIZE) {
//       chunks.push(sentences.slice(i, i + CHUNK_SIZE));
//     }

//     const suggestions = [];
//     const issues = [];
//     const improvements = [];
//     let correctedVersion = "";
//     let totalScore = 0;
//     let sentenceCount = 0;

//     for (const chunk of chunks) {
//       const prompt = `
// You are a native English pronunciation and fluency coach.

// Analyze EACH sentence individually.

// For each sentence:
// - Fix spelling and grammar
// - Improve fluency and naturalness
// - Identify pronunciation / clarity issues
// - Generate 6–10 native alternatives
// - Score from 0 to 10

// Return ONLY valid JSON array:

// [
//   {
//     "sentence": "",
//     "correctedText": "",
//     "alternatives": [],
//     "issues": [],
//     "improvements": [],
//     "score": 0
//   }
// ]

// Sentences:
// ${chunk.map(s => `"${s.replace(/"/g, '\\"')}"`).join("\n")}
// `;

//       try {
//         const aiResponse = await axios.post(
//           "https://api.openai.com/v1/chat/completions",
//           {
//             model: "gpt-4o-mini",
//             messages: [{ role: "user", content: prompt }],
//             temperature: 0.25
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//               "Content-Type": "application/json"
//             }
//           }
//         );

//         let aiText = aiResponse.data.choices[0].message.content;
//         aiText = aiText.substring(aiText.indexOf("["), aiText.lastIndexOf("]") + 1);
//         const parsed = JSON.parse(aiText);

//         parsed.forEach(item => {
//           suggestions.push({
//             originalText: item.sentence,
//             correctedText: item.correctedText,
//             alternatives: item.alternatives || []
//           });

//           issues.push(...(item.issues || []));
//           improvements.push(...(item.improvements || []));
//           correctedVersion += (item.correctedText || item.sentence) + " ";

//           totalScore += item.score || 0;
//           sentenceCount++;
//         });
//       } catch (err) {
//         console.error("AI chunk error:", err.message);
//       }
//     }

//     const finalScore = sentenceCount ? Math.round((totalScore / sentenceCount) * 10) / 10 : 0;

//     call.feedbacks.push({
//       user: req.user._id,
//       transcript,
//       aiFeedback: { issues, improvements, correctedVersion: correctedVersion.trim() },
//       suggestions,
//       score: finalScore
//     });

//     await call.save();

//     res.json({
//       message: "Feedback generated",
//       aiFeedback: { issues, improvements, correctedVersion: correctedVersion.trim() },
//       suggestions,
//       score: finalScore
//     });
//   } catch (error) {
//     console.error("End call error:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * GET LOGGED-IN USER'S FEEDBACK
//  */
// exports.getMyFeedback = async (req, res) => {
//   const { callId } = req.params;
//   const userId = req.user._id.toString();

//   const call = await Call.findById(callId);
//   if (!call) {
//     return res.status(404).json({ message: "Call not found" });
//   }

//   const feedback = call.feedbacks.find(
//     f => f.user.toString() === userId
//   );

//   if (!feedback) {
//     return res.status(404).json({
//       message: "No feedback found for this user"
//     });
//   }

//   res.json(feedback);
// };


// /**
//  * REPORT CALL
//  */
// exports.reportCall = async (req, res) => {
//   try {
//     const { callId, reason } = req.body;

//     if (!callId || !reason) return res.status(400).json({ message: "callId and reason required" });

//     await Call.findByIdAndUpdate(callId, {
//       isReported: true,
//       reportReason: reason,
//       reportedBy: req.user._id,
//       reportedAt: new Date()
//     });

//     res.json({ message: "Call reported successfully" });
//   } catch (error) {
//     console.error("Report call error:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };




// malinda origanal



// code after

// const axios = require("axios");
// const Call = require("../models/CallSession");

// /**
//  * START CALL
//  * ✅ FIX: allow optional receiverId (random call support)
//  */
// exports.startCall = async (req, res) => {
//   try {
//     const { receiverId, language } = req.body;

//     if (!language) {
//       return res.status(400).json({ message: "language is required" });
//     }

//     const call = await Call.create({
//       caller: req.user._id,
//       receiver: receiverId || null, // ✅ FIXED (optional for random match)
//       language,
//       feedbacks: [],
//     });

//     res.status(201).json({
//       message: "Call started",
//       callId: call._id,
//     });
//   } catch (error) {
//     console.error("Start call error:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * END CALL + AI FEEDBACK
//  */
// exports.endCall = async (req, res) => {
//   try {
//     const { callId, transcript } = req.body;
//     const userId = req.user._id.toString();

//     if (!callId) {
//       return res.status(400).json({ message: "callId required" });
//     }

//     const call = await Call.findById(callId);
//     if (!call) {
//       return res.status(404).json({ message: "Call not found" });
//     }

//     // ✅ FIX: prevent duplicate feedback
//     const alreadyGiven = call.feedbacks.find(
//       (f) => f.user.toString() === userId
//     );

//     if (alreadyGiven) {
//       return res.status(400).json({
//         message: "Feedback already generated",
//       });
//     }

//     call.endedAt = new Date();

//     // ================= SHORT TRANSCRIPT =================
//     if (!transcript || transcript.trim().length < 20) {
//       call.feedbacks.push({
//         user: req.user._id,
//         transcript,
//         aiFeedback: {},
//         suggestions: [],
//         score: 0,
//       });

//       await call.save();

//       return res.json({
//         message: "Transcript too short",
//         score: 0,
//       });
//     }

//     // ================= SPLIT SENTENCES =================
//     const sentences =
//       transcript.match(/[^.!?]+[.!?]+/g) || [transcript];

//     const CHUNK_SIZE = 5;
//     const chunks = [];

//     for (let i = 0; i < sentences.length; i += CHUNK_SIZE) {
//       chunks.push(sentences.slice(i, i + CHUNK_SIZE));
//     }

//     const suggestions = [];
//     const issues = [];
//     const improvements = [];

//     let correctedVersion = "";
//     let totalScore = 0;
//     let sentenceCount = 0;

//     // ================= AI LOOP =================
//     for (const chunk of chunks) {
//       const prompt = `
// You are a native English pronunciation and fluency coach.

// Analyze EACH sentence individually.

// For each sentence:
// - Fix spelling and grammar
// - Improve fluency
// - Identify issues
// - Give 6–10 alternatives
// - Score (0–10)

// Return ONLY JSON array:

// [
//   {
//     "sentence": "",
//     "correctedText": "",
//     "alternatives": [],
//     "issues": [],
//     "improvements": [],
//     "score": 0
//   }
// ]

// Sentences:
// ${chunk.map((s) => `"${s.replace(/"/g, '\\"')}"`).join("\n")}
// `;

//       try {
//         const aiResponse = await axios.post(
//           "https://api.openai.com/v1/chat/completions",
//           {
//             model: "gpt-4o-mini",
//             messages: [{ role: "user", content: prompt }],
//             temperature: 0.3,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         let aiText =
//           aiResponse.data.choices[0].message.content;

//         aiText = aiText.substring(
//           aiText.indexOf("["),
//           aiText.lastIndexOf("]") + 1
//         );

//         const parsed = JSON.parse(aiText);

//         parsed.forEach((item) => {
//           suggestions.push({
//             originalText: item.sentence,
//             correctedText: item.correctedText,
//             alternatives: item.alternatives || [],
//           });

//           issues.push(...(item.issues || []));
//           improvements.push(...(item.improvements || []));

//           correctedVersion +=
//             (item.correctedText || item.sentence) + " ";

//           totalScore += item.score || 0;
//           sentenceCount++;
//         });
//       } catch (err) {
//         console.error("AI chunk error:", err.message);
//       }
//     }

//     const finalScore = sentenceCount
//       ? Math.round((totalScore / sentenceCount) * 10) / 10
//       : 0;

//     // ================= SAVE =================
//     call.feedbacks.push({
//       user: req.user._id,
//       transcript,
//       aiFeedback: {
//         issues,
//         improvements,
//         correctedVersion: correctedVersion.trim(),
//       },
//       suggestions,
//       score: finalScore,
//     });

//     await call.save();

//     res.json({
//       message: "Feedback generated",
//       aiFeedback: {
//         issues,
//         improvements,
//         correctedVersion: correctedVersion.trim(),
//       },
//       suggestions,
//       score: finalScore,
//     });
//   } catch (error) {
//     console.error("End call error:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * GET MY FEEDBACK
//  */
// exports.getMyFeedback = async (req, res) => {
//   try {
//     const { callId } = req.params;
//     const userId = req.user._id.toString();

//     const call = await Call.findById(callId);

//     if (!call) {
//       return res.status(404).json({
//         message: "Call not found",
//       });
//     }

//     const feedback = call.feedbacks.find(
//       (f) => f.user.toString() === userId
//     );

//     if (!feedback) {
//       return res.status(404).json({
//         message: "No feedback found",
//       });
//     }

//     res.json(feedback);
//   } catch (err) {
//     console.error("Get feedback error:", err.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * REPORT CALL
//  * ✅ FIX: prevent multiple reports + validate
//  */
// exports.reportCall = async (req, res) => {
//   try {
//     const { callId, reason } = req.body;

//     if (!callId || !reason) {
//       return res.status(400).json({
//         message: "callId and reason required",
//       });
//     }

//     const call = await Call.findById(callId);

//     if (!call) {
//       return res.status(404).json({
//         message: "Call not found",
//       });
//     }

//     // ✅ FIX: avoid duplicate report
//     if (call.isReported) {
//       return res.status(400).json({
//         message: "Already reported",
//       });
//     }

//     call.isReported = true;
//     call.reportReason = reason;
//     call.reportedBy = req.user._id;
//     call.reportedAt = new Date();

//     await call.save();

//     res.json({
//       message: "Call reported successfully",
//     });
//   } catch (error) {
//     console.error("Report call error:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };




// const axios = require("axios");
// const Call = require("../models/CallSession");

// /**
//  * START CALL
//  * ✅ supports random matching (receiver optional)
//  */
// exports.startCall = async (req, res) => {
//   try {
//     const { receiverId, language } = req.body;

//     if (!language) {
//       return res.status(400).json({
//         message: "language is required",
//       });
//     }

//     const call = await Call.create({
//       caller: req.user._id,
//       receiver: receiverId || null, // optional
//       language,
//       feedbacks: [],
//     });

//     res.status(201).json({
//       message: "Call started",
//       callId: call._id,
//     });
//   } catch (error) {
//     console.error("Start call error:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * UPDATE RECEIVER (🔥 REQUIRED FOR SOCKET MATCH)
//  */
// exports.updateReceiver = async (req, res) => {
//   try {
//     const { callId, receiverId } = req.body;

//     if (!callId || !receiverId) {
//       return res.status(400).json({
//         message: "callId and receiverId required",
//       });
//     }

//     const call = await Call.findById(callId);

//     if (!call) {
//       return res.status(404).json({
//         message: "Call not found",
//       });
//     }

//     call.receiver = receiverId;
//     await call.save();

//     res.json({
//       message: "Receiver updated",
//     });
//   } catch (error) {
//     console.error("Update receiver error:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * END CALL + AI FEEDBACK
//  */
// exports.endCall = async (req, res) => {
//   try {
//     const { callId, transcript } = req.body;
//     const userId = req.user._id.toString();

//     if (!callId) {
//       return res.status(400).json({
//         message: "callId required",
//       });
//     }

//     const call = await Call.findById(callId);

//     if (!call) {
//       return res.status(404).json({
//         message: "Call not found",
//       });
//     }

//     // prevent duplicate feedback
//     const alreadyGiven = call.feedbacks.find(
//       (f) => f.user.toString() === userId
//     );

//     if (alreadyGiven) {
//       return res.status(400).json({
//         message: "Feedback already generated",
//       });
//     }

//     call.endedAt = new Date();

//     // ================= SHORT TRANSCRIPT =================
//     if (!transcript || transcript.trim().length < 20) {
//       call.feedbacks.push({
//         user: req.user._id,
//         transcript,
//         aiFeedback: {},
//         suggestions: [],
//         score: 0,
//       });

//       await call.save();

//       return res.json({
//         message: "Transcript too short",
//         score: 0,
//       });
//     }

//     // ================= SPLIT =================
//     const sentences =
//       transcript.match(/[^.!?]+[.!?]+/g) || [transcript];

//     const CHUNK_SIZE = 5;
//     const chunks = [];

//     for (let i = 0; i < sentences.length; i += CHUNK_SIZE) {
//       chunks.push(sentences.slice(i, i + CHUNK_SIZE));
//     }

//     const suggestions = [];
//     const issues = [];
//     const improvements = [];

//     let correctedVersion = "";
//     let totalScore = 0;
//     let sentenceCount = 0;

//     // ================= AI =================
//     for (const chunk of chunks) {
//       const prompt = `
// You are a native English fluency coach.

// Analyze each sentence:

// - Fix grammar
// - Improve fluency
// - List issues
// - Give 6–10 alternatives
// - Score (0–10)

// Return ONLY JSON array:

// [
//   {
//     "sentence": "",
//     "correctedText": "",
//     "alternatives": [],
//     "issues": [],
//     "improvements": [],
//     "score": 0
//   }
// ]

// Sentences:
// ${chunk.map((s) => `"${s.replace(/"/g, '\\"')}"`).join("\n")}
// `;

//       try {
//         const aiResponse = await axios.post(
//           "https://api.openai.com/v1/chat/completions",
//           {
//             model: "gpt-4o-mini",
//             messages: [{ role: "user", content: prompt }],
//             temperature: 0.3,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         let aiText =
//           aiResponse.data.choices[0].message.content;

//         aiText = aiText.substring(
//           aiText.indexOf("["),
//           aiText.lastIndexOf("]") + 1
//         );

//         const parsed = JSON.parse(aiText);

//         parsed.forEach((item) => {
//           suggestions.push({
//             originalText: item.sentence,
//             correctedText: item.correctedText,
//             alternatives: item.alternatives || [],
//           });

//           issues.push(...(item.issues || []));
//           improvements.push(...(item.improvements || []));

//           correctedVersion +=
//             (item.correctedText || item.sentence) + " ";

//           totalScore += item.score || 0;
//           sentenceCount++;
//         });
//       } catch (err) {
//         console.error("AI error:", err.message);
//       }
//     }

//     const finalScore = sentenceCount
//       ? Math.round((totalScore / sentenceCount) * 10) / 10
//       : 0;

//     // ================= SAVE =================
//     call.feedbacks.push({
//       user: req.user._id,
//       transcript,
//       aiFeedback: {
//         issues,
//         improvements,
//         correctedVersion: correctedVersion.trim(),
//       },
//       suggestions,
//       score: finalScore,
//     });

//     await call.save();

//     res.json({
//       message: "Feedback generated",
//       aiFeedback: {
//         issues,
//         improvements,
//         correctedVersion: correctedVersion.trim(),
//       },
//       suggestions,
//       score: finalScore,
//     });
//   } catch (error) {
//     console.error("End call error:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * GET MY FEEDBACK
//  */
// exports.getMyFeedback = async (req, res) => {
//   try {
//     const { callId } = req.params;
//     const userId = req.user._id.toString();

//     const call = await Call.findById(callId);

//     if (!call) {
//       return res.status(404).json({
//         message: "Call not found",
//       });
//     }

//     const feedback = call.feedbacks.find(
//       (f) => f.user.toString() === userId
//     );

//     if (!feedback) {
//       return res.status(404).json({
//         message: "No feedback found",
//       });
//     }

//     res.json(feedback);
//   } catch (err) {
//     console.error("Get feedback error:", err.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * REPORT CALL
//  */
// exports.reportCall = async (req, res) => {
//   try {
//     const { callId, reason } = req.body;

//     if (!callId || !reason) {
//       return res.status(400).json({
//         message: "callId and reason required",
//       });
//     }

//     const call = await Call.findById(callId);

//     if (!call) {
//       return res.status(404).json({
//         message: "Call not found",
//       });
//     }

//     if (call.isReported) {
//       return res.status(400).json({
//         message: "Already reported",
//       });
//     }

//     call.isReported = true;
//     call.reportReason = reason;
//     call.reportedBy = req.user._id;
//     call.reportedAt = new Date();

//     await call.save();

//     res.json({
//       message: "Call reported successfully",
//     });
//   } catch (error) {
//     console.error("Report call error:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };



// updated for uiux


const axios = require("axios");
const Call = require("../models/CallSession");
const LanguageSelection = require("../models/LanguageSelection"); // ✅ added

/**
 * START CALL
 */
exports.startCall = async (req, res) => {
  try {
    const userId = req.user._id;

    // ✅ GET USER LANGUAGE FROM DB (LATEST)
    const selection = await LanguageSelection.findOne({ user: userId })
      .sort({ createdAt: -1 });

    if (!selection) {
      return res.status(400).json({
        message: "Please select language first",
      });
    }

    const call = await Call.create({
      caller: userId,
      receiver: null,
      language: selection.language, // ✅ FIXED (NO HARDCODE / NO BODY)
      feedbacks: [],
    });

    res.status(201).json({
      message: "Call started",
      callId: call._id,
      language: selection.language, // ✅ send to frontend
    });
  } catch (error) {
    console.error("Start call error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPDATE RECEIVER
 */
exports.updateReceiver = async (req, res) => {
  try {
    const { callId, receiverId } = req.body;

    if (!callId || !receiverId) {
      return res.status(400).json({
        message: "callId and receiverId required",
      });
    }

    const call = await Call.findById(callId);

    if (!call) {
      return res.status(404).json({
        message: "Call not found",
      });
    }

    // ✅ prevent overwrite
    if (call.receiver) {
      return res.json({
        message: "Receiver already set",
      });
    }

    call.receiver = receiverId;
    await call.save();

    res.json({
      message: "Receiver updated",
    });
  } catch (error) {
    console.error("Update receiver error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * END CALL + AI FEEDBACK
 */
exports.endCall = async (req, res) => {
  try {
    const { callId, transcript } = req.body;
    const userId = req.user._id.toString();

    if (!callId) {
      return res.status(400).json({
        message: "callId required",
      });
    }

    const call = await Call.findById(callId);

    if (!call) {
      return res.status(404).json({
        message: "Call not found",
      });
    }

    // ✅ DO NOT CHANGE LANGUAGE HERE (IMPORTANT FIX)
    // call.language = something ❌ NEVER DO THIS

    const alreadyGiven = call.feedbacks.find(
      (f) => f.user.toString() === userId
    );

    if (alreadyGiven) {
      return res.status(400).json({
        message: "Feedback already generated",
      });
    }

    call.endedAt = new Date();

    // ================= SHORT =================
    if (!transcript || transcript.trim().length < 20) {
      call.feedbacks.push({
        user: req.user._id,
        transcript,
        aiFeedback: {},
        suggestions: [],
        score: 0,
      });

      await call.save();

      return res.json({
        message: "Transcript too short",
        score: 0,
      });
    }

    // ================= SPLIT =================
    const sentences =
      transcript.match(/[^.!?]+[.!?]+/g) || [transcript];

    const CHUNK_SIZE = 5;
    const chunks = [];

    for (let i = 0; i < sentences.length; i += CHUNK_SIZE) {
      chunks.push(sentences.slice(i, i + CHUNK_SIZE));
    }

    const suggestions = [];
    const issues = [];
    const improvements = [];

    let correctedVersion = "";
    let totalScore = 0;
    let sentenceCount = 0;

    // ================= AI =================
    for (const chunk of chunks) {
      const prompt = `
You are a native English fluency coach.

Analyze each sentence:

- Fix grammar
- Improve fluency
- List issues
- Give 6–10 alternatives
- Score (0–10)

Return ONLY JSON array:
[
  {
    "sentence": "",
    "correctedText": "",
    "alternatives": [],
    "issues": [],
    "improvements": [],
    "score": 0
  }
]

Sentences:
${chunk.map((s) => `"${s.replace(/"/g, '\\"')}"`).join("\n")}
`;

      try {
        const aiResponse = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        let aiText =
          aiResponse.data.choices[0]?.message?.content || "";

        const start = aiText.indexOf("[");
        const end = aiText.lastIndexOf("]");

        if (start === -1 || end === -1) continue;

        const parsed = JSON.parse(aiText.substring(start, end + 1));

        parsed.forEach((item) => {
          suggestions.push({
            originalText: item.sentence,
            correctedText: item.correctedText,
            alternatives: item.alternatives || [],
          });

          issues.push(...(item.issues || []));
          improvements.push(...(item.improvements || []));

          correctedVersion +=
            (item.correctedText || item.sentence) + " ";

          totalScore += item.score || 0;
          sentenceCount++;
        });
      } catch (err) {
        console.error("AI error:", err.message);
      }
    }

    const finalScore = sentenceCount
      ? Math.round((totalScore / sentenceCount) * 10) / 10
      : 0;

    // ================= SAVE =================
    call.feedbacks.push({
      user: req.user._id,
      transcript,
      aiFeedback: {
        issues,
        improvements,
        correctedVersion: correctedVersion.trim(),
      },
      suggestions,
      score: finalScore,
    });

    await call.save();

    res.json({
      message: "Feedback generated",
      aiFeedback: {
        issues,
        improvements,
        correctedVersion: correctedVersion.trim(),
      },
      suggestions,
      score: finalScore,
    });
  } catch (error) {
    console.error("End call error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET MY FEEDBACK
 */
exports.getMyFeedback = async (req, res) => {
  try {
    const { callId } = req.params;
    const userId = req.user._id.toString();

    const call = await Call.findById(callId);

    if (!call) {
      return res.status(404).json({
        message: "Call not found",
      });
    }

    const feedback = call.feedbacks.find(
      (f) => f.user.toString() === userId
    );

    if (!feedback) {
      return res.status(404).json({
        message: "No feedback found",
      });
    }

    res.json(feedback);
  } catch (err) {
    console.error("Get feedback error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * REPORT CALL
 */
exports.reportCall = async (req, res) => {
  try {
    const { callId, reason } = req.body;

    if (!callId || !reason) {
      return res.status(400).json({
        message: "callId and reason required",
      });
    }

    const call = await Call.findById(callId);

    if (!call) {
      return res.status(404).json({
        message: "Call not found",
      });
    }

    if (call.isReported) {
      return res.status(400).json({
        message: "Already reported",
      });
    }

    call.isReported = true;
    call.reportReason = reason;
    call.reportedBy = req.user._id;
    call.reportedAt = new Date();

    await call.save();

    res.json({
      message: "Call reported successfully",
    });
  } catch (error) {
    console.error("Report call error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};