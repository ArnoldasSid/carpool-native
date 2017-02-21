// @flow
import React from 'react';
import { View } from 'react-native';

type Props = {
  children?: ReactElement<*>,
  height: number,
  heightAnim: number,
  opacity: number,
};

export default function NotificationWrap({ children, height, heightAnim, opacity }: Props) {
  return (
    <View
      style={{
        height: height * heightAnim,
        opacity,
        borderWidth: 1 * heightAnim,
        borderColor: '#333',
        borderStyle: 'solid',
        backgroundColor: '#fafafa',
        padding: 8 * heightAnim,
        marginLeft: 12,
        marginRight: 12,
        marginTop: 12 * heightAnim,
        marginBottom: 12 * heightAnim,
      }}
    >
      {children}
    </View>
  );
}
