import { useEffect, useRef, useState, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// SCORE FUNCTIONS
// Each returns a 0–1 float derived from landmark geometry.
// Higher = more confident that expression is occurring.
// ─────────────────────────────────────────────────────────────────────────────

/** How much the lip corners curve upward vs the bottom-lip centre */
function smileScore(lm) {
  const faceH = Math.abs(lm[10].y - lm[152].y) + 1e-6;
  const cornerAvgY = (lm[61].y + lm[291].y) / 2;
  return (lm[17].y - cornerAvgY) / faceH; // neutral ≈ 0.03, smile > 0.085
}

/** Eye Aspect Ratio — 6-point formula (dlib standard) */
function eyeAspectRatio(lm, p1, p2, p3, p4, p5, p6) {
  const A = Math.hypot(lm[p2].x - lm[p6].x, lm[p2].y - lm[p6].y);
  const B = Math.hypot(lm[p3].x - lm[p5].x, lm[p3].y - lm[p5].y);
  const C = Math.hypot(lm[p1].x - lm[p4].x, lm[p1].y - lm[p4].y) + 1e-6;
  return (A + B) / (2 * C); // open ≈ 0.28–0.35, closed < 0.20
}

/** Left-eye EAR */
function leftEyeScore(lm) {
  return eyeAspectRatio(lm, 33, 160, 158, 133, 153, 144);
}

/** Right-eye EAR */
function rightEyeScore(lm) {
  return eyeAspectRatio(lm, 362, 387, 385, 263, 380, 373);
}

/** Inner-brow to upper-eyelid gap — rises when brows lift */
function browRaiseScore(lm) {
  const faceH = Math.abs(lm[10].y - lm[152].y) + 1e-6;
  const leftGap = Math.abs(lm[105].y - lm[159].y);
  const rightGap = Math.abs(lm[334].y - lm[386].y);
  return ((leftGap + rightGap) / 2) / faceH; // neutral ≈ 0.04, raised > 0.075
}

/** Vertical inner-lip gap normalised by face height */
function mouthOpenScore(lm) {
  const faceH = Math.abs(lm[10].y - lm[152].y) + 1e-6;
  return Math.abs(lm[13].y - lm[14].y) / faceH; // closed ≈ 0.01, open > 0.05
}

function sadScore(lm) {
  const faceH      = Math.abs(lm[10].y - lm[152].y) + 1e-6;
  const lipMidY    = (lm[13].y + lm[14].y) / 2;
  const cornerAvgY = (lm[61].y + lm[291].y) / 2;
  return (cornerAvgY - lipMidY) / faceH;
}

// EMOTION CLASSIFIER
// Reads each score, compares against thresholds, returns dominant emotion.
function classifyEmotion(lm) {
  const smile = smileScore(lm);
  const leftEAR = leftEyeScore(lm);
  const rightEAR = rightEyeScore(lm);
  const brow = browRaiseScore(lm);
  const mouth = mouthOpenScore(lm);
  const sad = sadScore(lm);

  // Thresholds
  const IS_SMILING = smile > 0.078;
  const IS_LEFT_BLINK = leftEAR < 0.20;
  const IS_RIGHT_BLINK = rightEAR < 0.20;
  const IS_BOTH_BLINK = IS_LEFT_BLINK && IS_RIGHT_BLINK;
  const IS_BROW_RAISED = brow > 0.12;
  const IS_MOUTH_OPEN = mouth > 0.05;
  const IS_SAD = sad > 0.005;

  // Priority if-else chain
  if (IS_BOTH_BLINK && !IS_MOUTH_OPEN) {
    return { emotion: "sleeping", label: "Sleepy", emoji: "😴" };
  } else if (IS_BROW_RAISED && IS_MOUTH_OPEN) {
    return { emotion: "shocked", label: "Shocked", emoji: "😱" };
  } else if (IS_BROW_RAISED && IS_SMILING) {
    return { emotion: "excited", label: "Excited", emoji: "🤩" };
  } else if (IS_SMILING && IS_MOUTH_OPEN) {
    return { emotion: "laughing", label: "Laughing", emoji: "😄" };
  } else if (IS_SMILING) {
    return { emotion: "happy", label: "Happy", emoji: "😊" };
  } else if (IS_BROW_RAISED) {
    return { emotion: "surprised", label: "Surprised", emoji: "😲" };
  } else if (IS_MOUTH_OPEN) {
    return { emotion: "talking", label: "Talking", emoji: "😮" };
  } else if (IS_SAD) {
    return { emotion: "sad", label: "Sad", emoji: "🙁" };
  } else if (IS_LEFT_BLINK && !IS_RIGHT_BLINK) {
    return { emotion: "wink_left", label: "Winking", emoji: "😉" };
  } else if (IS_RIGHT_BLINK && !IS_LEFT_BLINK) {
    return { emotion: "wink_right", label: "Winking", emoji: "😏" };
  } else {
    return { emotion: "neutral", label: "Neutral", emoji: "😐" };
  }
}

// CANVAS DRAW
function drawFaceMesh(ctx, lm, w, h) {
  ctx.fillStyle = "rgba(52, 211, 153, 0.6)";
  for (const pt of lm) {
    ctx.beginPath();
    ctx.arc(pt.x * w, pt.y * h, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  const contours = [
    [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377,
      152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10],
    [33, 7, 163, 144, 145, 153, 154, 155, 133, 33],
    [362, 382, 381, 380, 374, 373, 390, 249, 263, 362],
    [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61],
  ];

  ctx.strokeStyle = "rgba(52, 211, 153, 0.25)";
  ctx.lineWidth = 0.8;
  for (const group of contours) {
    ctx.beginPath();
    ctx.moveTo(lm[group[0]].x * w, lm[group[0]].y * h);
    for (let i = 1; i < group.length; i++) {
      ctx.lineTo(lm[group[i]].x * w, lm[group[i]].y * h);
    }
    ctx.stroke();
  }
}

// COMPONENT
export default function FaceExpressions() {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const modelRef  = useRef(null);
  const streamRef = useRef(null);

  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [result, setResult] = useState(null);      // { emotion, label, emoji }

  // Auto-start: load model + camera on mount
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const { FaceLandmarker, FilesetResolver } =
          await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/+esm");

        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );

        modelRef.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "IMAGE", // single-frame detection on demand
          numFaces: 1,
        });

        if (cancelled) return;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
        });

        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }

        streamRef.current = stream;
        const video = videoRef.current;
        video.srcObject = stream;
        video.onloadeddata = () => { video.play(); if (!cancelled) setStatus("ready"); };
      } catch (err) {
        console.error(err);
        if (!cancelled) setStatus("error");
      }
    }

    init();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach(t => t.stop());
      modelRef.current?.close();
    };
  }, []);

  // Capture current frame and detect emotion
  const detectEmotion = useCallback(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !modelRef.current || video.readyState < 2) return;

    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Single-frame detection (IMAGE mode uses .detect() not .detectForVideo())
    const res = modelRef.current.detect(video);

    if (res.faceLandmarks?.length > 0) {
      const lm = res.faceLandmarks[0];
      drawFaceMesh(ctx, lm, canvas.width, canvas.height);
      setResult(classifyEmotion(lm));
    } else {
      setResult({ emotion: "none", label: "No face found", emoji: "🤷" });
    }
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-5 w-full max-w-md">

        <h1 className="font-medium text-white text-3xl">
          Face Expression Tracker
        </h1>

        <div className="relative w-full bg-neutral-900 rounded-lg overflow-hidden" style={{ aspectRatio: "4/3" }}>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: "scaleX(-1)" }}
            muted playsInline
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ transform: "scaleX(-1)" }}
          />

          {/* Overlay only while loading */}
          {status !== "ready" && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
              {status === "loading" && (
                <span className="text-xs text-neutral-500">Starting camera…</span>
              )}
              {status === "error" && (
                <span className="text-xs text-red-500">Camera / model error</span>
              )}
            </div>
          )}
        </div>

        {/* Emotion output */}
        <div className="h-10 flex items-center justify-center gap-2">
          {result && (
            <>
              <span className="text-2xl">{result.emoji}</span>
              <span className="text-base font-medium text-white">{result.label}</span>
            </>
          )}
        </div>

        {/* Detect Emotion button */}
        <button
          onClick={detectEmotion}
          disabled={status !== "ready"}
          className={`w-full py-2.5 rounded-lg text-sm font-medium ${
            status === "ready"
              ? "bg-white text-neutral-950 cursor-pointer"
              : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
          }`}
        >
          {status === "loading" ? "Starting camera…" : "Detect Emotion"}
        </button>

      </div>
    </div>
  );
}