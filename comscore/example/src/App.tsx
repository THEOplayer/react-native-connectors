import React, { useCallback, useRef, useState } from 'react';
import { Image, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { PlayerConfiguration, PlayerError, PlayerEventType, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import { ComscoreConnector } from '@theoplayer/react-native-analytics-comscore';
import { PlayButton } from './res/images';
import type { ComscoreConfiguration, ComscoreMetadata } from '@theoplayer/react-native-analytics-comscore';

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  license: undefined,
  libraryLocation: 'theoplayer'
};

const source = {
  sources: [
    {
      "src": "https://cdn.theoplayer.com/video/dash/bbb_30fps/bbb_with_multiple_tiled_thumbnails.mpd",
      "type": "application/dash+xml"
    },
    {
      type: "application/x-mpegurl",
      src: "https://cdn.theoplayer.com/video/big_buck_bunny/big_buck_bunny.m3u8"
    }
  ],
};

const App = () => {
  const comscoreConnector = useRef<ComscoreConnector | null>();
  const theoPlayer = useRef<THEOplayer | null>();
  const [error, setError] = useState<PlayerError | null>();
  const [paused, setPaused] = useState<boolean>(true);

  const comscoreMetadata: ComscoreMetadata =  {
    c1: "2",
    c2: "15866303",
    ns_type: "hidden",
    ns_st_sv: "6.3.1.181004",
    ns_st_smv: "5.10",
    ns_st_it: "c",
    ns_st_id: "1597137791008",
    ns_st_ec: "3",
    ns_st_sp: "1",
    ns_st_sc: "1",
    ns_st_psq: "2",
    ns_st_asq: "2",
    ns_st_sq: "2",
    ns_st_ppc: "1",
    ns_st_apc: "1",
    ns_st_spc: "1",
    ns_st_cn: "1",
    ns_st_ev: "play",
    ns_st_po: "53526",
    ns_st_cl: 653750,
    ns_st_mp: "js_api",
    ns_st_mv: "6.3.1.181004",
    ns_st_pn: "1",
    ns_st_tp: "0",
    ns_st_li: "0",
    ns_st_ci: "ContentItem-2f46bd79-8d49-48cd-84b0-4ecc445b0de8",
    ns_st_pt: "53050",
    ns_st_dpt: "0",
    ns_st_ipt: "0",
    ns_st_ap: "52569",
    ns_st_dap: "0",
    ns_st_et: "61445",
    ns_st_det: "8395",
    ns_st_upc: "52569",
    ns_st_dupc: "0",
    ns_st_iupc: "0",
    ns_st_upa: "52569",
    ns_st_dupa: "0",
    ns_st_iupa: "0",
    ns_st_lpc: "52569",
    ns_st_dlpc: "0",
    ns_st_lpa: "52569",
    ns_st_dlpa: "0",
    ns_st_pa: "53050",
    ns_st_ldw: "0",
    ns_st_ldo: "0",
    ns_ts: "1597137854122",
    ns_st_bc: "0",
    ns_st_dbc: "0",
    ns_st_bt: "0",
    ns_st_dbt: "0",
    ns_st_bp: "0",
    ns_st_skc: "0",
    ns_st_dskc: "0",
    ns_st_ska: "0",
    ns_st_dska: "0",
    ns_st_skd: "0",
    ns_st_skt: "0",
    ns_st_dskt: "0",
    ns_st_pc: "1",
    ns_st_dpc: "0",
    ns_st_pp: "1",
    ns_st_br: "0",
    ns_st_rt: "100",
    ns_st_ub: "0",
    ns_st_ki: "1200000",
    ns_st_bn: "*null",
    ns_st_pr: "porta a porta",
    ns_st_tpr: "ContentItem-aefd092d-708b-41ff-b1c0-0c94058a88a5",
    ns_st_sn: "2020",
    ns_st_en: "*null",
    ns_st_ep: "puntata del 25/06/2020",
    ns_st_tep: "ContentItem-2f46bd79-8d49-48cd-84b0-4ecc445b0de8",
    ns_st_ct: "12",
    ns_st_ge: "*null",
    ns_st_st: "rai 1",
    ns_st_stc: "0001",
    ns_st_ce: "*null",
    ns_st_ia: "*null",
    ns_st_ddt: "*null",
    ns_st_tdt: "2020-06-23",
    ns_st_tm: "*null",
    ns_st_pu: "RAI",
    ns_st_ti: "*null",
    ns_st_cu: "*null",
    ns_c: "UTF-8",
    c3: "raiplay",
    c4: "catalogo_vod",
    c6: "raiplay on demand",
    c7: "https://www.raiplay.it/programmi/portaaporta",
    c8: "Porta a porta - RaiPlay",
    c9: "https://www.raiplay.it/ricerca.html?q=porta+a",
    cs_proid: "kwp-it",
    oce_odt: "VOD",
    oce_ctl: "Porta a Porta - Programma di informazione e approfondimento sull'attualità politica e sociale, sui grandi fatti di cronaca e di costume con ospiti politici, esperti e giornalisti, protagonisti della cronaca e dello spettacolo, chiamati a confrontarsi in studio sui diversi temi proposti nelle puntate.",
    ns_st_cmt: "fc",
    ns_st_cdm: "to",
    oce_bpf: "raiplay",
    fp_offset: "*null",
    cv: "3.5"
  };

  const comscoreConfig: ComscoreConfiguration = {

  };

  const onPlayerReady = useCallback((player: THEOplayer) => {
    // Create Comscore connector
    comscoreConnector.current = new ComscoreConnector(player, comscoreMetadata, comscoreConfig);
    player.autoplay = !paused;
    player.source = source;
    player.addEventListener(PlayerEventType.ERROR, (event) => setError(event.error));

    // Update theoPlayer reference.
    theoPlayer.current = player;

    // Destroy connector when unmounting
    return () => { comscoreConnector.current?.destroy() }
  }, []);

  const onTogglePlayPause = useCallback(() => {
    const player = theoPlayer.current;
    if (player) {
      player.paused? player.play() : player.pause();
      setPaused((paused) => !paused);
    }
  }, [theoPlayer])

  return (
    <View style={ { position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 } }>

      <THEOplayerView config={ playerConfig } onPlayerReady={ onPlayerReady }/>

      {/*Play/pause button*/}
      {!error && (
        <TouchableOpacity style={styles.fullscreen} onPress={onTogglePlayPause}>
          {paused && <Image style={styles.image} source={PlayButton} />}
        </TouchableOpacity>
      )}

      {/*Error message*/}
      {error && <View style={styles.fullscreen}><Text style={styles.message}>{error.errorMessage}</Text></View>}
    </View>
  );
};

const styles = StyleSheet.create({
  fullscreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 16,
    paddingLeft: 50,
    paddingRight: 50,
    color: 'white',
    backgroundColor: 'black',
  },
  image: {
    resizeMode: 'contain',
    width: 75,
    height: 75,
    tintColor: '#ffc50f',
  },
  playButton: {
    width: 90,
    height: 90,
    tintColor: '#ffc50f',
  }
});

export default App;
