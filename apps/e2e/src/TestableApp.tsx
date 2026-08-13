import React, { Component } from 'react';
import { Tester, TestHookStore } from 'react-native-cavynext';
import { Platform, SafeAreaView, StyleSheet, View, ViewStyle } from 'react-native';
import { TestableTHEOplayerView } from './components/TestableTHEOplayerView';
import Specs from './tests';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const testHookStore = new TestHookStore();
// Debug simulators need extra time for cold-start native player creation.
const TESTER_WAIT_TIME = 30_000;

const needsBorder = Platform.OS === 'ios';
const PLAYER_CONTAINER_STYLE: ViewStyle = {
  position: 'absolute',
  top: needsBorder ? getStatusBarHeight() : 0,
  left: needsBorder ? 2 : 0,
  bottom: 0,
  right: needsBorder ? 2 : 0,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#000000',
};

// Deliberately not wrapped in <StrictMode>: its double-invoked mounts create
// and destroy a second native player per test, which duplicates every log line
// and races the player under test.
export class TestableApp extends Component {
  render() {
    return (
      <Tester specs={Specs} store={testHookStore} waitTime={TESTER_WAIT_TIME}>
        <SafeAreaView style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]}>
          <View style={PLAYER_CONTAINER_STYLE}>
            <TestableTHEOplayerView />
          </View>
        </SafeAreaView>
      </Tester>
    );
  }
}
