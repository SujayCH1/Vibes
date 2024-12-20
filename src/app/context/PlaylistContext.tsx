import { createContext, useState } from "react";
import { AudioTrack, Playlist, PlaylistContextType, PlayListProviderProps } from "../types/types";

const PlayLists: Playlist[] = [];

export const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider = ({ children }: PlayListProviderProps) => {
  const [playlists, setPlaylists] = useState<Playlist[]>(PlayLists);

  return (
    <PlaylistContext.Provider value={{ playlists, setPlaylists }}>
      {children}
    </PlaylistContext.Provider>
  );
};
