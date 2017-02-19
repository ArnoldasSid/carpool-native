// @flow
import React from 'react';
import { View } from 'react-native';

type Props = {
  children?: ReactElement<*>,
  height: number,
  opacity: number,
};

export default function NotificationWrap({ children, height, opacity }: Props) {
  return (
    <View
      style={{
        height: height,
        padding: 8,
        margin: 12,
        borderWidth: 1,
        borderColor: '#333',
        borderStyle: 'solid',
        backgroundColor: '#fafafa',
        opacity,
      }}
    >
      {children}
    </View>
  );
}
