import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useContext } from 'react'
import { AudioListContext } from './context/AudioTracksContext'

export default function index() {
  const tracks = useContext(AudioListContext);

  if (!tracks) {
    return <Text style={styles.noTracksText}>No tracks available</Text>;
  }

  const { audioList } = tracks;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Featured Tracks</Text>
      <FlatList
        data={audioList}
        keyExtractor={(item) => item.ID.toString()}
        renderItem={({ item }) => (
          <View style={styles.trackCard}>
            <View style={styles.trackArt}>
              <Text style={styles.trackArtText}>{item.trackName[0]}</Text>
            </View>
            <View style={styles.trackInfo}>
              <Text style={styles.trackName}>{item.trackName}</Text>
              <Text style={styles.artistName}>{item.artist}</Text>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  header: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  trackArt: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00Aaff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  trackArtText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
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