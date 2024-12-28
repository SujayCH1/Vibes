import { View, Text, TextInput, StyleSheet, Animated, Pressable } from 'react-native';
import React, { useContext, useState, useRef, useEffect } from 'react';
import { AudioListContext } from '../context/AudioTracksContext';
import { AudioTrack } from '../types/types';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';

const TrackListItem = React.memo(({ 
  item, 
  index, 
  onPress 
}: { 
  item: AudioTrack; 
  index: number;
  onPress: () => void;
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
      <Pressable
        style={({ pressed }) => [
          styles.trackItem,
          pressed && styles.trackItemPressed,
        ]}
        onPress={onPress}
      >
        <View style={styles.trackArt}>
          <Text style={styles.trackArtText}>{item.trackName[0]}</Text>
        </View>
        <View style={styles.trackInfo}>
          <Text style={styles.trackName} numberOfLines={1}>{item.trackName}</Text>
          <Text style={styles.artistName} numberOfLines={1}>{item.artist}</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#666" style={styles.chevron} />
      </Pressable>
    </Animated.View>
  );
});

const Search = () => {
  const tracks = useContext(AudioListContext);
  const router = useRouter();
  const [searchItems, setSearchItems] = useState('');
  const [filteredAudioList, setFilteredAudioList] = useState<AudioTrack[]>(tracks?.audioList || []);
  const searchInputAnim = useRef(new Animated.Value(0)).current;

  if (!tracks) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={40} color="#666" />
        <Text style={styles.noTracksText}>Tracks not available</Text>
      </View>
    );
  }

  const handleSearchFilter = (searchText: string) => {
    setSearchItems(searchText);
    const filteredList = tracks.audioList.filter((audio) => {
      return (
        audio.artist.toLowerCase().includes(searchText.toLowerCase()) ||
        audio.trackName.toLowerCase().includes(searchText.toLowerCase())
      );
    });
    setFilteredAudioList(filteredList);

    Animated.spring(searchInputAnim, {
      toValue: searchText.length > 0 ? 1 : 0,
      useNativeDriver: true,
    }).start();
  };

  const renderItem = ({ item, index }: { item: AudioTrack; index: number }) => (
    <TrackListItem
      item={item}
      index={index}
      onPress={() => router.push({
        pathname: '/components/Player',
        params: { trackID: item.ID, PID: undefined }
      })}
    />
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.searchContainer,
        {
          transform: [{
            scale: searchInputAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.02],
            }),
          }],
        },
      ]}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          value={searchItems}
          onChangeText={handleSearchFilter}
          placeholder="Search tracks or artists"
          placeholderTextColor="#666"
          style={styles.searchInput}
        />
        {searchItems.length > 0 && (
          <Pressable 
            onPress={() => handleSearchFilter('')}
            style={({ pressed }) => [
              styles.clearButton,
              pressed && { opacity: 0.7 }
            ]}
          >
            <Icon name="x" size={20} color="#666" />
          </Pressable>
        )}
      </Animated.View>

      <Animated.FlatList
        data={filteredAudioList}
        keyExtractor={(item) => item.ID.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          searchItems.length > 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="search" size={40} color="#666" />
              <Text style={styles.emptyText}>No results found</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#121212',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: '#1e1e1e',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'System',
  },
  clearButton: {
    padding: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4,
  },
  trackItemPressed: {
    backgroundColor: '#252525',
    transform: [{ scale: 0.98 }],
  },
  trackArt: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#00Aaff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  chevron: {
    opacity: 0.8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  noTracksText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'System',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginTop: 12,
    fontFamily: 'System',
  },
});

export default Search;