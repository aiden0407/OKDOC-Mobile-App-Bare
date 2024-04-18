//React
import { useState, useEffect, useContext } from "react";
import { ApiContext } from "context/ApiContext";
import useHistoryUpdate from "hook/useHistoryUpdate";
import useAlarmUpdate from "hook/useAlarmUpdate";

//Components
import { COLOR } from "constants/design";
import { Alert } from "react-native";
import { SafeArea, Container, Row, PaddingContainer } from "components/Layout";
import { Text } from "components/Text";
import { SolidButton } from "components/Button";

//Api
import { getInvoiceInformation } from "api/History";
import { getPaymentInformation } from "api/Home";

export default function PaymentCompleteScreen({ navigation, route }) {
  const { refresh } = useHistoryUpdate();
  const { refreshAlarm } = useAlarmUpdate();
  const {
    state: { accountData },
  } = useContext(ApiContext);
  const [isLoading, setIsLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState();
  const [paymentData, setPaymentData] = useState();
  const telemedicineData = route.params.telemedicineData;

  useEffect(() => {
    initInvoiceData();
  }, []);

  const initInvoiceData = async function () {
    try {
      const response = await getInvoiceInformation(
        accountData.loginToken,
        telemedicineData.biddingInfo.id
      );
      setInvoiceData(response.data.response?.[0]);
      initPaymentData(response.data.response?.[0].P_TID);
    } catch {
      Alert.alert("네트워크 오류로 인해 정보를 불러오지 못했습니다.");
    }
  };

  const initPaymentData = async function (P_TID) {
    try {
      const response = await getPaymentInformation(P_TID);
      setPaymentData(response.data.response);
      setIsLoading(false);
    } catch {
      Alert.alert("결제 정보를 불러오지 못했습니다.");
    }
  };

  function formatDate(inputDate) {
    const year = inputDate.slice(0, 4);
    const month = inputDate.slice(4, 6);
    const day = inputDate.slice(6, 8);
    const hour = inputDate.slice(8, 10);
    const minute = inputDate.slice(10, 12);

    const formattedDate = `${year}.${month}.${day} (${hour}:${minute})`;
    return formattedDate;
  }

  function handleConfirm() {
    refresh();
    refreshAlarm();
    navigation.popToTop();
    navigation.goBack();
    navigation.navigate("HistoryStackNavigation", {
      screen: "TelemedicineDetail",
      params: { telemedicineData: telemedicineData },
    });
  }

  if (isLoading) {
    return null;
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
              비용 {Number(paymentData.price)?.toLocaleString()}원
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
                {formatDate(invoiceData?.P_AUTH_DT)}
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
