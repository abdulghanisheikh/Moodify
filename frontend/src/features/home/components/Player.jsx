import { useRef, useState, useEffect } from "react";

// Song data — in real app this comes from props or state
const song = {
    _id: { $oid: "69b3ea38a55ccdb93befa6f6" },
    URL: "https://ik.imagekit.io/AbdulGhani/moodify/songs/Wingman_ujC13PZqz.mp3",
    posterURL: "https://ik.imagekit.io/AbdulGhani/moodify/posters/Wingman_DvLzMfhEY.jpeg",
    title: "Wingman",
    mood: "happy",
};

// Available playback speed options
const SPEEDS = [0.5, 1, 1.25, 1.5, 2];

export default function Player() {

    // Ref to directly access the <audio> element in the DOM
    const audioRef = useRef(null);

    const [playing, setPlaying] = useState(false); // is the song currently playing
    const [current, setCurrent] = useState(0);     // current playback time in seconds
    const [duration, setDuration] = useState(0);     // total song duration in seconds
    const [speed, setSpeed] = useState(1);      // current playback speed

    // Attach audio event listeners when the component mounts
    useEffect(() => {
        const audio = audioRef.current;

        // Update current time as song plays
        const onTime = () => setCurrent(audio.currentTime);

        // Set duration once audio metadata (length, etc.) is loaded
        const onLoad = () => setDuration(audio.duration);

        // Mark song as stopped when it finishes
        const onEnd = () => setPlaying(false);

        audio.addEventListener("timeupdate", onTime);
        audio.addEventListener("loadedmetadata", onLoad);
        audio.addEventListener("ended", onEnd);

        // Remove listeners when component unmounts to avoid memory leaks
        return () => {
            audio.removeEventListener("timeupdate", onTime);
            audio.removeEventListener("loadedmetadata", onLoad);
            audio.removeEventListener("ended", onEnd);
        };
    }, []);

    // Toggle between play and pause
    function togglePlay() {
        const audio = audioRef.current;
        if (playing) { audio.pause(); setPlaying(false); }
        else { audio.play(); setPlaying(true); }
    }

    // Jump to a specific position in the song (called by the seek bar)
    function seek(val) {
        audioRef.current.currentTime = val;
        setCurrent(val);
    }

    // Skip forward or backward by given seconds (e.g. +5 or -5)
    // Math.min/max keeps it within 0 and total duration
    function skip(sec) {
        audioRef.current.currentTime = Math.min(
            Math.max(0, audioRef.current.currentTime + sec),
            duration
        );
    }

    // Change playback speed and update the audio element
    function changeSpeed(s) {
        audioRef.current.playbackRate = s;
        setSpeed(s);
    }

    // Format seconds into m:ss display (e.g. 90 → "1:30")
    function fmt(s) {
        const m = Math.floor(s / 60);
        const sec = String(Math.floor(s % 60)).padStart(2, "0");
        return `${m}:${sec}`;
    }

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
            <div className="w-full max-w-sm flex flex-col gap-5">

                {/* Song cover image */}
                <img
                    src={song.posterURL}
                    alt={song.title}
                    className="w-full aspect-square object-cover rounded-xl"
                />

                {/* Song title and mood label */}
                <div>
                    <p className="text-white font-semibold text-lg">{song.title}</p>
                    <p className="text-neutral-500 text-sm capitalize">{song.mood}</p>
                </div>

                {/* Seek bar — drag to jump to any point in the song */}
                <div className="flex flex-col gap-1">
                    <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        step={0.1}
                        value={current}
                        onChange={e => seek(Number(e.target.value))}
                        className="w-full accent-white cursor-pointer"
                    />
                    {/* Current time on left, total duration on right */}
                    <div className="flex justify-between text-xs text-neutral-500">
                        <span>{fmt(current)}</span>
                        <span>{fmt(duration)}</span>
                    </div>
                </div>

                {/* Playback controls — skip back, play/pause, skip forward */}
                <div className="flex items-center justify-between">

                    {/* Go back 5 seconds */}
                    <button onClick={() => skip(-5)} className="text-neutral-400 text-sm cursor-pointer">
                        ↺ 5
                    </button>

                    {/* Play / Pause toggle button */}
                    <button
                        onClick={togglePlay}
                        className="w-12 h-12 rounded-full bg-white text-neutral-950 flex items-center justify-center text-lg cursor-pointer"
                    >
                        {playing ? "⏸" : "▶"}
                    </button>

                    {/* Go forward 5 seconds */}
                    <button onClick={() => skip(5)} className="text-neutral-400 text-sm cursor-pointer">
                        ↻ 5
                    </button>

                </div>

                {/* Speed selector — highlights the currently active speed */}
                <div className="flex items-center gap-2 justify-center">
                    {SPEEDS.map(s => (
                        <button
                            key={s}
                            onClick={() => changeSpeed(s)}
                            className={`px-2.5 py-1 rounded-md text-xs cursor-pointer ${speed === s
                                    ? "bg-white text-neutral-950 font-semibold"
                                    : "bg-neutral-800 text-neutral-400"
                                }`}
                        >
                            {s}×
                        </button>
                    ))}
                </div>

                {/* Hidden audio element — all playback is controlled via audioRef */}
                <audio ref={audioRef} src={song.URL} />

            </div>
        </div>
    );
}