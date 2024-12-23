import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { AudioListContext } from './context/AudioTracksContext';

export default function Home() {
  const tracks = useContext(AudioListContext);

  if (!tracks) {
    return <Text style={styles.noTracksText}>No tracks available</Text>;
  }

  const { audioList } = tracks;

  return (
    <View style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroText}>Discover Your Soundtrack</Text>
        <TouchableOpacity style={styles.heroButton}>
          <Text style={styles.heroButtonText}>Start Listening</Text>
        </TouchableOpacity>
      </View>

      {/* Featured Tracks */}
      <Text style={styles.sectionHeader}>Featured Tracks</Text>
      <FlatList
        data={audioList}
        keyExtractor={(item) => item.ID.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.trackCard}>
            <View style={styles.trackInfo}>
              <Text style={styles.trackName}>{item.trackName}</Text>
              <Text style={styles.artistName}>{item.artist}</Text>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  hero: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  heroButton: {
    backgroundColor: '#00Aaff',
    padding: 15,
    borderRadius: 8,
  },
  heroButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeader: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  trackCard: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#1e1e1e',
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
  noTracksText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
