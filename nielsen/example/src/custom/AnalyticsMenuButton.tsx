import React from 'react';
import { MenuButton, MenuRadioButton, MenuView, ScrollableMenu } from '@theoplayer/react-native-ui';
import { AnalyticsSvg } from "./AnalyticsSvg";

export interface AnalyticsMenuOption {
  title: string;
  action: () => void;
}

interface AnalyticsMenuProps {
  menuTitle: string;
  options: AnalyticsMenuOption[];
}

export const AnalyticsMenuButton = (props: AnalyticsMenuProps) => {
  const createMenu = () => {
    const { menuTitle, options } = props;
    return <AnalyticsMenuView menuTitle={menuTitle} options={options} />;
  };
  return <MenuButton svg={<AnalyticsSvg />} menuConstructor={createMenu} style={{justifyContent: 'center'}} />;
};

export const AnalyticsMenuView = (props: AnalyticsMenuProps) => {
  return (
    <MenuView
      menu={
        <ScrollableMenu
          title={props.menuTitle}
          items={props.options.map((option, id) => (
            <MenuRadioButton key={id} label={option.title} uid={id} onSelect={option.action}></MenuRadioButton>
          ))}
        />
      }
    />
  );
};
