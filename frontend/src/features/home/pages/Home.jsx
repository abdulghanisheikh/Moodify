import FaceExpressions from "../../Expression/components/FaceExpressions";
import Player from "../components/Player";
import { useSong } from "../hooks/useSong.js";

const Home = () => {
  const { handleGetSong } = useSong();

  return (
    <main>
        <FaceExpressions onClick={(emotion) => handleGetSong({ mood: emotion })} />
        <Player />
    </main>
)
}

export default Home;