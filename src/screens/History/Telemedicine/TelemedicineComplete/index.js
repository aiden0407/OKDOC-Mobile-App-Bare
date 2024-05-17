//React
import { useState, useEffect, useContext } from "react";
import { ApiContext } from "context/ApiContext";
import useHistoryUpdate from "hook/useHistoryUpdate";
import useAlarmUpdate from "hook/useAlarmUpdate";
import { dataDogFrontendError } from "api/DataDog";
import useTestAccount from "hook/useTestAccount";
import { ENV } from "constants/api";

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
import { patchCCTVPatientBye, getInvoiceInformation } from "api/History";

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

const TelemedicineCompleteScreen = ({ navigation, route }) => {
  const { refresh } = useHistoryUpdate();
  const { refreshAlarm } = useAlarmUpdate();
  const {
    state: { accountData },
  } = useContext(ApiContext);
  const [invoiceInformation, setInvoiceInformation] = useState();
  const telemedicineData = route.params.telemedicineData;

  const {
    initConnectionError,
    currentPurchase,
    products,
    getProducts,
    finishTransaction,
  } = useIAP();

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
      Alert.alert("오류", "네트워크 에러로 인해 정보를 불러오지 못했습니다.");
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
      if (ENV === "production" && useTestAccount(accountData.email)) {
        const internalSkus = [IAP_PRODUCT_ID.INTERNAL_TOKEN];
        await getProducts({ skus: internalSkus });
      } else {
        await getProducts({ skus });
      }
    } catch (error) {
      if (error?.data?.statusCode === 404) {
        // 진료 연장을 하지 않은 경우 바로 리프레쉬
        refresh();
        refreshAlarm();
      } else {
        Alert.alert("오류", "네트워크 에러로 인해 정보를 불러오지 못했습니다.");
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
    } else {
      navigation.navigate("HistoryStackNavigation", {
        screen: "TelemedicineDetail",
        params: { telemedicineData: telemedicineData },
      });
    }
  };

  useEffect(() => {
    if (currentPurchase) {
      const makeTreatmentAppointment = async () => {
        if (Platform.OS === "ios") {
          try {
            const consumeResponse = await consumeIosInvoice(
              accountData.loginToken,
              invoiceInformation.id,
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
              invoiceInformation.id,
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
                  navigation.replace("PaymentComplete", {
                    telemedicineData: telemedicineData,
                  });
                } catch (error) {
                  console.log("unlockAndroidInvoice error: ", error);
                }
              }, 2000);
            } catch (error) {
              console.log("finishTransaction error: ", error?.data);
            }
          } catch (error) {
            console.log("consumeAndroidInvoice error: ", error?.data);
          }
        }
      };

      makeTreatmentAppointment();
    }
  }, [currentPurchase]);

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
          text={invoiceInformation ? "추가요금 결제하기" : "다음으로"}
          mBottom={20}
          disabled={false}
          action={() => handleNextScreen()}
        />
      </Container>
    </SafeArea>
  );
};

export default withIAPContext(TelemedicineCompleteScreen);
