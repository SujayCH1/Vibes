import { ReactNode, Dispatch, SetStateAction } from 'react';

// global types
export type AudioTrack = {
  trackUrl: string;
  trackName: string;
  artist: string;
  ID: number;
};

export type Playlist = {
  Playlist: AudioTrack[];
  playlistID: number
  playlistName: string
};

// audio context types
export type AudioListContextType = {
  audioList: AudioTrack[];
  setAudioList: Dispatch<SetStateAction<AudioTrack[]>>;
};

export type AudioListProviderProps = {
  children: ReactNode;
};

// playlist context types
export type PlaylistContextType = {
  playlists: Playlist[];
  setPlaylists: Dispatch<SetStateAction<Playlist[]>>;
};

export type PlayListProviderProps = {
  children: ReactNode; 
};

//currentMusic context types

export type CurrentMusicContextType = {
  currentMusic: AudioTrack
  setCurrentMusic: Dispatch<SetStateAction<AudioTrack>>
}

export type CurrentMusicProviderProps = {
  children: ReactNode
}

// route params
export type PlayerRouteParams = {
  trackID: number;
};
