import { createContext, useState } from "react";

export const SongContext = createContext();

export const SongContextProvider = ({children}) => {
    const [song, setSong] = useState({
    "_id": {
        "$oid": "69b3ea38a55ccdb93befa6f6"
    },
    "URL": "https://ik.imagekit.io/AbdulGhani/moodify/songs/Wingman_ujC13PZqz.mp3",
    "posterURL": "https://ik.imagekit.io/AbdulGhani/moodify/posters/Wingman_DvLzMfhEY.jpeg",
    "title": "Wingman",
    "mood": "happy"
});
    const [loading, setLoading] = useState(false);

    return <SongContext.Provider value={{song, setSong, loading, setLoading}}>
        {children}
    </SongContext.Provider>
}