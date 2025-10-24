import React from "react";
import {
  View,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
} from "react-native";
import Shimmer from "./Shimmer";

interface Props {
  uri?: string | null;
  width?: number | string;
  height?: number;
  style?: StyleProp<ImageStyle>;
  placeholder?: React.ReactNode;
  resizeMode?: "cover" | "contain" | "stretch" | "repeat" | "center";
}

export default function ImageWithPlaceholder({
  uri,
  width = "100%",
  height = 160,
  style,
  placeholder,
  resizeMode = "cover",
}: Props) {
  const [loading, setLoading] = React.useState<boolean>(Boolean(uri));
  const [error, setError] = React.useState(false);
  // normalize numeric width to numbers where possible for RN types
  const containerStyle: any = { height, overflow: "hidden" };
  if (typeof width === "number") containerStyle.width = width;
  else if (typeof width === "string") containerStyle.width = width;

  if (!uri || error) {
    // Show provided placeholder or a simple shimmer block
    return (
      <View style={containerStyle}>
        {placeholder ? (
          <>{placeholder}</>
        ) : (
          <Shimmer width={width} height={height} borderRadius={0} />
        )}
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      {loading && <Shimmer width={width} height={height} borderRadius={0} />}
      <Image
        source={{ uri }}
        style={[{ width: "100%", height }, style]}
        resizeMode={resizeMode}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
    </View>
  );
}
