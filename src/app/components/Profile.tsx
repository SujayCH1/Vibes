import { View, Text, Button, TextInput, FlatList, StyleSheet } from 'react-native';
import React, { useContext, useState } from 'react';
import { PlaylistContext } from '../context/PlaylistContext';
import { useRouter } from 'expo-router';

const Profile = () => {
  const [playlistName, setPlaylistName] = useState('');
  const [playlistID, setPlaylistID] = useState(1);
  const [createState, setCreateState] = useState(false);
  const router = useRouter();

  const Playlists = useContext(PlaylistContext);

  if (!Playlists) {
    return <Text style={styles.noPlaylistsText}>Playlists Not Found</Text>;
  }

  const { playlists, setPlaylists } = Playlists;

  const handleNewPlaylist = () => {
    if (playlistName.trim()) {
      setPlaylists([
        ...playlists,
        {
          playlistID,
          playlistName,
          Playlist: [], // Assuming the playlist will hold song data
        },
      ]);
      setPlaylistID(playlistID + 1); // Increment ID for the next playlist
      setPlaylistName(''); // Reset playlist name input
      setCreateState(false); // Close input field after adding playlist
    } else {
      alert('Please enter a valid playlist name.');
    }
  };

  const handlePlaylistClick = (PID: number) => {
    router.push({
      pathname: '/components/PlaylistComp',
      params: { PID: PID }, // Use correct param name
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Playlists</Text>

      {createState ? (
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter Playlist Name"
            placeholderTextColor="#888"
            style={styles.input}
            value={playlistName}
            onChangeText={(name) => setPlaylistName(name)}
          />
          <Button title="Done" onPress={handleNewPlaylist} color="#00Aaff" />
        </View>
      ) : (
        <Button title="Create New Playlist" onPress={() => setCreateState(true)} color="#00Aaff" />
      )}

      {playlists.length === 0 ? (
        <Text style={styles.noPlaylistsText}>You have no playlists. Create one!</Text>
      ) : (
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.playlistID.toString()}
          renderItem={({ item }) => (
            <View
              style={styles.playlistItem}
              onTouchEnd={() => handlePlaylistClick(item.playlistID)}>
              <Text style={styles.playlistText}>{item.playlistName}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 25,
    letterSpacing: 0.5,
  },
  inputContainer: {
    marginBottom: 25,
  },
  input: {
    height: 55,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 30,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playlistItem: {
    padding: 20,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#00Aaff',
  },
  playlistText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  noPlaylistsText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});

export default Profile;
