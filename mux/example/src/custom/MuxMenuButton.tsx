import React, { RefObject } from 'react';
import { MenuButton, MenuRadioButton, MenuView, ScrollableMenu } from '@theoplayer/react-native-ui';
import type { MuxConnector, MuxData } from "@theoplayer/react-native-analytics-mux";
import { MuxSvg } from "./MuxSvg";

const ALL_OPTIONS_TITLES = [
  'Change Program',
  'Notify error',
]

const enum Action {
  CHANGE_PROGRAM = 0,
  NOTIFY_ERROR = 1
}

const newProgramMetadata: MuxData = {
  video_title: 'New video title'
}

interface MuxMenuButtonProps {
  muxConnector: RefObject<MuxConnector | undefined>;
}

export const MuxMenuButton = (props: MuxMenuViewProps) => {
  const createMenu = () => {
    const { muxConnector } = props;
    return <MuxMenuView muxConnector={muxConnector} />;
  };
  return <MenuButton svg={<MuxSvg />} menuConstructor={createMenu} style={{justifyContent: 'center'}} />;
};

interface MuxMenuViewProps {
  muxConnector: RefObject<MuxConnector | undefined>;
}

export const MuxMenuView = (props: MuxMenuButtonProps) => {
  const selectOption = (id: number | undefined) => {
    const { muxConnector } = props;
    switch (id) {
      case Action.CHANGE_PROGRAM: muxConnector.current?.changeProgram(newProgramMetadata); break;
      case Action.NOTIFY_ERROR: muxConnector.current?.notifyError(
        100,
        "Description of error",
        'Additional context for the error'
        ); break;
    }
  };

  return (
    <MenuView
      menu={
        <ScrollableMenu
          title={'Mux Analytics Connector'}
          items={ALL_OPTIONS_TITLES.map((action, id) => (
            <MenuRadioButton key={id} label={action} uid={id} onSelect={selectOption}></MenuRadioButton>
          ))}
        />
      }
    />
  );
};
