//React
import { useEffect } from "react";
import useHistoryUpdate from "hook/useHistoryUpdate";
import useAlarmUpdate from "hook/useAlarmUpdate";

//Components
import { COLOR } from "constants/design";
import { SafeArea, Container, Row, PaddingContainer } from "components/Layout";
import { Text } from "components/Text";
import { SolidButton } from "components/Button";

export default function PaymentCompleteScreen({ navigation, route }) {
  const { refresh } = useHistoryUpdate();
  const { refreshAlarm } = useAlarmUpdate();
  const telemedicineData = route.params.telemedicineData;

  useEffect(() => {
    refresh();
    refreshAlarm();
  }, []);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    return `${year}.${month}.${day} (${hour}:${minute})`;
  }

  function handleConfirm() {
    navigation.popToTop();
    navigation.goBack();
    navigation.navigate("HistoryStackNavigation", {
      screen: "TelemedicineDetail",
      params: { telemedicineData: telemedicineData },
    });
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
              진료 상담 연장권
            </Text>
            <Row mTop={18}>
              <Text T6 medium color={COLOR.GRAY1} mRight={42}>
                결제 금액
              </Text>
              <Text T6 color={COLOR.GRAY1}>
                50,000원
              </Text>
            </Row>
            <Row mTop={6}>
              <Text T6 medium color={COLOR.GRAY1} mRight={42}>
                결제 수단
              </Text>
              <Text T6 color={COLOR.GRAY1}>
                인앱결제
              </Text>
            </Row>
            <Row mTop={6}>
              <Text T6 medium color={COLOR.GRAY1} mRight={42}>
                결제 일시
              </Text>
              <Text T6 color={COLOR.GRAY1}>
                {formatDate(new Date())}
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
