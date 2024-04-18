//React
import { useState, useEffect, useContext } from "react";
import { ApiContext } from "context/ApiContext";
import useHistoryUpdate from "hook/useHistoryUpdate";
import useAlarmUpdate from "hook/useAlarmUpdate";

//Components
import { COLOR } from "constants/design";
import { Alert } from "react-native";
import { SafeArea, Container, ContainerCenter } from "components/Layout";
import { Text } from "components/Text";
import { Image } from "components/Image";
import { SolidButton, OutlineButton } from "components/Button";

//Assets
import checkIcon from "assets/icons/circle-check.png";

//Api
import {
  patchCCTVPatientBye,
  getInvoiceInformation,
  merchantCashlessInvoice,
} from "api/History";

export default function TelemedicineCompleteScreen({ navigation, route }) {
  const { refresh } = useHistoryUpdate();
  const { refreshAlarm } = useAlarmUpdate();
  const {
    state: { accountData },
  } = useContext(ApiContext);
  const [invoiceInformation, setInvoiceInformation] = useState();
  const telemedicineData = route.params.telemedicineData;

  useEffect(() => {
    letCCTVStatusChange();
  }, []);

  const letCCTVStatusChange = async function () {
    try {
      const meetingNumber =
        telemedicineData.fullDocument.treatment_appointment
          .hospital_treatment_room.id;
      await patchCCTVPatientBye(accountData.loginToken, meetingNumber);
      checkInvoice();
    } catch {
      Alert.alert("네트워크 오류로 인해 정보를 불러오지 못했습니다.");
    }
  };

  const checkInvoice = async function () {
    try {
      const response = await getInvoiceInformation(
        accountData.loginToken,
        telemedicineData.bidding_id
      );
      telemedicineData.invoiceInfo = response.data.response?.[0];
      setInvoiceInformation(response.data.response?.[0]);
    } catch (error) {
      if (error?.data?.statusCode === 404) {
        // 진료 연장을 하지 않은 경우 바로 리프레쉬
        refresh();
        refreshAlarm();
      } else {
        Alert.alert("네트워크 오류로 인해 정보를 불러오지 못했습니다.");
      }
    }
  };

  function handleFeedback() {
    navigation.navigate("InquiryStackNavigation", {
      screen: "Inquiry",
      params: { headerTitle: "문의하기" },
    });
  }

  const handleNextScreen = async function () {
    if (invoiceInformation) {
      try {
        await merchantCashlessInvoice(
          accountData.loginToken,
          telemedicineData.invoiceInfo.id
        );
        refresh();
        refreshAlarm();
        navigation.navigate("HistoryStackNavigation", {
          screen: "TelemedicineDetail",
          params: { telemedicineData: telemedicineData },
        });
      } catch (error) {
        console.log("merchantCashlessInvoice error:", error);
      }
    } else {
      navigation.navigate("HistoryStackNavigation", {
        screen: "TelemedicineDetail",
        params: { telemedicineData: telemedicineData },
      });
    }
  };

  return (
    <SafeArea>
      <Container paddingHorizontal={20}>
        <ContainerCenter>
          <Image source={checkIcon} width={70} height={70} />
          <Text T2 bold mTop={18}>
            상담이 종료되었습니다
          </Text>
          <Text T6 center color={COLOR.GRAY1} mTop={18}>
            상담 중 좋았던 점이나{"\n"}불편한 점이 있었다면 알려주세요
          </Text>
          <OutlineButton
            large
            mTop={24}
            text="고객센터 연결하기"
            action={() => handleFeedback()}
          />
        </ContainerCenter>

        <SolidButton
          // text={invoiceInformation?"추가요금 결제하기":"다음으로"}
          text="다음으로"
          mBottom={20}
          disabled={false}
          action={() => handleNextScreen()}
        />
      </Container>
    </SafeArea>
  );
}
