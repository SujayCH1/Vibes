import { View, Text, TextInput, FlatList, StyleSheet, Animated } from 'react-native';
import React, { useContext, useState } from 'react';
import { AudioListContext } from '../context/AudioTracksContext';
import { AudioTrack } from '../types/types';
import { useRouter } from 'expo-router';

const Search = () => {
  const tracks = useContext(AudioListContext);
  const router = useRouter()

  if (!tracks) {
    return <Text style={styles.noTracksText}>Tracks not available</Text>;
  }

  const { audioList, setAudioList } = tracks;
  const [searchItems, setSearchItems] = useState('');
  const [filteredAudioList, setFilteredAudioList] = useState<AudioTrack[]>(audioList);

  const handleSearchFilter = (searchText: string) => {
    setSearchItems(searchText);
    const filteredList = audioList.filter((audio) => {
      return (
        audio.artist.toLowerCase().includes(searchText.toLowerCase()) ||
        audio.trackName.toLowerCase().includes(searchText.toLowerCase())
      );
    });
    setFilteredAudioList(filteredList);
  };

  const handleTrackTouch = (trackID: number) => {
    router.push({
        pathname: '/components/Player',
        params: {trackID: trackID}
    })
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={searchItems}
        onChangeText={handleSearchFilter}
        placeholder="Search by artist or track name"
        style={styles.searchInput}
      />
      {/* Use Animated FlatList for smoother scroll and list updates */}
      <Animated.FlatList
        data={filteredAudioList}
        keyExtractor={(item) => item.ID.toString()}
        renderItem={({ item }) => (
          <View style={styles.trackItem} onTouchEnd={() => handleTrackTouch(item.ID)}>
            <Text style={styles.trackName}>{item.trackName}</Text>
            <Text style={styles.artistName}>{item.artist}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" 
        scrollEventThrottle={16} 
      />
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
  searchInput: {
    height: 55,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 15,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
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
  noTracksText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});

export default Search;
