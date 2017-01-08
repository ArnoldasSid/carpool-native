import React from 'react'
import { Text, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  timeWrap: {
    paddingLeft: 6,
    color: '#777',
    fontSize: 12,
    paddingTop: -2,
  },
})

export default function NotificationTime ({ children }) {
  return (
    <Text style={styles.timeWrap}>
      { children }
    </Text>
  )
}
