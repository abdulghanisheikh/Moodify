import { useRef, useState, useEffect } from "react";
import { useSong } from "../hooks/useSong.js";

const SPEEDS = [0.5, 1, 1.25, 1.5, 2];

export default function Player() {
    const { song } = useSong();

    const audioRef = useRef(null);

    const [playing, setPlaying] = useState(false);
    const [current, setCurrent] = useState(0);
    const [duration, setDuration] = useState(0);
    const [speed, setSpeed] = useState(1);

    // Attach audio event listeners on mount, clean up on unmount
    useEffect(() => {
        const audio = audioRef.current;
        const onTime = () => setCurrent(audio.currentTime);
        const onLoad = () => setDuration(audio.duration);
        const onEnd = () => setPlaying(false);
        audio.addEventListener("timeupdate", onTime);
        audio.addEventListener("loadedmetadata", onLoad);
        audio.addEventListener("ended", onEnd);
        return () => {
            audio.removeEventListener("timeupdate", onTime);
            audio.removeEventListener("loadedmetadata", onLoad);
            audio.removeEventListener("ended", onEnd);
        };
    }, []);

    // Toggle play / pause
    function togglePlay() {
        const audio = audioRef.current;
        if (playing) { audio.pause(); setPlaying(false); }
        else { audio.play(); setPlaying(true); }
    }

    // Seek to a specific second
    function seek(val) {
        audioRef.current.currentTime = val;
        setCurrent(val);
    }

    // Skip forward or backward by sec seconds
    function skip(sec) {
        audioRef.current.currentTime = Math.min(
            Math.max(0, audioRef.current.currentTime + sec),
            duration
        );
    }

    // Change playback speed
    function changeSpeed(s) {
        audioRef.current.playbackRate = s;
        setSpeed(s);
    }

    // Format seconds → "m:ss"
    function formatTime(s) {
        const m = Math.floor(s / 60);
        const sec = String(Math.floor(s % 60)).padStart(2, "0");
        return `${m}:${sec}`;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-neutral-950 border-t border-orange-500/30 px-10 py-3">

            {/* Poster + info on left | Controls on right */}
            <div className="flex items-center justify-between gap-5">

                {/* Left — poster thumbnail and song info */}
                <div className="flex items-center gap-3 min-w-0">
                    <img
                        src={song.posterURL}
                        alt={song.title}
                        className="w-10 h-10 rounded-md object-cover shrink-0"
                    />
                    <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{song.title}</p>
                        <p className="text-orange-500/60 text-xs capitalize">{song.mood}</p>
                    </div>
                </div>

                {/* Seek bar with timestamps */}
                <div className="flex items-center w-full gap-2 px-10">
                    <span className="text-xs text-orange-500/60 w-8 text-right">{formatTime(current)}</span>
                    <input
                        type="range"
                        min={0} max={duration || 0} step={0.1}
                        value={current}
                        onChange={e => seek(Number(e.target.value))}
                        className="flex-1 accent-orange-500 cursor-pointer"
                    />
                    <span className="text-xs text-orange-500/60 w-8">{formatTime(duration)}</span>
                </div>

                {/* Right — skip back, play/pause, skip forward, speed */}
                <div className="flex items-center gap-3 shrink-0">

                    <button onClick={() => skip(-5)} className="text-orange-500 text-xs cursor-pointer">↺5</button>

                    <button
                        onClick={togglePlay}
                        className="w-9 h-9 rounded-full bg-orange-500 text-black flex items-center justify-center cursor-pointer"
                    >
                        {playing ? "⏸" : "▶"}
                    </button>

                    <button onClick={() => skip(5)} className="text-orange-500 text-xs cursor-pointer">↻5</button>

                    <div className="flex items-center gap-1">
                        {SPEEDS.map(s => (
                            <button
                                key={s}
                                onClick={() => changeSpeed(s)}
                                className={`px-1.5 py-0.5 rounded text-xs cursor-pointer ${speed === s
                                        ? "bg-orange-500 text-black font-semibold"
                                        : "bg-neutral-800 text-orange-500/50"
                                    }`}
                            >
                                {s}×
                            </button>
                        ))}
                    </div>

                </div>
            </div>

            {/* Hidden audio element */}
            <audio ref={audioRef} src={song.URL} />
        </div>
    );
}