//React
import { useState, useEffect, useRef, useContext } from "react";
import { ApiContext } from "context/ApiContext";
import useTestAccount from "hook/useTestAccount";
import useNetinfoUpdate from "hook/useNetinfoUpdate";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styled from "styled-components/native";
import { getCalendars, getLocales } from "expo-localization";
import useVersionCheck from "hook/useVersionCheck";
import { dataDogFrontendError } from "api/DataDog";

//Components
import { COLOR } from "constants/design";
import { Alert } from "react-native";
import {
  SafeArea,
  KeyboardAvoiding,
  ScrollView,
  Container,
} from "components/Layout";
import { Text } from "components/Text";
import { Image } from "components/Image";
import { BoxInput } from "components/TextInput";
import { SolidButton } from "components/Button";
//import { Ionicons } from '@expo/vector-icons';

//Assets
import addImageIcon from "assets/icons/add-image.png";

export default function SymptomDetailCheckScreen({ navigation, route }) {
  const { updateNetinfo } = useNetinfoUpdate();
  const isLastestVersion = useVersionCheck();

  const {
    state: { accountData },
  } = useContext(ApiContext);
  const telemedicineData = route.params.telemedicineData;

  const [deviceCalendar, setDeviceCalendar] = useState("");
  const [deviceLocale, setDeviceLocale] = useState("");
  const [symptom, setSymptom] = useState(telemedicineData.explain_symptom);
  const [count, setCount] = useState(301);
  const savedCallback = useRef();

  useEffect(() => {
    updateNetinfo();
  }, []);

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
    }
  }, [isLastestVersion]);

  useEffect(() => {
    const calendar = getCalendars()[0];
    setDeviceCalendar(calendar);
    const locale = getLocales()[0];
    setDeviceLocale(locale);
  }, []);

  useEffect(() => {
    const originalTime = new Date(telemedicineData.wish_at);
    const currentTime = new Date();
    const remainingTime = Math.floor((originalTime - currentTime) / 1000);

    setCount(remainingTime);

    function tick() {
      savedCallback.current();
    }
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    savedCallback.current = callback;
  });

  const callback = () => {
    if (telemedicineData?.invoiceInfo && count < -900) {
      // refresh();
    } else if (!telemedicineData?.invoiceInfo && count < -600) {
      // refresh();
    } else {
      setCount(count - 1);
    }
  };

  async function handleNotice1() {
    if (useTestAccount(accountData.email)) {
      handleNotice2();
    } else {
      let netInfo;
      try {
        const jsonValue = await AsyncStorage.getItem("@net_information");
        if (jsonValue !== null) {
          netInfo = JSON.parse(jsonValue);
        }
      } catch (error) {
        dataDogFrontendError(error);
      }

      // if (deviceLocale?.regionCode === 'KR' && deviceCalendar?.timeZone === 'Asia/Seoul') {
      if (netInfo?.geoip?.country?.iso_code === "KR") {
        Alert.alert("대한민국에서는 해당 서비스를 이용하실 수 없습니다.");
      } else {
        Alert.alert(
          "상담실에 입장하시겠습니까?",
          "조기 입장시에도 정상 상담은 예약하신 시간대부터 진행됩니다.",
          [
            {
              text: "취소",
              style: "cancel",
            },
            {
              text: "확인",
              onPress: () => handleNotice2(),
            },
          ]
        );
      }
    }
  }

  function handleNotice2() {
    Alert.alert(
      "안내",
      "화상 상담을 받기 위해서는 카메라와 마이크 사용 권한을 허가해야 합니다. 또한 정확한 의료 상담을 위해 화상 녹화를 허가해야 합니다.",
      [
        {
          text: "확인",
          onPress: () => handleConfirm(),
        },
      ]
    );
  }

  function handleConfirm() {
    navigation.navigate("TelemedicineRoomNavigation", {
      screen: "TelemedicineRoom",
      params: { telemedicineData: telemedicineData },
    });
  }

  return (
    <SafeArea>
      <KeyboardAvoiding>
        <ScrollView paddingHorizontal={20}>
          <Container>
            <Text T3 bold mTop={40}>
              증상을 확인해 주세요
            </Text>
            <Text T6 medium color={COLOR.GRAY1} mTop={12}>
              아래 내용은 상담 예약 시점에 입력하신 내용입니다.{"\n"}변경된
              증상이 있다면 상담 중 말씀해 주시기 바랍니다.{"\n"}상담실 입장
              버튼은 예약시간 5분 전부터 활성화됩니다.
            </Text>
            <Text T6 bold mTop={50}>
              증상
            </Text>
            <BoxInput
              editable={false}
              large
              mTop={12}
              placeholder="상담받고자 하는 증상을 서술해 주세요."
              value={symptom}
              onChangeText={setSymptom}
            />
            <Text T6 bold mTop={50}>
              첨부 파일 확인
            </Text>

            <IconContainer>
              {telemedicineData?.attachments?.[0] ? (
                <IconColumn>
                  <IconButton onPress={() => {}}>
                    <Image
                      source={{
                        uri: telemedicineData.attachments?.[0].Location,
                      }}
                      width={85}
                      height={80}
                      borderRadius={8}
                    />
                  </IconButton>
                  <Text T7 medium color={COLOR.GRAY1}>
                    첨부사진 (1)
                  </Text>
                </IconColumn>
              ) : (
                <IconColumn>
                  <IconButton onPress={() => {}}>
                    <Image
                      source={addImageIcon}
                      width={44}
                      height={44}
                      mLeft={4}
                      mBottom={4}
                    />
                  </IconButton>
                  <Text T7 medium color={COLOR.GRAY1}>
                    첨부사진 없음
                  </Text>
                </IconColumn>
              )}
              {telemedicineData?.attachments?.[1] && (
                <IconColumn>
                  <IconButton onPress={() => {}}>
                    <Image
                      source={{
                        uri: telemedicineData.attachments?.[1].Location,
                      }}
                      width={85}
                      height={80}
                      borderRadius={8}
                    />
                  </IconButton>
                  <Text T7 medium color={COLOR.GRAY1}>
                    첨부사진 (2)
                  </Text>
                </IconColumn>
              )}
            </IconContainer>

            {/* <Row mTop={18} align>
              <Ionicons name="alert-circle-outline" size={14} color={COLOR.GRAY2} mRight={2} />
              <Text T8 color={COLOR.GRAY0} mBottom={1}>10MB 이내 이미지 파일(jpg, png) 2개까지 첨부가 가능합니다.</Text>
            </Row> */}
          </Container>

          <SolidButton
            text={
              (telemedicineData?.invoiceInfo && count < -900) ||
              (!telemedicineData?.invoiceInfo && count < -600)
                ? "입장 시간 초과"
                : "상담실 입장하기"
            }
            mTop={100}
            mBottom={20}
            disabled={
              count > 270 ||
              (telemedicineData?.invoiceInfo && count < -900) ||
              (!telemedicineData?.invoiceInfo && count < -600)
            }
            action={() => handleNotice1()}
          />
        </ScrollView>
      </KeyboardAvoiding>
    </SafeArea>
  );
}

const IconContainer = styled.Pressable`
  margin-top: 18px;
  width: 100%;
  flex-direction: row;
  gap: 24px;
`;

const IconButton = styled.Pressable`
  width: 85px;
  height: 80px;
  border-width: 1px;
  border-color: ${COLOR.GRAY3};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;

const IconColumn = styled.View`
  gap: 6px;
  align-items: center;
`;
