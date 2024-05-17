//React
import { useEffect, useContext } from "react";
import { ApiContext } from "context/ApiContext";
import styled from "styled-components/native";
import useTestAccount from "hook/useTestAccount";
import { ENV } from "constants/api";

//Components
import { COLOR } from "constants/design";
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

// react-native-iap
import {
  consumeIosInvoice,
  consumeAndroidInvoice,
  unlockIosPurchase,
  unlockAndroidInvoice,
} from "api/Iap";
import { IAP_PRODUCT_ID } from "constants/service";
import { withIAPContext, requestPurchase, useIAP } from "react-native-iap";
const skus = [IAP_PRODUCT_ID.TREATMENT_EXTENSION];

const NeedPaymentDetailScreen = ({ navigation, route }) => {
  const {
    state: { accountData },
  } = useContext(ApiContext);
  const telemedicineData = route.params.telemedicineData;

  const {
    initConnectionError,
    currentPurchase,
    products,
    getProducts,
    finishTransaction,
  } = useIAP();

  useEffect(() => {
    initData();
  }, []);

  const initData = async function () {
    if (ENV === "production" && useTestAccount(accountData.email)) {
      const internalSkus = [IAP_PRODUCT_ID.INTERNAL_TOKEN];
      await getProducts({ skus: internalSkus });
    } else {
      await getProducts({ skus });
    }
  };

  useEffect(() => {
    if (initConnectionError) {
      Alert.alert(
        "오류",
        `${
          Platform.OS === "ios" ? "앱스토어" : "구글 플레이 스토어"
        } 연결 오류가 발생했습니다. 앱을 다시 실행시켜 주시기 바랍니다.`
      );
    }
  }, [initConnectionError]);

  async function handleInvoicePaymnt() {
    // 인앱결제 프로세스
    const params = Platform.select({
      ios: {
        sku: products[0].productId,
      },
      android: {
        skus: [products[0].productId],
      },
    });
    try {
      await requestPurchase(params);
    } catch (error) {
      if (error?.code === "E_USER_CANCELLED") {
        // 유저가 결제창을 나감
      } else {
        dataDogFrontendError(error);
      }
    }
  }

  useEffect(() => {
    if (currentPurchase) {
      const makeTreatmentAppointment = async () => {
        if (Platform.OS === "ios") {
          try {
            const consumeResponse = await consumeIosInvoice(
              accountData.loginToken,
              telemedicineData.invoiceInfo.id,
              currentPurchase.transactionId
            );
            const purchaseId = consumeResponse.data.response.id;

            try {
              await finishTransaction({
                purchase: currentPurchase,
                isConsumable: true,
                developerPayloadAndroid: undefined,
              });

              setTimeout(async () => {
                try {
                  await unlockIosPurchase(accountData.loginToken, purchaseId);
                  navigation.replace("PaymentComplete", {
                    telemedicineData: telemedicineData,
                  });
                } catch (error) {
                  console.log("unlockIosPurchase error: ", error?.data);
                }
              }, 2000);
            } catch (error) {
              console.log("finishTransaction error: ", error?.data);
            }
          } catch (error) {
            console.log("consumeIosInvoice error: ", error?.data);
          }
        } else {
          const purchaseToken = currentPurchase.purchaseToken;
          try {
            const consumeResponse = await consumeAndroidInvoice(
              accountData.loginToken,
              telemedicineData.invoiceInfo.id,
              currentPurchase.transactionId,
              purchaseToken
            );
            const purchaseId = consumeResponse.data.response.id;

            try {
              await finishTransaction({
                purchase: currentPurchase,
                isConsumable: true,
                developerPayloadAndroid: undefined,
              });

              setTimeout(async () => {
                try {
                  await unlockAndroidInvoice(
                    accountData.loginToken,
                    purchaseId,
                    purchaseToken
                  );
                  navigation.replace("TelemedicineRoomNavigation", {
                    screen: "PaymentComplete",
                    params: { telemedicineData: telemedicineData },
                  });
                } catch (error) {
                  console.log("unlockAndroidPurchase error: ", error?.data);
                }
              }, 2000);
            } catch (error) {
              console.log("finishTransaction error: ", error?.data);
            }
          } catch (error) {
            console.log("consumeAndroidInvoice error: ", error);
          }
        }
      };

      makeTreatmentAppointment();
    }
  }, [currentPurchase]);

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    return `${year}.${month}.${day} (${hour}:${minute})`;
  }

  function convertToHashtags(dataArray) {
    const hashtags = dataArray.map((tag) => `#${tag}`).join(" ");
    return hashtags;
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
              상담 예약 130,000원
            </Text>
            <Row mTop={18}>
              <Text T6 medium color={COLOR.GRAY1} mRight={42}>
                결제 금액
              </Text>
              <Text T6 color={COLOR.GRAY1}>
                130,000원 | 일시불
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
                {formatDate(telemedicineData?.fullDocument?.updatedAt)}
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
};

export default withIAPContext(NeedPaymentDetailScreen);

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
