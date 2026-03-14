import { getSong } from "../services/song.api.js";
import { useContext } from "react";
import { SongContext } from "../song.context";

export function useSong() {
    const context = useContext(SongContext);

    const { song, setSong, loading, setLoading } = context;

    async function handleGetSong({mood}) {
        setLoading(true);
        
        const res = await getSong({mood});
        const {data} = res;

        setSong(data.song);
        setLoading(false);
    }

    return { song, loading, handleGetSong };
}