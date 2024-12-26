import { View, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, Slot } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { AudioListProvider } from './context/AudioTracksContext';
import { PlaylistProvider } from './context/PlaylistContext';

const Layout = () => {
  const [activeRoute, setActiveRoute] = React.useState('/');

  return (
    <SafeAreaView style={styles.container}>
      <PlaylistProvider>
        <AudioListProvider>
          <View style={styles.content}>
            <Slot />
          </View>
        </AudioListProvider>
      </PlaylistProvider>

      <View style={styles.navbarContainer}>
        <LinearGradient
          colors={['#148be0', '#4a747d']}
          style={styles.navbarBackground}
        />
        <View style={styles.navbar}>
          <Link
            href={"/"}
            style={[styles.navItem, activeRoute === '/' && styles.activeNavItem]}
            onPress={() => setActiveRoute('/')}
          >
            <Icon
              name="home"
              size={24}
              color={activeRoute === '/' ? "#121212" : "#ffffff"}
            />
          </Link>
          <Link
            href={"/components/Search"}
            style={[styles.navItem, activeRoute === '/Search' && styles.activeNavItem]}
            onPress={() => setActiveRoute('/Search')}
          >
            <Icon
              name="compass"
              size={24}
              color={activeRoute === '/Search' ? "#121212" : "#ffffff"}
            />
          </Link>
          <Link
            href={"/components/Profile"}
            style={[styles.navItem, activeRoute === '/Profile' && styles.activeNavItem]}
            onPress={() => setActiveRoute('/Profile')}
          >
            <Icon
              name="user"
              size={24}
              color={activeRoute === '/Profile' ? "#121212" : "#ffffff"}
            />
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    marginBottom: 65,
  },
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navbarBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 12,
  },
  navbar: {
    height: 65,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
  },
  activeNavItem: {
    backgroundColor: '#ffffff',
    transform: [{ scale: 1.05 }],
  },
});

export default Layout;