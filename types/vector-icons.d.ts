declare module '@expo/vector-icons' {
  import { ComponentType } from 'react';
  import { TextStyle, ViewStyle } from 'react-native';

  interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle | ViewStyle;
  }

  const Ionicons: ComponentType<IconProps>;
  const MaterialIcons: ComponentType<IconProps>;
  const FontAwesome: ComponentType<IconProps>;
  const MaterialCommunityIcons: ComponentType<IconProps>;
  const Entypo: ComponentType<IconProps>;
  const EvilIcons: ComponentType<IconProps>;
  const Feather: ComponentType<IconProps>;
  const FontAwesome5: ComponentType<IconProps>;
  const FontAwesome6: ComponentType<IconProps>;
  const Fontisto: ComponentType<IconProps>;
  const Octicons: ComponentType<IconProps>;
  const SimpleLineIcons: ComponentType<IconProps>;
  const Zocial: ComponentType<IconProps>;

  export {
    Ionicons,
    MaterialIcons,
    FontAwesome,
    MaterialCommunityIcons,
    Entypo,
    EvilIcons,
    Feather,
    FontAwesome5,
    FontAwesome6,
    Fontisto,
    Octicons,
    SimpleLineIcons,
    Zocial,
  };
}