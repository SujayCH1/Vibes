import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { AudioListContext } from '../context/AudioTracksContext';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { PlayerRouteParams, AudioTrack } from '../types/types';
import { PlaylistContext } from '../context/PlaylistContext';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/Feather';

const Player = () => {
  const route = useRoute<RouteProp<{ params: PlayerRouteParams }, 'params'>>();
  const { trackID } = route.params;
  const navigation = useNavigation();
  const tracks = useContext(AudioListContext);
  const [addState, setAddState] = useState(false);
  const playlists = useContext(PlaylistContext);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackID, setCurrentTrackID] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error('Error initializing audio:', error);
      }
    };

    initAudio();
  }, []);

  useEffect(() => {
    const handleTrackChange = async () => {
      if (trackID !== currentTrackID) {
        if (sound) {
          setIsLoading(true);
          await sound.stopAsync();
          await sound.unloadAsync();
          setSound(null);
          setIsPlaying(false);
          setIsLoading(false);
        }
        setCurrentTrackID(trackID);
      }
    };

    handleTrackChange();
  }, [trackID, currentTrackID, sound]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  if (!trackID || !tracks || !playlists) {
    return <Text style={styles.noTracksText}>Content not available</Text>;
  }

  const { audioList } = tracks;
  const playTrack = audioList.find((track: AudioTrack) => track.ID == trackID);
  const playlistData = playlists.playlists;
  const setPlayListData = playlists.setPlaylists;

  if (!playTrack) {
    return <Text style={styles.noTracksText}>Track not found</Text>;
  }

  const handlePlayPause = async () => {
    try {
      if (!playTrack.trackUrl) {
        console.error('Error: Invalid track URL');
        return;
      }

      setIsLoading(true);

      if (currentTrackID !== trackID) {
        if (sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
          setSound(null);
        }
        setCurrentTrackID(trackID);
      }

      if (sound === null) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          playTrack.trackUrl,
          { shouldPlay: true }
        );

        newSound.setOnPlaybackStatusUpdate(async (status) => {
          if (status.isLoaded) {
            if (status.didJustFinish) {
              setIsPlaying(false);
            }
          }
        });

        setSound(newSound);
        setIsPlaying(true);
      } else {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
      }
    } catch (error) {
      console.error('Error handling playback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setAddState(!addState);
  };

  const handleAddPlaylist = (PID: number) => {
    const selectedPlaylist = playlistData.find((playlist) => playlist.playlistID === PID);

    if (!selectedPlaylist) {
      return;
    }

    const updatedPlaylist = {
      ...selectedPlaylist,
      Playlist: [...selectedPlaylist.Playlist, playTrack],
    };

    setPlayListData(
      playlistData.map((playlist) =>
        playlist.playlistID === PID ? updatedPlaylist : playlist
      )
    );

    setAddState(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="chevron-left" size={24} color="#00Aaff" />
      </TouchableOpacity>

      <View style={styles.trackArt}>
        <Text style={styles.trackArtText}>{playTrack.trackName[0]}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.trackName}>{playTrack.trackName}</Text>
        <Text style={styles.artistName}>{playTrack.artist}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.playButton, isLoading && styles.disabledButton]}
          onPress={handlePlayPause}
          disabled={isLoading}
        >
          <Icon 
            name={isPlaying ? "pause" : "play"} 
            size={32} 
            color="#FFF" 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAdd}
        >
          <Icon name="plus" size={24} color="#00Aaff" />
        </TouchableOpacity>
      </View>

      {addState && (
        <View style={styles.playlistContainer}>
          <Text style={styles.playlistTitle}>Add to Playlist</Text>
          <FlatList
            data={playlistData}
            keyExtractor={(playlist) => playlist.playlistID.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.playlistItem}
                onPress={() => handleAddPlaylist(item.playlistID)}
              >
                <Text style={styles.playlistItemText}>{item.playlistName}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
    backgroundColor: '#121212',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    padding: 12,
    backgroundColor: '#1e1e1e',
    borderRadius: 30,
    zIndex: 1,
  },
  trackArt: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  trackArtText: {
    fontSize: 72,
    color: '#00Aaff',
    fontWeight: 'bold',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  trackName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  artistName: {
    color: '#888',
    fontSize: 18,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#00Aaff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1e1e1e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '50%',
  },
  playlistTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  playlistItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#2a2a2a',
    marginVertical: 4,
    borderRadius: 8,
  },
  playlistItemText: {
    color: '#fff',
    fontSize: 16,
  },
  noTracksText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
  },
});

export default Player;