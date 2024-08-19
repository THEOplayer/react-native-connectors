import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swimlane } from "./components/Swimlane";
import {
  ClusterEntity,
  ClusterType,
  ContinuationClusterConfig,
  EngageEventType,
  LiveStream,
  Movie,
  SignIn,
  TvEpisode,
  useCluster,
  useEngage
} from "@theoplayer/react-native-engage";
import movies from "./res/movies.json";
import episodes from "./res/episodes.json";
import livestreams from "./res/livestreams.json";
import signin from "./res/signin.json";

const engageConfig = {
  debug: true
}

const continuationConfig: ContinuationClusterConfig = {
  accountProfile: {
    accountId: 'accountId',
    profileId: 'profileId'
  },
  syncAcrossDevices: false
}

export default function App() {
  const engage = useEngage(engageConfig);
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const continuationCluster = useCluster(engage, ClusterType.Continuation, continuationConfig);
  const featuredCluster = useCluster(engage, ClusterType.Featured);

  useEffect(() => {
    engage?.addEventListener(EngageEventType.Error, console.error);
    return () => engage?.removeEventListener(EngageEventType.Error, console.error);
  }, [engage]);

  useEffect(() => {
    // Add some items to the Featured cluster.
    featuredCluster?.addEntity(movies[0] as Movie);
    featuredCluster?.addEntity(livestreams[0] as LiveStream);
    featuredCluster?.addEntity(episodes[0] as TvEpisode);
  }, [featuredCluster]);

  const addContinuationEntity = useCallback((entity: ClusterEntity) => {
    continuationCluster?.addEntity(entity);
  }, [continuationCluster]);

  const removeContinuationEntity = useCallback((entity: ClusterEntity) => {
    continuationCluster?.removeEntity(entity);
  }, [continuationCluster]);

  const clearContinuationCluster = useCallback(() => {
    engage?.clearCluster(ClusterType.Continuation);
  }, [engage]);

  const clearFeaturedCluster = useCallback(() => {
    engage?.clearCluster(ClusterType.Featured);
  }, [engage]);


  const toggleSigning = useCallback(() => {
    setSignedIn(signedIn => {
      // engage?.setSignInEntity(signedIn ? null : signin as SignIn);
      return !signedIn;
    });
  }, []);

  return (
    <SafeAreaView style={[StyleSheet.absoluteFill, {backgroundColor: '#000000', paddingTop: 25}]}>
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Engage Demo</Text>
        <TouchableOpacity onPress={toggleSigning}>
          <Text style={styles.signInButton}>{signedIn ? "Sign out" : "Sign in"}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {/* The Continuation cluster; tap to delete items */}
        {continuationCluster?.entities.length > 0 &&
          <Swimlane style={styles.cluster}
                    data={continuationCluster?.entities}
                    title={"Continuation"}
                    onTap={removeContinuationEntity}
                    onDelete={clearContinuationCluster}/>}
        {/* The Featured cluster with fixed items */}
        {featuredCluster?.entities.length > 0 &&
          <Swimlane style={styles.cluster}
                    data={featuredCluster?.entities}
                    title={"Featured"}
                    onTap={addContinuationEntity}
                    onDelete={clearFeaturedCluster}/>}
        <Swimlane style={styles.cluster}
                  data={movies as unknown as Movie[]}
                  title={"Movies"}
                  onTap={addContinuationEntity}/>
        <Swimlane style={styles.cluster}
                  data={episodes as TvEpisode[]}
                  title={"Tv Shows"}
                  onTap={addContinuationEntity}/>
        <Swimlane style={styles.cluster}
                  data={livestreams as LiveStream[]}
                  title={"Live"}
                  onTap={addContinuationEntity}/>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 20
  },
  signInButton: {
    color: 'white',
    fontSize: 22,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white'
  },
  cluster: {
    marginVertical: 10,
    height: 240
  },
});
