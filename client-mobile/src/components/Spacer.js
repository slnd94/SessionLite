import { View, Text } from 'react-native'
import React from 'react'

const Spacer = ({ children }) => {
  return (
    <View style={{ margin: 15 }}>
      {children}
    </View>
  )
}

export default Spacer