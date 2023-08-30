import React from 'react';
import { MenuButton, MenuRadioButton, MenuView, ScrollableMenu } from '@theoplayer/react-native-ui';
import { AnalyticsSvg } from "./AnalyticsSvg";

export interface AnalyticsMenuOption {
  title: string;
  action: () => void;
}

interface AnalyticsMenuViewProps {
  options: AnalyticsMenuOption[];
}

export const AnalyticsMenuButton = (props: AnalyticsMenuViewProps) => {
  const createMenu = () => {
    const { options } = props;
    return <AnalyticsMenuView options={options} />;
  };
  return <MenuButton svg={<AnalyticsSvg />} menuConstructor={createMenu} style={{justifyContent: 'center'}} />;
};

interface AnalyticsMenuButtonProps {
  options: AnalyticsMenuOption[];
}

export const AnalyticsMenuView = (props: AnalyticsMenuButtonProps) => {
  return (
    <MenuView
      menu={
        <ScrollableMenu
          title={'Nielsen Analytics Connector'}
          items={props.options.map((option, id) => (
            <MenuRadioButton key={id} label={option.title} uid={id} onSelect={option.action}></MenuRadioButton>
          ))}
        />
      }
    />
  );
};
