// @flow
import React from 'react';
import { Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  timeWrap: {
    paddingLeft: 6,
    color: '#777',
    fontSize: 12,
    paddingTop: -2,
  },
});

type Props = {
  children?: ReactElement<*>,
};

export default function NotificationTime({ children }: Props) {
  return (
    <Text style={styles.timeWrap}>
      {children}
    </Text>
  );
}
