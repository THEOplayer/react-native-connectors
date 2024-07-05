import * as React from 'react';

import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { Swimlane } from "./components/Swimlane";
import {
  EngageEventType, LiveStream,
  Movie,
  TvEpisode,
  useContinuation,
  useEngage
} from "@theoplayer/react-native-engage";
import movies from "./res/movies.json";
import episodes from "./res/episodes.json";
import livestreams from "./res/livestreams.json";
import { useEffect } from "react";

const engageConfig = {
  debug: true
}

export default function App() {
  const engage = useEngage(engageConfig);

  useEffect(() => {
    engage.current?.addEventListener(EngageEventType.ERROR, console.error);
    return () =>  engage.current?.removeEventListener(EngageEventType.ERROR, console.error);
  }, [engage.current]);

  const [continuation, addToContinuation, removeFromContinuation] = useContinuation(engage);

  return (
    <SafeAreaView style={[StyleSheet.absoluteFill, {backgroundColor: '#000000', paddingTop: 25}]}>
      <Text style={styles.pageTitle}>Engage Demo</Text>
      <ScrollView>
        {continuation.length > 0 &&
          <Swimlane style={styles.cluster} data={continuation} title={"Continuation (tap to remove)"} onTap={removeFromContinuation}/>}
        <Swimlane style={styles.cluster} data={movies as unknown as Movie[]} title={"Movies"} onTap={addToContinuation}/>
        <Swimlane style={styles.cluster} data={episodes as unknown as TvEpisode[]} title={"Tv Shows"} onTap={addToContinuation}/>
        <Swimlane style={styles.cluster} data={livestreams as unknown as LiveStream[]} title={"Live"} onTap={addToContinuation}/>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    margin: 20,
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white'
  },
  cluster: {
    marginVertical: 10,
    height: 240
  },
});
