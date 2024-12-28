import { FlatList, StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import React, { useContext, useRef, useEffect } from 'react';
import { PlayerRouteParams } from '../types/types';
import { useRoute, RouteProp } from '@react-navigation/native';
import { PlaylistContext } from '../context/PlaylistContext';
import { useNavigation, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';

// Separate track item component for animations
const TrackListItem = React.memo(({
  item,
  index,
  onPress,
  onRemove
}: {
  item: any;
  index: number;
  onPress: () => void;
  onRemove: () => void;
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
      <View style={styles.trackItem}>
        <View style={styles.trackArtContainer}>
          <View style={styles.trackArt}>
            <Text style={styles.trackArtText}>{item.trackName[0]}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.trackInfo}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <Text style={styles.trackName} numberOfLines={1}>{item.trackName}</Text>
          <Text style={styles.artistName} numberOfLines={1}>{item.artist}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={onRemove}
          activeOpacity={0.7}
        >
          <Icon name="trash-2" size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});

const PlaylistComp = () => {
  const route = useRoute<RouteProp<{ params: PlayerRouteParams }, 'params'>>();
  const { PID }: any = route.params;
  const Playlists = useContext(PlaylistContext);
  const router = useRouter();
  const titleFadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    Animated.timing(titleFadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!Playlists || !PID) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={40} color="#666" />
        <Text style={styles.errorText}>Content not available</Text>
      </View>
    );
  }

  const { playlists, setPlaylists } = Playlists;
  const selectedPlaylist = playlists.find((playlist) => playlist.playlistID == PID);

  if (!selectedPlaylist) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={40} color="#666" />
        <Text style={styles.errorText}>Selected playlist not found</Text>
      </View>
    );
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

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <TrackListItem
      item={item}
      index={index}
      onPress={() => handleTrackTouch(item.ID)}
      onRemove={() => handleRemoveTrack(item.ID)}
    />
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Icon name="chevron-left" size={24} color="#00Aaff" />
      </TouchableOpacity>
      <Animated.Text style={[styles.playlistTitle, { opacity: titleFadeAnim }]}>
        {selectedPlaylist.playlistName}
      </Animated.Text>
      {selectedPlaylist.Playlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="music" size={40} color="#666" />
          <Text style={styles.emptyText}>No tracks in this playlist</Text>
        </View>
      ) : (
        <FlatList
          data={selectedPlaylist.Playlist}
          keyExtractor={(track) => track.ID.toString()}
          renderItem={renderItem}
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
    fontFamily: 'System',
    left: 70,
    top: 5
  },
  listContent: {
    paddingBottom: 20,
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
  trackArtContainer: {
    marginRight: 12,
  },
  trackArt: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#00Aaff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackArtText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  trackInfo: {
    flex: 1,
    marginRight: 10,
  },
  trackName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'System',
  },
  artistName: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'System',
  },
  removeButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 12,
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

export default PlaylistComp;