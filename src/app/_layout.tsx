import { View, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, Slot } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import { AudioListProvider } from './context/AudioTracksContext';
import { PlaylistContext, PlaylistProvider } from './context/PlaylistContext';

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

      <View style={styles.navbar}>
        <Link
          href={"/"}
          style={[styles.navItem, activeRoute === '/' && styles.activeNavItem]}
          onPress={() => setActiveRoute('/')}
        >
          <Icon name="home" size={28} color={activeRoute === '/' ? "#fff" : "#BBB"} />
        </Link>
        <Link
          href={"/components/Search"}
          style={[styles.navItem, activeRoute === '/Search' && styles.activeNavItem]}
          onPress={() => setActiveRoute('/Search')}
        >
          <Icon name="compass" size={28} color={activeRoute === '/Search' ? "#fff" : "#BBB"} />
        </Link>
        <Link
          href={"/components/Profile"}
          style={[styles.navItem, activeRoute === '/Profile' && styles.activeNavItem]}
          onPress={() => setActiveRoute('/Profile')}
        >
          <Icon name="user" size={28} color={activeRoute === '/Profile' ? "#fff" : "#BBB"} />
        </Link>
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
  },
  navbar: {
    height: 70,
    backgroundColor: '#1f1f1f',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  activeNavItem: {
    backgroundColor: '#00Aaff',
    borderRadius: 15,
    padding: 12,
  },
});

export default Layout;
