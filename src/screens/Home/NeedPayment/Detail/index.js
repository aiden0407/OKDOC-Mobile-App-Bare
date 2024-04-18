//React
import { useState, useEffect, useContext } from "react";
import { ApiContext } from "context/ApiContext";
import { useIsFocused } from "@react-navigation/native";
import styled from "styled-components/native";

//Components
import { COLOR, BUTTON } from "constants/design";
import { Alert } from "react-native";
import {
  SafeArea,
  Container,
  ScrollView,
  Row,
  DividingLine,
  PaddingContainer,
  Box,
} from "components/Layout";
import { Text } from "components/Text";
import { Image } from "components/Image";
import { SolidButton } from "components/Button";

//Api
import { getBiddingInformation, getPaymentInformation } from "api/Home";

export default function NeedPaymentDetailScreen({ navigation, route }) {
  const {
    state: { accountData },
  } = useContext(ApiContext);
  const [isLoading, setIsLoading] = useState(true);
  const [biddingData, setBiddingData] = useState();
  const [biddingPaymentData, setBiddingPaymentData] = useState();
  const telemedicineData = route.params.telemedicineData;
  const biddingId = telemedicineData.bidding_id;

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      initBiddingData();
    }
  }, [isFocused]);

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
      getBiddingPaymentData(response.data.response.P_TID);
    } catch {
      Alert.alert("네트워크 오류로 인해 정보를 불러오지 못했습니다.");
    }
  };

  const getBiddingPaymentData = async function (P_TID) {
    try {
      const response = await getPaymentInformation(P_TID);
      setBiddingPaymentData(response.data.response);
      setIsLoading(false);
    } catch {
      Alert.alert("결제 정보를 불러오지 못했습니다.");
    }
  };

  function handleInvoicePaymnt() {
    navigation.navigate("Payment", { telemedicineData: telemedicineData });
  }

  function formatDate(inputDate) {
    const year = inputDate.slice(0, 4);
    const month = inputDate.slice(4, 6);
    const day = inputDate.slice(6, 8);
    const hour = inputDate.slice(8, 10);
    const minute = inputDate.slice(10, 12);

    const formattedDate = `${year}.${month}.${day} (${hour}:${minute})`;
    return formattedDate;
  }

  function convertToHashtags(dataArray) {
    const hashtags = dataArray.map((tag) => `#${tag}`).join(" ");
    return hashtags;
  }

  if (isLoading) {
    return null;
  }

  return (
    <SafeArea>
      <Container>
        <ScrollView>
          <PaddingContainer>
            <Text T7 color={COLOR.GRAY1} mTop={30}>
              {telemedicineData.date} ({telemedicineData.time})
            </Text>
            <Text T3 bold mTop={6}>
              {telemedicineData.doctorInfo.department_name} /{" "}
              {telemedicineData.profileInfo.passport?.user_name ??
                telemedicineData.profileInfo.passapp_certification?.name}
              님 ({telemedicineData.profileInfo.relationship})
            </Text>
            <Text T6 medium color={COLOR.GRAY1} mTop={12}>
              {telemedicineData?.explain_symptom}
            </Text>
          </PaddingContainer>

          <DoctorContainer>
            <Image
              source={{
                uri:
                  telemedicineData.doctorInfo?.attachments?.[0]?.Location ??
                  telemedicineData.doctorInfo.photo,
              }}
              circle
              width={66}
              height={66}
            />
            <CardDoctorInfoColumn>
              <Text T4 bold>
                {telemedicineData.doctorInfo.name} 교수
              </Text>
              <Text T7 bold color={COLOR.GRAY2}>
                {telemedicineData.doctorInfo.hospital_name} /{" "}
                {telemedicineData.doctorInfo.department_name}
              </Text>
              <StyledText T7 color={COLOR.GRAY1}>
                {convertToHashtags(telemedicineData.doctorInfo.strengths)}
              </StyledText>
            </CardDoctorInfoColumn>
          </DoctorContainer>

          <PaddingContainer>
            <Text T3 bold mTop={24}>
              전자 소견서
            </Text>
            <Center>
              <Box height={24} />
              <Text T3 bold mTop={12}>
                추가 결제 필요
              </Text>
              <Text T6 medium center color={COLOR.GRAY1} mTop={12}>
                상담을 연장했기 때문에{"\n"}결제 후 소견서를 확인하실 수
                있습니다
              </Text>
            </Center>
          </PaddingContainer>

          <DividingLine mTop={36} />

          <PaddingContainer>
            <Text T3 bold mTop={24}>
              결제 내역
            </Text>
            <Text T3 bold color={COLOR.MAIN} mTop={20}>
              상담 예약 {Number(biddingPaymentData.price)?.toLocaleString()}원
            </Text>
            <Row mTop={18}>
              <Text T6 medium color={COLOR.GRAY1} mRight={42}>
                결제 금액
              </Text>
              <Text T6 color={COLOR.GRAY1}>
                {Number(biddingPaymentData.price)?.toLocaleString()}원 | 일시불
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
                {formatDate(biddingData?.P_AUTH_DT)}
              </Text>
            </Row>
          </PaddingContainer>

          <PaddingContainer>
            <SolidButton
              text="추가 결제하기"
              mTop={24}
              action={() => handleInvoicePaymnt()}
            />
          </PaddingContainer>

          <Box height={100} />
        </ScrollView>
      </Container>
    </SafeArea>
  );
}

const DoctorContainer = styled.View`
  margin-top: 24px;
  width: 100%;
  padding: 20px;
  flex-direction: row;
  align-items: center;
  background-color: ${COLOR.GRAY6};
`;

const CardDoctorInfoColumn = styled.View`
  margin-left: 24px;
`;

const Center = styled.View`
  width: 100%;
  align-items: center;
`;

const StyledText = styled(Text)`
  width: 230px;
  margin-top: 12px;
`;
