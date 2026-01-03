declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '*.css' {
  import { StyleProp } from 'react-native';
  const content: { [className: string]: StyleProp<any> };
  export default content;
}
