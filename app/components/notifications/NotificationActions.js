import React from 'react'
import { View, StyleSheet } from 'react-native'

import FlatButton from '../material/FlatButton.js'

const styles = StyleSheet.create({
  actionsWrap: {
    borderStyle: "solid",
    borderTopColor: "#777",
    borderTopWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
})

export default function NotificationActions ({ actions }) {
  return (
    <View style={styles.actionsWrap}>
      {actions.map((action, i) => (
        <FlatButton
          key={i}
          onPress={action.onPress}
          label={action.text}
        />
      ))}
    </View>
  )
}
