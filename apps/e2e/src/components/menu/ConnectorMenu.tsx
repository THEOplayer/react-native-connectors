import { MenuButton, MenuView, ScrollableMenu } from '@theoplayer/react-native-ui';
import React, { type ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ConnectorSvg } from '../../res/ConnectorSvg';

export interface ConnectorMenuButtonProps {
  /**
   * Overrides for the style of the menu.
   */
  menuStyle?: StyleProp<ViewStyle>;

  /**
   * The icon component used in the button.
   */
  icon?: ReactNode;
}

export const ConnectorsMenuButton = (props: React.PropsWithChildren<ConnectorMenuButtonProps>) => {
  const { children, menuStyle, icon } = props;

  // Do not render an empty menu
  if (React.Children.toArray(children).length === 0) {
    return <></>;
  }

  const createMenu = () => {
    return <MenuView style={menuStyle} menu={<ScrollableMenu title={'Connector Options'} items={children} />} />;
  };

  return <MenuButton svg={icon ?? <ConnectorSvg />} menuConstructor={createMenu} />;
};
