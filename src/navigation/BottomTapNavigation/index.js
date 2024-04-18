//React
import { useEffect, useContext } from "react";
import { ApiContext } from "context/ApiContext";
import { AppContext } from "context/AppContext";
import useNetinfoUpdate from "hook/useNetinfoUpdate";
import useHistoryUpdate from "hook/useHistoryUpdate";
import useAlarmUpdate from "hook/useAlarmUpdate";
import useReuseUpdate from "hook/useReuseUpdate";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dataDogFrontendError } from "api/DataDog";

//Api
import { getPatientList } from "api/MyPage";

//Navigation
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "screens/Home";
import HistoryScreen from "screens/History";
import AlarmScreen from "screens/Alarm";
import MyPageScreen from "screens/MyPage";

//Components
import * as Device from "expo-device";
import { Ionicons } from "@expo/vector-icons";
import { COLOR } from "constants/design";

const BottomTab = createBottomTabNavigator();

export default function BottomTapNavigation({ navigation }) {
  const { updateNetinfo } = useNetinfoUpdate();
  const { refresh } = useHistoryUpdate();
  const { refreshAlarm } = useAlarmUpdate();
  const { updateReuse } = useReuseUpdate();
  const {
    state: { accountData, profileData },
    dispatch,
  } = useContext(ApiContext);
  const {
    state: { needPayment },
  } = useContext(AppContext);

  useEffect(() => {
    autoLogin();
    updateNetinfo();
  }, []);

  useEffect(() => {
    if (accountData.loginToken) {
      getPatientInformation();
    }
  }, [accountData.loginToken]);

  useEffect(() => {
    if (profileData?.[0]?.id) {
      refresh();
      refreshAlarm();
      // updateReuse();
    }
  }, [profileData]);

  useEffect(() => {
    if (needPayment) {
      navigation.navigate("PaymentStackNavigation");
    }
  }, [needPayment]);

  const autoLogin = async function () {
    try {
      const jsonValue = await AsyncStorage.getItem("@account_data");
      if (jsonValue !== null) {
        const accountData = JSON.parse(jsonValue);
        dispatch({
          type: "LOGIN",
          loginToken: accountData.loginToken,
          email: accountData.email,
        });
      }
    } catch (error) {
      dataDogFrontendError(error);
    }
  };

  const getPatientInformation = async function () {
    try {
      const response = await getPatientList(
        accountData.loginToken,
        accountData.email
      );
      const mainProfile = response.data.response[0];
      dispatch({
        type: "PROFILE_UPDATE_MAIN",
        id: mainProfile.id,
        name:
          mainProfile?.passport?.user_name ??
          mainProfile?.passapp_certification?.name,
        relationship: mainProfile.relationship ?? "본인",
        birth:
          mainProfile?.passport?.birth ??
          mainProfile?.passapp_certification?.birthday.replaceAll("-", ""),
        gender:
          mainProfile?.gender ??
          mainProfile?.passapp_certification?.gender?.toUpperCase(),
        height: mainProfile?.height,
        weight: mainProfile?.weight,
        drinker: mainProfile?.drinker,
        smoker: mainProfile?.smoker,
        medicalHistory: mainProfile?.medical_history,
        medicalHistoryFamily: mainProfile?.family_medical_history,
        medication: mainProfile?.medication,
        allergicReaction: mainProfile?.allergic_reaction,
        etcConsideration: mainProfile?.consideration,
      });
    } catch (error) {
      if (error?.response?.data.statusCode === 403) {
        dispatch({ type: "LOGOUT" });
        try {
          await AsyncStorage.removeItem("@account_data");
        } catch (error) {
          dataDogFrontendError(error);
        }
      } else {
        dataDogFrontendError(error);
      }
    }
  };

  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: Device.osName === "Android" && {
          height: 60,
        },
        tabBarLabelStyle: Device.osName === "Android" && {
          marginBottom: 10,
        },
        tabBarActiveTintColor: COLOR.MAIN,
        tabBarInactiveTintColor: "#AAAAAA",
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home-outline" : "home-outline";
          }
          if (route.name === "History") {
            iconName = focused ? "newspaper-outline" : "newspaper-outline";
          }
          if (route.name === "Alarm") {
            iconName = focused
              ? "notifications-outline"
              : "notifications-outline";
          }
          if (route.name === "MyPage") {
            iconName = focused ? "person-outline" : "person-outline";
          }
          return (
            <Ionicons name={iconName} size={24} color={color} marginLeft={2} />
          );
        },
      })}
    >
      <BottomTab.Group
        screenOptions={{
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      >
        <BottomTab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "홈", headerShown: false }}
        />
        <BottomTab.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: "상담 내역" }}
        />
        <BottomTab.Screen
          name="Alarm"
          component={AlarmScreen}
          options={{ title: "알림", headerShadowVisible: true }}
        />
        <BottomTab.Screen
          name="MyPage"
          component={MyPageScreen}
          options={{ title: "마이페이지" }}
        />
      </BottomTab.Group>
    </BottomTab.Navigator>
  );
}
