import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import { PlayerRouteParams } from '../types/types';
import { useRoute, RouteProp } from '@react-navigation/native';
import { PlaylistContext } from '../context/PlaylistContext';
import { useRouter } from 'expo-router';

const PlaylistComp = () => {
  const route = useRoute<RouteProp<{ params: PlayerRouteParams }, 'params'>>();
  const { PID } = route.params;
  const Playlists = useContext(PlaylistContext);
  const router = useRouter()

  if (!Playlists) {
    return <Text>Playlists not found</Text>;
  }

  if (!PID) {
    return <Text>PID not found</Text>;
  }

  const { playlists } = Playlists;

  const selectedPlaylist = playlists.find((playlist) => playlist.playlistID == PID);

  if (!selectedPlaylist) {
    return <Text>Selected playlist not found</Text>;
  }

  const handleTrackTouch = (trackID: number) => {
    router.push({
        pathname: '/components/Player',
        params: {trackID: trackID}
    })
  }

  return (
    <View>
      <Text style={styles.playlistTitle}>{selectedPlaylist.playlistName}</Text>
      {selectedPlaylist.Playlist.length === 0 ? (
        <Text>No tracks in this playlist</Text>
      ) : (
        <FlatList
          data={selectedPlaylist.Playlist}
          keyExtractor={(track) => track.ID.toString()}
          renderItem={({ item }) => (
            <View style={styles.trackItem} onTouchEnd={() => handleTrackTouch(item.ID)}>
              <Text style={styles.trackName}>{item.trackName}</Text>
              <Text style={styles.artistName}>{item.artist}</Text>
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
    paddingHorizontal: 20,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
});

export default PlaylistComp;
