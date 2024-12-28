import { createContext, useState } from 'react'
import { AudioListContextType, AudioTrack, AudioListProviderProps } from '../types/types'

const AudioTracks: AudioTrack[] = [
  { trackUrl: require('../../../assets/DrSparklesHowtoWritean80sSitcom.mp3'), trackName: 'How to Write an 80s Sitcom', artist: 'Dr Sparkles', ID: 1 },
  { trackUrl: require('../../../assets/HoliznaCC0MutantClub.mp3'), trackName: 'Mutant Club', artist: 'Holizna CC0', ID: 2 },
  { trackUrl: require('../../../assets/ZaneLittleAlwaysandForever.mp3'), trackName: 'Always and Forever', artist: 'Zane Little', ID: 3 },
  { trackUrl: require('../../../assets/ZaneLittleGotaFeeling.mp3'), trackName: 'Got a Feeling', artist: 'Zane Little', ID: 4 },
  { trackUrl: require('../../../assets/LoboLocoHohHey.mp3'), trackName: 'Hoh Hey', artist: 'Lobo Loco', ID: 5 },
  { trackUrl: require('../../../assets/LoboLocoDrivingtotheDelta.mp3'), trackName: 'Driving to the delta', artist: 'Lobo Loco', ID: 6 },
  { trackUrl: require('../../../assets/NettleBlackEyes.mp3'), trackName: 'Nettle', artist: 'Black Eyes', ID: 7 },
  { trackUrl: require('../../../assets/KathleenMartinHauntedHouseoftheRisingSun.mp3'), trackName: 'Haunted House of the Rising Sun', artist: 'Kathleen Martin', ID: 8 },
  { trackUrl: require('../../../assets/PremierQuartetandCompanyASubmarineAttack.mp3'), trackName: 'A Submarine Attack', artist: 'Premier Quartet and Company', ID: 9 },
  { trackUrl: require('../../../assets/SimonMathewsonLittleBongo.mp3'), trackName: 'Little Bongo', artist: 'Simon Mathewson', ID: 10 },
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
