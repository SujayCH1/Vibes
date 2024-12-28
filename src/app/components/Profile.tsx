import { View, Text, TextInput, FlatList, StyleSheet, Animated, Pressable, Button, TouchableOpacity, Alert } from 'react-native';
import React, { useContext, useState, useRef, useEffect } from 'react';
import { PlaylistContext } from '../context/PlaylistContext';
import { useNavigation, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import { PlaylistItemProps } from '../types/types';



const PlaylistItem: React.FC<PlaylistItemProps> = React.memo(({
  item,
  index,
  onPress,
  onDelete
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, [index]);

  const handleDelete = () => {
    Alert.alert(
      "Delete Playlist",
      `Are you sure you want to delete "${item.playlistName}"?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: onDelete,
          style: "destructive"
        }
      ]
    );
  };

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          }],
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.playlistItem,
          pressed && styles.playlistItemPressed
        ]}
      >
        <View style={styles.playlistIcon}>
          <Icon name="music" size={20} color="#fff" />
        </View>
        <View style={styles.playlistInfo}>
          <Text style={styles.playlistText} numberOfLines={1}>{item.playlistName}</Text>
          <Text style={styles.trackCount}>
            {item.Playlist.length} {item.Playlist.length === 1 ? 'track' : 'tracks'}
          </Text>
        </View>
        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.deleteButtonPressed
          ]}
          hitSlop={8}
        >
          <Icon name="trash-2" size={20} color="#ff4444" />
        </Pressable>
        <Icon name="chevron-right" size={20} color="#666" style={styles.chevron} />
      </Pressable>
    </Animated.View>
  );
});

const Profile = () => {
  const [playlistName, setPlaylistName] = useState('');
  const [playlistID, setPlaylistID] = useState(1);
  const [createState, setCreateState] = useState(false);
  const router = useRouter();
  const titleFadeAnim = useRef(new Animated.Value(0)).current;
  const createButtonAnim = useRef(new Animated.Value(1)).current;

  const Playlists = useContext(PlaylistContext);

  useEffect(() => {
    Animated.timing(titleFadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!Playlists) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={40} color="#666" />
        <Text style={styles.errorText}>Playlists Not Found</Text>
      </View>
    );
  }

  const { playlists, setPlaylists } = Playlists;

  const handleNewPlaylist = () => {
    if (playlistName.trim()) {
      setPlaylists([
        ...playlists,
        {
          playlistID,
          playlistName,
          Playlist: [],
        },
      ]);
      setPlaylistID(playlistID + 1);
      setPlaylistName('');
      setCreateState(false);
    } else {
      alert('Please enter a valid playlist name.');
    }
  };

  const handlePlaylistClick = (PID: number) => {
    router.push({
      pathname: '/components/PlaylistComp',
      params: { PID: PID },
    });
  };

  const handleDeletePlaylist = (playlistID: number) => {
    setPlaylists(playlists.filter(playlist => playlist.playlistID !== playlistID));
  };

  const toggleCreateState = () => {
    Animated.sequence([
      Animated.timing(createButtonAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(createButtonAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => setCreateState(true));
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.title, { opacity: titleFadeAnim }]}>
        Your Playlists
      </Animated.Text>

      {createState ? (
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter Playlist Name"
            placeholderTextColor="#888"
            style={styles.input}
            value={playlistName}
            onChangeText={setPlaylistName}
            autoFocus={true}
          />
          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                pressed && styles.buttonPressed
              ]}
              onPress={() => setCreateState(false)}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.createButton,
                pressed && styles.buttonPressed
              ]}
              onPress={handleNewPlaylist}
            >
              <Text style={styles.buttonText}>Create Playlist</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Animated.View style={{ transform: [{ scale: createButtonAnim }] }}>
          <Pressable
            style={({ pressed }) => [
              styles.createNewButton,
              pressed && styles.createNewButtonPressed
            ]}
            onPress={toggleCreateState}
          >
            <Icon name="plus" size={20} color="#fff" />
            <Text style={styles.createNewButtonText}>Create New Playlist</Text>
          </Pressable>
        </Animated.View>
      )}

      {playlists.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="music" size={40} color="#666" />
          <Text style={styles.noPlaylistsText}>You have no playlists. Create one!</Text>
        </View>
      ) : (
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.playlistID.toString()}
          renderItem={({ item, index }) => (
            <PlaylistItem
              item={item}
              index={index}
              onPress={() => handlePlaylistClick(item.playlistID)}
              onDelete={() => handleDeletePlaylist(item.playlistID)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
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
    fontFamily: 'System',
    left: 70,
  },
  inputContainer: {
    marginBottom: 25,
    marginTop: 15,
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
    fontFamily: 'System',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  cancelButton: {
    backgroundColor: '#2a2a2a',
  },
  createButton: {
    backgroundColor: '#00Aaff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  cancelButtonText: {
    color: '#888',
  },
  createNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00Aaff',
    height: 45,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 8,
  },
  createNewButtonPressed: {
    backgroundColor: '#0095e0',
  },
  createNewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#00Aaff',
  },
  playlistItemPressed: {
    backgroundColor: '#252525',
    transform: [{ scale: 0.98 }],
  },
  playlistIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00Aaff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'System',
  },
  trackCount: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'System',
  },
  chevron: {
    opacity: 0.8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPlaylistsText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'System',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'System',
  },
  listContent: {
    paddingBottom: 20,
  },
  deleteButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButtonPressed: {
    opacity: 0.7,
  },
});

export default Profile;