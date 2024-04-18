//React
import { Platform } from "react-native";
import Constants from "expo-constants";

// GraphQL 쿼리 정의
import { useQuery, gql } from "@apollo/client";
const GET_APP_VERSION_MODEL = gql`
  query GetApp_version_model {
    getApp_version_model(tag: "current") {
      apple
      android
      tag
    }
  }
`;

export default function useVersionCheck() {
  const { loading, error, data } = useQuery(GET_APP_VERSION_MODEL);

  if (!loading && data) {
    if (Platform.OS === "ios") {
      const latestVersion = data.getApp_version_model.apple
        .split(".")
        .map(Number);
      const currentVersion = Constants.manifest.version.split(".").map(Number);
      for (let ii = 0; ii < latestVersion.length; ii++) {
        if (latestVersion[ii] > currentVersion[ii]) {
          // iOS 최신 버전이 아닌 경우
          return "iOS";
        } else if (latestVersion[ii] < currentVersion[ii]) {
          // iOS 릴리즈 되지 않은 최신 버전
          return true;
        }
      }
      // iOS 최신 버전
      return true;
    } else {
      const latestVersion = data.getApp_version_model.android
        .split(".")
        .map(Number);
      const currentVersion = Constants.manifest.version.split(".").map(Number);

      for (let ii = 0; ii < latestVersion.length; ii++) {
        if (latestVersion[ii] > currentVersion[ii]) {
          // Andriod 최신 버전이 아닌 경우
          return "Android";
        } else if (latestVersion[ii] < currentVersion[ii]) {
          // Andriod 릴리즈 되지 않은 최신 버전
          return true;
        }
      }
      // Andriod 최신 버전
      return true;
    }
  }
}
