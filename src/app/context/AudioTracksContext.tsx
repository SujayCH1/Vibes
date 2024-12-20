import { createContext, useState } from 'react'
import { AudioListContextType, AudioTrack, AudioListProviderProps } from '../types/types'

const AudioTracks: AudioTrack[] = [
  { trackUrl: 'url1', trackName: 'track1', artist: 'artist1', ID: 1 },
  { trackUrl: 'url2', trackName: 'track2', artist: 'artist2', ID: 2 },
  { trackUrl: 'url3', trackName: 'track3', artist: 'artist3', ID: 3 },
  { trackUrl: 'url4', trackName: 'track4', artist: 'artist4', ID: 4 },
  { trackUrl: 'url5', trackName: 'track5', artist: 'artist5', ID: 5 },
  { trackUrl: 'url6', trackName: 'track6', artist: 'artist6', ID: 6 },
  { trackUrl: 'url7', trackName: 'track7', artist: 'artist7', ID: 7 },
  { trackUrl: 'url8', trackName: 'track8', artist: 'artist8', ID: 8 },
  { trackUrl: 'url9', trackName: 'track9', artist: 'artist9', ID: 9 },
  { trackUrl: 'url10', trackName: 'track10', artist: 'artist10', ID: 10 },
  { trackUrl: 'url11', trackName: 'track11', artist: 'artist11', ID: 11 },
  { trackUrl: 'url12', trackName: 'track12', artist: 'artist12', ID: 12 },
  { trackUrl: 'url13', trackName: 'track13', artist: 'artist13', ID: 13 },
  { trackUrl: 'url14', trackName: 'track14', artist: 'artist14', ID: 14 },
  { trackUrl: 'url15', trackName: 'track15', artist: 'artist15', ID: 15 },
  { trackUrl: 'url16', trackName: 'track16', artist: 'artist16', ID: 16 },
];


export const AudioListContext = createContext<AudioListContextType | undefined>(undefined)

export const AudioListProvider = ({ children }: AudioListProviderProps) => {
  const [audioList, setAudioList] = useState<AudioTrack[]>(AudioTracks)

  return (
    <AudioListContext.Provider value={{ audioList, setAudioList }}>
      {children}
    </AudioListContext.Provider>
  )
}
