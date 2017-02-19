// @flow
import React from 'react';
import { Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  contentWrap: {
    padding: 5,
  },
});

type Props = {
  children?: ReactElement<*>,
};

export default function NotificationContent({ children }: Props) {
  return (
    <Text style={styles.contentWrap}>
      {children}
    </Text>
  );
}
