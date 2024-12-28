import { FlatList, StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions } from 'react-native';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { AudioListContext } from '../context/AudioTracksContext';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { PlayerRouteParams, AudioTrack } from '../types/types';
import { PlaylistContext } from '../context/PlaylistContext';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/Feather';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const Player = () => {
  const route = useRoute<RouteProp<{ params: PlayerRouteParams }, 'params'>>();
  const { trackID, PID } = route.params;
  const navigation = useNavigation();
  const tracks = useContext(AudioListContext);
  const [addState, setAddState] = useState(false);
  const playlists = useContext(PlaylistContext);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackID, setCurrentTrackID] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.setValue(0);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (addState) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [addState]);


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

  const handleNext = () => {
    if (PID === undefined) return; // Exit if no playlist ID

    const selectedPlaylist = playlists.playlists.find((playlist) => playlist.playlistID == PID);
    if (!selectedPlaylist || !selectedPlaylist.Playlist) return; // Exit if no playlist or no tracks

    const currentTrackIndex = selectedPlaylist.Playlist.findIndex((track) => track.ID == currentTrackID);
    const nextTrackIndex = currentTrackIndex + 1;

    // Check if next track exists in the playlist
    if (nextTrackIndex < selectedPlaylist.Playlist.length) {
      const nextTrack = selectedPlaylist.Playlist[nextTrackIndex];
      setCurrentTrackID(nextTrack.ID);
      router.navigate({
        pathname: '/components/Player',
        params: { trackID: nextTrack.ID, PID },
      });
    }
  };

  const handlePrev = () => {
    if (PID === undefined) return; // Exit if no playlist ID

    const selectedPlaylist = playlists.playlists.find((playlist) => playlist.playlistID == PID);
    if (!selectedPlaylist || !selectedPlaylist.Playlist) return; // Exit if no playlist or no tracks

    const currentTrackIndex = selectedPlaylist.Playlist.findIndex((track) => track.ID == currentTrackID);
    const prevTrackIndex = currentTrackIndex - 1;

    // Check if previous track exists in the playlist
    if (prevTrackIndex >= 0) {
      const prevTrack = selectedPlaylist.Playlist[prevTrackIndex];
      setCurrentTrackID(prevTrack.ID);
      router.navigate({
        pathname: '/components/Player',
        params: { trackID: prevTrack.ID, PID },
      });
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const slideUp = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  return (
    <LinearGradient
      colors={['#1e1e1e', '#121212']}
      style={styles.container}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Icon name="chevron-left" size={24} color="#00Aaff" />
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.trackArt,
          { transform: [{ rotate: spin }] }
        ]}
      >
        <LinearGradient
          colors={['#00Aaff', '#0088cc']}
          style={styles.trackArtInner}
        >
          <Text style={styles.trackArtText}>{playTrack?.trackName[0]}</Text>
        </LinearGradient>
      </Animated.View>

      <View style={styles.infoContainer}>
        <Text style={styles.trackName} numberOfLines={1}>
          {playTrack?.trackName}
        </Text>
        <Text style={styles.artistName} numberOfLines={1}>
          {playTrack?.artist}
        </Text>
      </View>

      <View style={styles.controls}>
        {PID !== undefined && (
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handlePrev}
          >
            <Icon name="skip-back" size={24} color="#fff" />
          </TouchableOpacity>
        )}

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

        {PID !== undefined ? (
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => handleNext()}
          >
            <Icon name="skip-forward" size={24} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleAdd}
          >
            <Icon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <Animated.View
        style={[
          styles.playlistContainer,
          { transform: [{ translateY: slideUp }] }
        ]}
      >
        <View style={styles.playlistHeader}>
          <Text style={styles.playlistTitle}>Add to Playlist</Text>
          <TouchableOpacity onPress={() => setAddState(false)}>
            <Icon name="x" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={playlistData}
          keyExtractor={(playlist) => playlist.playlistID.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.playlistItem}
              onPress={() => handleAddPlaylist(item.playlistID)}
            >
              <Text style={styles.playlistItemText}>{item.playlistName}</Text>
              <Icon name="plus" size={20} color="#00Aaff" />
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  trackArt: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    marginTop: 80,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  trackArtInner: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackArtText: {
    fontSize: width * 0.2,
    color: '#fff',
    fontWeight: 'bold',
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  trackName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  artistName: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 18,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#00Aaff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00Aaff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.5,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  playlistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  playlistTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playlistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 4,
    borderRadius: 8,
  },
  playlistItemText: {
    color: '#fff',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 30,
    zIndex: 1,
  },
});

export default Player;