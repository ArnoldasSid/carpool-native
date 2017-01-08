import React from 'react'
import { Text, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  titleWrap: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 5,
    color: '#444',
  },
})

export default function NotificationTitle ({ children }) {
  return (
    <Text style={styles.titleWrap}>
      { children }
    </Text>
  )
}
