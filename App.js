// React
import { useEffect, useState, useCallback, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppProvider } from "context/AppContext";
import { ApiProvider } from "context/ApiContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useVersionCheck from "hook/useVersionCheck";

// Default Settings
import { COLOR } from "constants/design";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  Alert,
  Linking,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
TextInput.defaultProps.placeholderTextColor = COLOR.GRAY2;
TouchableOpacity.defaultProps = TouchableOpacity.defaultProps || {};
TouchableOpacity.defaultProps.activeOpacity = 0.6;
ScrollView.defaultProps = {
  showsVerticalScrollIndicator: false,
  showsHorizontalScrollIndicator: false,
  overScrollMode: "never",
};

// Notifications
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

// Navigation
import BottomTapNavigation from "navigation/BottomTapNavigation";
import TelemedicineReservation from "navigation/Home/TelemedicineReservation";
import TelemedicineReservationPayment from "navigation/Home/TelemedicineReservation/Payment";
import MedicalQuestionNavigation from "navigation/Home/MedicalQuestionNavigation";
import HistoryStackNavigation from "navigation/History";
import TelemedicineRoomNavigation from "navigation/History/TelemedicineRoom";
import MyPageStackNavigation from "navigation/MyPage";
import LoginStackNavigation from "navigation/Login";
import NeedLoginNavigation from "navigation/Login/NeedLoginNavigation";
import InquiryStackNavigation from "navigation/Inquiry";
import PaymentStackNavigation from "navigation/Home/NeedPaymentNavigation";

// GraphQL 쿼리 정의
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://si5b3rxuzvda5el6ismrh3by7u.appsync-api.ap-northeast-2.amazonaws.com/graphql",
  cache: new InMemoryCache(),
  headers: {
    "x-api-key": "da2-3imr5kbeg5edlaxbgjiipgdpt4",
  },
});

// DataDog
import {
  BatchSize,
  DatadogProvider,
  DatadogProviderConfiguration,
  SdkVerbosity,
  UploadFrequency,
} from "@datadog/mobile-react-native";
import { DdRumReactNavigationTracking } from "@datadog/mobile-react-navigation";

const config = new DatadogProviderConfiguration(
  "pubb82947c8f574567856c856ca4f0e32a9",
  "prod",
  "6aef2297-4d34-4dde-8d81-2d9ca3b678eb", // APPLICATION_ID
  true, // track User interactions (e.g.: Tap on buttons. You can use 'accessibilityLabel' element property to give tap action the name, otherwise element type will be reported)
  true, // track XHR Resources
  true // track Errors
);

// if (__DEV__) {
//   config.verbosity = SdkVerbosity.DEBUG; // 터미널 디버그 로그 활성화
// }

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <DatadogProvider configuration={config}>
        <AppComponent />
      </DatadogProvider>
    </ApolloProvider>
  );
}

function AppComponent() {
  const isLastestVersion = useVersionCheck();
  const navigationRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLastestVersion === "Android") {
      Alert.alert(
        "알림",
        "새로운 버전이 출시되었습니다.\n업데이트 후 이용해 주시기 바랍니다.",
        [
          {
            text: "확인",
            onPress: () =>
              Linking.openURL(
                "https://play.google.com/store/apps/details?id=kr.co.insunginfo.okdoc"
              ),
          },
        ]
      );
    } else if (isLastestVersion === "iOS") {
      Alert.alert(
        "알림",
        "새로운 버전이 출시되었습니다.\n업데이트 후 이용해 주시기 바랍니다.",
        [
          {
            text: "확인",
            onPress: () =>
              Linking.openURL(
                "https://apps.apple.com/us/app/%EC%98%A4%EC%BC%80%EC%9D%B4%EB%8B%A5/id6463086824"
              ),
          },
        ]
      );
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLastestVersion]);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Device.osName === "Android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
      await AsyncStorage.setItem("@device_type", "GCM");
    } else {
      await AsyncStorage.setItem("@device_type", "APNS");
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        //alert('알림 허용을 거절하셨습니다.');
        return;
      }
      token = (await Notifications.getDevicePushTokenAsync()).data;
      await AsyncStorage.setItem("@device_token", token);
    } else {
      //Aiden's @device_token
      await AsyncStorage.setItem(
        "@device_token",
        "7af2918322215934ebb1c265340c190f1c503d9a81c303d32cd308b0ae72ce3e"
      );
    }

    return token;
  }

  const [fontsLoaded] = useFonts({
    "Pretendard-Bold": require("assets/fonts/Pretendard-Bold.otf"),
    "Pretendard-Medium": require("assets/fonts/Pretendard-Medium.otf"),
    "Pretendard-Regular": require("assets/fonts/Pretendard-Regular.otf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if (isLoading) {
    return null;
  }

  return (
    <AppProvider>
      <ApiProvider>
        <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
          <StatusBar animated style="dark" />

          <NavigationContainer
            ref={navigationRef}
            onReady={() => {
              DdRumReactNavigationTracking.startTrackingViews(
                navigationRef.current
              );
            }}
          >
            <Stack.Navigator>
              <Stack.Group screenOptions={{ headerShown: false }}>
                <Stack.Screen
                  name="BottomTapNavigation"
                  component={BottomTapNavigation}
                />
                <Stack.Screen
                  name="TelemedicineReservation"
                  component={TelemedicineReservation}
                />
                <Stack.Screen
                  name="MedicalQuestionNavigation"
                  component={MedicalQuestionNavigation}
                />
                <Stack.Screen
                  name="HistoryStackNavigation"
                  component={HistoryStackNavigation}
                />
                <Stack.Screen
                  name="TelemedicineRoomNavigation"
                  component={TelemedicineRoomNavigation}
                  options={{ gestureEnabled: false }}
                />
                <Stack.Screen
                  name="MyPageStackNavigation"
                  component={MyPageStackNavigation}
                />
                <Stack.Screen
                  name="NeedLoginNavigation"
                  component={NeedLoginNavigation}
                />
              </Stack.Group>

              <Stack.Group
                screenOptions={{
                  headerShown: false,
                  presentation: "transparentModal",
                }}
              >
                <Stack.Screen
                  name="TelemedicineReservationPayment"
                  component={TelemedicineReservationPayment}
                  options={{ gestureEnabled: false }}
                />
                <Stack.Screen
                  name="LoginStackNavigation"
                  component={LoginStackNavigation}
                />
                <Stack.Screen
                  name="InquiryStackNavigation"
                  component={InquiryStackNavigation}
                />
                <Stack.Screen
                  name="PaymentStackNavigation"
                  component={PaymentStackNavigation}
                />
              </Stack.Group>
            </Stack.Navigator>
          </NavigationContainer>

          {/* <Button title="Copy device push token" onPress={() => {
              Clipboard.setString(expoPushToken);
            }} /> */}
        </View>
      </ApiProvider>
    </AppProvider>
  );
}
