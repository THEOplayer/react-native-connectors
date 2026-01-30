import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { MenuRadioButton } from '@theoplayer/react-native-ui';

export interface ConnectorSubMenuProps {
  /**
   * Overrides for the style of the menu.
   */
  menuStyle?: StyleProp<ViewStyle>;

  title: string;

  onPress: () => void;
}

export function ConnectorSubMenu(props?: ConnectorSubMenuProps) {
  return (
      <MenuRadioButton
        style={{alignSelf: 'flex-start'}}
        key={`key${props.title}`}
        uid={0}
        label={props.title}
        onSelect={props.onPress}></MenuRadioButton>
  );
}
