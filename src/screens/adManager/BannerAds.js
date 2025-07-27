// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const BannerAds = () => {
//   return (
//     <View>
//       <Text style={{alignSelf:'center'}}>BannerAds</Text>
//     </View>
//   )
// }

// export default BannerAds

// const styles = StyleSheet.create({})

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-1779800052220862/4842981107';

export default function BannerAds() {
  return (
    <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        networkExtras: {
          collapsible: 'bottom',
        },
      }}
    />
  )
}

const styles = StyleSheet.create({})