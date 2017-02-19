// @flow
import React from 'react';
import { Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  titleWrap: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 5,
    color: '#444',
  },
});

type Props = {
  children?: ReactElement<*>,
};

export default function NotificationTitle({ children }: Props) {
  return (
    <Text style={styles.titleWrap}>
      {children}
    </Text>
  );
}
