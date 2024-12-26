import { View, Text, TextInput, StyleSheet, Animated, Pressable } from 'react-native';
import React, { useContext, useState } from 'react';
import { AudioListContext } from '../context/AudioTracksContext';
import { AudioTrack } from '../types/types';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';

const Search = () => {
  const tracks = useContext(AudioListContext);
  const router = useRouter();
  const [searchItems, setSearchItems] = useState('');
  const [filteredAudioList, setFilteredAudioList] = useState<AudioTrack[]>(tracks?.audioList || []);

  if (!tracks) {
    return <Text style={styles.noTracksText}>Tracks not available</Text>;
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          value={searchItems}
          onChangeText={handleSearchFilter}
          placeholder="Search tracks or artists"
          placeholderTextColor="#666"
          style={styles.searchInput}
        />
        {searchItems.length > 0 && (
          <Pressable onPress={() => handleSearchFilter('')}>
            <Icon name="x" size={20} color="#666" />
          </Pressable>
        )}
      </View>

      <Animated.FlatList
        data={filteredAudioList}
        keyExtractor={(item) => item.ID.toString()}
        renderItem={({ item }) => (
          <Pressable 
            style={({ pressed }) => [
              styles.trackItem,
              pressed && styles.trackItemPressed
            ]}
            onPress={() => router.push({
              pathname: '/components/Player',
              params: { trackID: item.ID, PID: undefined }
            })}
          >
            <View style={styles.trackArt}>
              <Text style={styles.trackArtText}>{item.trackName[0]}</Text>
            </View>
            <View style={styles.trackInfo}>
              <Text style={styles.trackName} numberOfLines={1}>{item.trackName}</Text>
              <Text style={styles.artistName} numberOfLines={1}>{item.artist}</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#666" />
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
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
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
  },
  trackItemPressed: {
    backgroundColor: '#252525',
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