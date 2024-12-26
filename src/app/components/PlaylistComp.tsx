import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { PlayerRouteParams } from '../types/types';
import { useRoute, RouteProp } from '@react-navigation/native';
import { PlaylistContext } from '../context/PlaylistContext';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';

const PlaylistComp = () => {
  const route = useRoute<RouteProp<{ params: PlayerRouteParams }, 'params'>>();
  const { PID }: any = route.params;
  const Playlists = useContext(PlaylistContext);
  const router = useRouter();

  if (!Playlists || !PID) {
    return <Text>Content not available</Text>;
  }

  const { playlists, setPlaylists } = Playlists;
  const selectedPlaylist = playlists.find((playlist) => playlist.playlistID == PID);

  if (!selectedPlaylist) {
    return <Text>Selected playlist not found</Text>;
  }

  const handleTrackTouch = (trackID: number) => {
    router.push({
      pathname: '/components/Player',
      params: { trackID: trackID, PID: PID }
    });
  };

  const handleRemoveTrack = (trackID: number) => {
    const updatedPlaylists = playlists.map(playlist => {
      if (playlist.playlistID == PID) {
        return {
          ...playlist,
          Playlist: playlist.Playlist.filter(track => track.ID != trackID)
        };
      }
      return playlist;
    });
    setPlaylists(updatedPlaylists);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.playlistTitle}>{selectedPlaylist.playlistName}</Text>
      {selectedPlaylist.Playlist.length === 0 ? (
        <Text style={styles.emptyText}>No tracks in this playlist</Text>
      ) : (
        <FlatList
          data={selectedPlaylist.Playlist}
          keyExtractor={(track) => track.ID.toString()}
          renderItem={({ item }) => (
            <View style={styles.trackItem}>
              <TouchableOpacity 
                style={styles.trackInfo} 
                onPress={() => handleTrackTouch(item.ID)}
              >
                <Text style={styles.trackName}>{item.trackName}</Text>
                <Text style={styles.artistName}>{item.artist}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => handleRemoveTrack(item.ID)}
              >
                <Icon name="x" size={20} color="#ff4444" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  playlistTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 25,
    textAlign: 'left',
    letterSpacing: 0.5,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  artistName: {
    color: '#888',
    fontSize: 14,
  },
  removeButton: {
    padding: 8,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 16,
  }
});

export default PlaylistComp;