import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Dimensions } from 'react-native';
import React, { useContext, useRef } from 'react';
import { AudioListContext } from './context/AudioTracksContext';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

export default function Home() {
  const tracks = useContext(AudioListContext);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get('window');

  if (!tracks) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={48} color="#888" />
        <Text style={styles.noTracksText}>No tracks available</Text>
      </View>
    );
  }

  const { audioList } = tracks;
  const featuredTracks = audioList.slice(0, 5);

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <LinearGradient
          colors={['#2a2a2a', '#121212']}
          style={styles.gradientBackground}
        >
          {/* Hero Section */}
          <Animated.View style={[styles.hero, { transform: [{ scale: headerScale }] }]}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.heroText}>Discover Your Soundtrack</Text>
            <TouchableOpacity style={styles.heroButton}>
              <Icon name="play" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.heroButtonText}>Start Listening</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Featured Section */}
          <View style={styles.featuredSection}>
            <Text style={styles.sectionHeader}>Featured Tracks</Text>
            <FlatList
              horizontal
              data={featuredTracks}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.ID.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={[styles.featuredCard, { width: width * 0.7 }]}>
                  <LinearGradient
                    colors={['#00Aaff20', '#00Aaff10']}
                    style={styles.featuredGradient}
                  >
                    <Icon name="music" size={32} color="#00Aaff" />
                    <View style={styles.featuredInfo}>
                      <Text style={styles.featuredTrackName}>{item.trackName}</Text>
                      <Text style={styles.featuredArtistName}>{item.artist}</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* All Tracks */}
          <View style={styles.allTracksSection}>
            <Text style={styles.sectionHeader}>All Tracks</Text>
            {audioList.map((item) => (
              <TouchableOpacity key={item.ID} style={styles.trackCard}>
                <View style={styles.trackIconContainer}>
                  <Icon name="music" size={24} color="#00Aaff" />
                </View>
                <View style={styles.trackInfo}>
                  <Text style={styles.trackName}>{item.trackName}</Text>
                  <Text style={styles.artistName}>{item.artist}</Text>
                </View>
                <TouchableOpacity style={styles.playButton}>
                  <Icon name="play" size={20} color="#fff" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  gradientBackground: {
    flex: 1,
    paddingTop: 60,
  },
  hero: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    color: '#888',
    fontSize: 16,
    marginBottom: 8,
  },
  heroText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  heroButton: {
    backgroundColor: '#00Aaff',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  heroButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featuredSection: {
    paddingVertical: 20,
  },
  sectionHeader: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  featuredCard: {
    marginLeft: 20,
    marginBottom: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  featuredGradient: {
    padding: 20,
    height: 180,
    justifyContent: 'space-between',
  },
  featuredInfo: {
    marginTop: 'auto',
  },
  featuredTrackName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featuredArtistName: {
    color: '#888',
    fontSize: 16,
  },
  allTracksSection: {
    padding: 20,
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  trackIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
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
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00Aaff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noTracksText: {
    color: '#888',
    fontSize: 16,
    marginTop: 16,
  },
});