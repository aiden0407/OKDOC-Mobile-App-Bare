//React
import { useState, useEffect, useContext } from "react";
import { ApiContext } from "context/ApiContext";
import { AppContext } from "context/AppContext";
import useHistoryUpdate from "hook/useHistoryUpdate";
import useAlarmUpdate from "hook/useAlarmUpdate";
import useReuseUpdate from "hook/useReuseUpdate";

//Components
import { COLOR } from "constants/design";
import { Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeArea,
  Container,
  Row,
  DividingLine,
  PaddingContainer,
} from "components/Layout";
import { Text } from "components/Text";
import { SolidButton } from "components/Button";

//Api
import { getBiddingInformation, getPaymentInformation } from "api/Home";

export default function PaymentCompleteScreen({ navigation, route }) {
  const { refresh } = useHistoryUpdate();
  const { refreshAlarm } = useAlarmUpdate();
  const { updateReuse } = useReuseUpdate();
  const {
    state: { accountData },
  } = useContext(ApiContext);
  const {
    state: { telemedicineReservationStatus },
    dispatch,
  } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [biddingData, setBiddingData] = useState();
  // const [paymentData, setPaymentData] = useState();
  const biddingId = route.params?.biddingId;
  const type = route.params?.type;

  useEffect(() => {
    initBiddingData();
  }, []);

  // 비딩 데이터 말고 이전 페이지에서 결제 type과 그에 따른 결제일시, 진료예약시간 등을 전달
  const initBiddingData = async function () {
    try {
      const response = await getBiddingInformation(
        accountData.loginToken,
        biddingId
      );
      setBiddingData(response.data.response);
      setIsLoading(false);
    } catch (error) {
      Alert.alert("오류", "네트워크 에러로 인해 정보를 불러오지 못했습니다.");
      navigation.goBack();
    }
  };

  function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    // 형식: yyyy.mm.dd (HH:MM)
    return `${year}.${month}.${day} (${hour}:${minute})`;
  }

  function handleConfirm() {
    refresh();
    refreshAlarm();
    updateReuse();
    setTimeout(() => {
      navigation.navigate("BottomTapNavigation", { screen: "History" });
    }, 1000);
  }

  if (isLoading) {
    return null;
  }

  function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    return `${year}.${month}.${day} (${hour}:${minute})`;
  }

  return (
    <SafeArea>
      <Container>
        <Container>
          <PaddingContainer>
            <Text T3 bold mTop={30}>
              결제가 완료되었어요
            </Text>
            <Text T3 bold color={COLOR.MAIN} mTop={9}>
              의료 상담 10분 진행
            </Text>
            <Row mTop={18}>
              <Text T6 medium color={COLOR.GRAY1} mRight={42}>
                결제 금액
              </Text>
              <Text T6 color={COLOR.GRAY1}>
                130,000원
              </Text>
            </Row>
            <Row mTop={6}>
              <Text T6 medium color={COLOR.GRAY1} mRight={42}>
                결제 수단
              </Text>
              <Text T6 color={COLOR.GRAY1}>
                {type}
              </Text>
            </Row>
            {type === "인앱결제" && (
              <Row mTop={6}>
                <Text T6 medium color={COLOR.GRAY1} mRight={42}>
                  결제 일시
                </Text>
                <Text T6 color={COLOR.GRAY1}>
                  {formatDate(new Date())}
                </Text>
              </Row>
            )}
          </PaddingContainer>

          <DividingLine mTop={30} />

          <PaddingContainer>
            <Text T3 bold mTop={30}>
              예약하신 내역을 확인해주세요
            </Text>
            <Row align mTop={15}>
              <Ionicons name="checkmark-sharp" size={18} color={COLOR.MAIN} />
              <Text T6 medium mLeft={6}>
                {telemedicineReservationStatus?.doctorInfo?.name} 교수 (
                {telemedicineReservationStatus?.doctorInfo?.hospital})
              </Text>
            </Row>
            <Row align mTop={12}>
              <Ionicons name="checkmark-sharp" size={18} color={COLOR.MAIN} />
              <Text T6 medium mLeft={6}>
                {telemedicineReservationStatus?.doctorInfo?.subject} / 의료상담
              </Text>
            </Row>
            <Row align mTop={12}>
              <Ionicons name="checkmark-sharp" size={18} color={COLOR.MAIN} />
              <Text T6 medium mLeft={6}>
                {formatDate(new Date(biddingData.wish_at))}
              </Text>
            </Row>
            <Row align mTop={12}>
              <Ionicons name="checkmark-sharp" size={18} color={COLOR.MAIN} />
              <Text T6 medium mLeft={6}>
                예약자: {telemedicineReservationStatus?.profileInfo?.name}
              </Text>
            </Row>
          </PaddingContainer>
        </Container>

        <PaddingContainer>
          <SolidButton
            text="확인"
            mBottom={20}
            action={() => handleConfirm()}
          />
        </PaddingContainer>
      </Container>
    </SafeArea>
  );
}
