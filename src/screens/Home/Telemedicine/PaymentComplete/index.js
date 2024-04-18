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
  const [paymentData, setPaymentData] = useState();
  const biddingId = route.params?.biddingId;

  useEffect(() => {
    initBiddingData();
  }, []);

  const initBiddingData = async function () {
    try {
      const response = await getBiddingInformation(
        accountData.loginToken,
        biddingId
      );
      setBiddingData(response.data.response);
      initPaymentData(response.data.response.P_TID);
    } catch {
      Alert.alert("네트워크 오류로 인해 정보를 불러오지 못했습니다.");
      navigation.goBack();
    }
  };

  const initPaymentData = async function (P_TID) {
    try {
      const response = await getPaymentInformation(P_TID);
      setPaymentData(response.data.response);
      setIsLoading(false);
    } catch {
      // 0원 결제라 결제 정보 없음
      setIsLoading(false);
    }
  };

  // function formatDate(inputDate) {
  //   const year = inputDate.slice(0, 4);
  //   const month = inputDate.slice(4, 6);
  //   const day = inputDate.slice(6, 8);
  //   const hour = inputDate.slice(8, 10);
  //   const minute = inputDate.slice(10, 12);

  //   const formattedDate = `${year}.${month}.${day} (${hour}:${minute})`;
  //   return formattedDate;
  // }

  function handleConfirm() {
    dispatch({ type: "TELEMEDICINE_RESERVATION_CONFIRMED" });
    refresh();
    refreshAlarm();
    updateReuse();
    navigation.navigate("BottomTapNavigation", { screen: "History" });
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
          {paymentData && (
            <>
              <PaddingContainer>
                <Text T3 bold mTop={30}>
                  결제가 완료되었어요
                </Text>
                <Text T3 bold color={COLOR.MAIN} mTop={9}>
                  의료상담 {Number(paymentData.price)?.toLocaleString()}원
                </Text>
                <Row mTop={18}>
                  <Text T6 medium color={COLOR.GRAY1} mRight={42}>
                    결제 금액
                  </Text>
                  <Text T6 color={COLOR.GRAY1}>
                    {Number(paymentData.price)?.toLocaleString()}원 | 일시불
                  </Text>
                </Row>
                <Row mTop={6}>
                  <Text T6 medium color={COLOR.GRAY1} mRight={42}>
                    결제 수단
                  </Text>
                  <Text T6 color={COLOR.GRAY1}>
                    신용카드
                  </Text>
                </Row>
                <Row mTop={6}>
                  <Text T6 medium color={COLOR.GRAY1} mRight={42}>
                    결제 일시
                  </Text>
                  <Text T6 color={COLOR.GRAY1}>
                    {formatDate(new Date(biddingData?.P_AUTH_DT))}
                  </Text>
                </Row>
              </PaddingContainer>

              <DividingLine mTop={30} />
            </>
          )}

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
