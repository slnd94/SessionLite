import React from "react";
import { Image } from "@rneui/themed";
import { StyleSheet, ActivityIndicator } from "react-native";
import { REACT_APP_FILESTACK_API_KEY } from "@env";

const TenantLogo = ({ handle, size, viewFileAuth }) => {

  const sizes = {
    xs: { height: 40, width: 40 },
    sm: { height: 100, width: 100 },
    md: { height: 200, width: 200 },
    lg: { height: 300, width: 300 },
    xl: { height: 600, width: 600 },
  };

  const styles = StyleSheet.create({
    item: {
      aspectRatio: 1,
      width: sizes[size].width,
      // flex: 1,
    },
  });

  return (
    <Image
      source={{
        uri: `https://cdn.filestackcontent.com/${REACT_APP_FILESTACK_API_KEY}/resize=height:${sizes[size].height},width:${sizes[size].width},fit:clip/security=policy:${viewFileAuth.policy},signature:${viewFileAuth.signature}/${handle}`,
      }}
      containerStyle={styles.item}
      PlaceholderContent={<ActivityIndicator />}
    />
  );
};

export default TenantLogo;
