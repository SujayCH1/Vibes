import { create } from "lodash";
import { AudioTrack, CurrentMusicContextType, CurrentMusicProviderProps } from "../types/types";
import { createContext, useState } from "react";

const CurrentMusicContext = createContext<CurrentMusicContextType | undefined>(undefined);
const currentlyPlaying: AudioTrack = {
    trackUrl: '',
    trackName: '',
    artist: '',
    ID: 0
};

const CurrentMusicProvider = ({ children }: CurrentMusicProviderProps) => {
    const [currentMusic, setCurrentMusic] = useState<AudioTrack>(currentlyPlaying);

    return (
        <CurrentMusicContext.Provider value={{ currentMusic, setCurrentMusic }}>
            {children}
        </CurrentMusicContext.Provider>
    );
};

