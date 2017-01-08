import React from 'react'
import { Text, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  contentWrap: {
    padding: 5,
  },
})

export default function NotificationContent ({ children }) {
  return (
    <Text style={styles.contentWrap}>
      { children }
    </Text>
  )
}
