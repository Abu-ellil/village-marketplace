import { Linking } from "react-native";

export const makeCall = (phone?: string) => {
  if (!phone) return;
  try {
    Linking.openURL(`tel:${phone}`);
  } catch (e) {
    console.warn("makeCall failed", e);
  }
};

export const formatCurrency = (value: number) => `${value} جنيه`;

export default { makeCall, formatCurrency };
