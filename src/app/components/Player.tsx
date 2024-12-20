import { Button, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useContext, useState } from 'react';
import { AudioListContext } from '../context/AudioTracksContext';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { PlayerRouteParams, AudioTrack } from '../types/types';
import { PlaylistContext } from '../context/PlaylistContext';

const Player = () => {
  const route = useRoute<RouteProp<{ params: PlayerRouteParams }, 'params'>>();
  const { trackID } = route.params;
  const navigation = useNavigation(); // Access the navigation object
  const tracks = useContext(AudioListContext);
  const [addState, setAddState] = useState(false);
  const playlists = useContext(PlaylistContext);

  if (!trackID) {
    return <Text style={styles.noTracksText}>Track ID not available</Text>;
  }

  if (!tracks) {
    return <Text style={styles.noTracksText}>Tracks not available</Text>;
  }

  if (!playlists) {
    return <Text>Playlists not found</Text>;
  }

  const { audioList } = tracks;
  const playTrack = audioList.find((track: AudioTrack) => track.ID == trackID);
  const playlistData = playlists.playlists;
  const setPlayListData = playlists.setPlaylists;

  if (!playTrack) {
    return <Text style={styles.noTracksText}>Track not found</Text>;
  }

  const handleAdd = () => {
    setAddState(!addState); // Toggle the add state to show/hide playlist
  };

  const handleAddPlaylist = (PID: number) => {
    const selectedPlaylist = playlistData.find((playlist) => playlist.playlistID == PID);

    if (!selectedPlaylist) {
      console.log('Playlist not found');
      return;
    }

    const updatedPlaylist = {
      ...selectedPlaylist,
      Playlist: [...selectedPlaylist.Playlist, playTrack], // Add the selected track
    };

    // Update the playlists context
    setPlayListData(
      playlistData.map((playlist) =>
        playlist.playlistID === PID ? updatedPlaylist : playlist
      )
    );

    setAddState(false); // Close the playlist menu after adding
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Track Info */}
      <Text style={styles.trackName}>{playTrack.trackName}</Text>
      <Text style={styles.artistName}>{playTrack.artist}</Text>
      <Button title="Add to playlist" onPress={handleAdd} />

      {/* Playlist Add Menu */}
      {addState && (
        <View>
          <FlatList
            data={playlistData}
            keyExtractor={(playlist) => playlist.playlistID.toString()}
            renderItem={({ item }) => (
              <View onTouchEnd={() => handleAddPlaylist(item.playlistID)}>
                <Text style={styles.playlistItem}>{item.playlistName}</Text>
              </View>
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
  backButtonText: {
    color: '#00Aaff',
    fontSize: 16,
    fontWeight: '600',
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
    marginBottom: 30,
    textAlign: 'center',
  },
  noTracksText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
  },
  playlistItem: {
    color: '#fff',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#1e1e1e',
    marginVertical: 4,
    borderRadius: 8,
  },
});

export default Player;
