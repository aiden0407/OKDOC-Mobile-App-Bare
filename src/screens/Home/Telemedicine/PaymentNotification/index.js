//React
import { useState, useEffect, useContext } from "react";
import { ApiContext } from "context/ApiContext";
import { AppContext } from "context/AppContext";
import styled from "styled-components/native";
import useVersionCheck from "hook/useVersionCheck";
import useTestAccount from "hook/useTestAccount";
import { ENV } from "constants/api";

//Components
import { CONSTANT_POLICY } from "constants/service";
import { COLOR } from "constants/design";
import { Alert, ActivityIndicator, Platform, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "components/Image";
import {
  SafeArea,
  ScrollView,
  Row,
  DividingLine,
  PaddingContainer,
} from "components/Layout";
import { Text } from "components/Text";
import { SolidButton } from "components/Button";

//Api
import {
  getScheduleByPatientId,
  getBiddingInformation,
  createBidding,
  // merchantCashlessBidding,
} from "api/Home";

import {
  getIosReuseBidding,
  getAndroidReuseBidding,
  consumeIosBidding,
  consumeAndroidBidding,
  unlockIosPurchase,
  unlockAndroidBidding,
} from "api/Iap";
import { IAP_PRODUCT_ID } from "constants/service";

//Assets
import exclamationIcon from "assets/icons/circle-exclamation.png";

// react-native-iap
import { withIAPContext, requestPurchase, useIAP } from "react-native-iap";
const skus = [IAP_PRODUCT_ID.TREATMENT_APPOINTMENT];

const PaymentNotificationScreen = ({ navigation }) => {
  const [paymentAgreement, setPaymentAgreement] = useState(false);
  const [refundAgreement, setRefundAgreement] = useState(false);
  const [processStatus, setProcessStatus] = useState("BEFORE");
  const [isAppointmentProcessStart, setIsAppointmentProcessStart] =
    useState(false);
  const isLastestVersion = useVersionCheck();
  const {
    state: { accountData, productList, reuseTickets },
  } = useContext(ApiContext);
  const {
    state: { telemedicineReservationStatus },
    dispatch,
  } = useContext(AppContext);

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

  function handlePaymentPolicyDetail() {
    navigation.navigate("PaymentPolicyDetail", {
      content: CONSTANT_POLICY.THIRD_PARTY,
    });
  }

  function handleRefundPolicyDetail() {
    navigation.navigate("PaymentPolicyDetail", {
      content: CONSTANT_POLICY.REFUND,
    });
  }

  const handleProceedPayment = async function () {
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
      return;
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
      return;
    }

    setProcessStatus("LOADING");

    try {
      const response = await getScheduleByPatientId(
        accountData.loginToken,
        telemedicineReservationStatus.profileInfo?.id
      );
      const appointmentList = response.data.response;
      let appointmentExist = false;

      for (let ii = 0; ii < appointmentList.length; ii++) {
        const appointment = appointmentList[ii];
        try {
          const response = await getBiddingInformation(
            accountData.loginToken,
            appointment.bidding_id
          );
          const biddingInfo = response.data.response;
          if (
            biddingInfo.wish_at ===
            telemedicineReservationStatus.doctorInfo.scheduleTime
          ) {
            appointmentExist = true;
          }
        } catch {
          setProcessStatus("BEFORE");
          Alert.alert(
            "오류",
            "네트워크 에러로 인해 정보를 불러오지 못했습니다."
          );
          break;
        }
      }

      if (appointmentExist) {
        setProcessStatus("BEFORE");
        Alert.alert("예약 오류", "동일 시간대에 이미 예약이 되어있습니다.");
      } else {
        createBiddingAndReserve();
      }
    } catch (error) {
      if (error?.status === 404) {
        // 예약되어 있는 진료 없음
        createBiddingAndReserve();
      } else {
        setProcessStatus("BEFORE");
        Alert.alert(
          "네트워크 에러",
          "상담 목록 불러오기를 실패하였습니다. 다시 시도해 주시기 바랍니다."
        );
      }
    }
  };

  const createBiddingAndReserve = async function () {
    try {
      const response = await createBidding(
        accountData.loginToken,
        telemedicineReservationStatus
      );
      const biddingId = response.data.response.id;
      dispatch({
        type: "TELEMEDICINE_RESERVATION_BIDDING_ID",
        biddingId: biddingId,
      });
      setIsAppointmentProcessStart(true);

      // 확정되지 않은 구매가 있을 경우 신규 구매X
      if (currentPurchase) {
        return;
      }

      // 인앱결제 ios reuse 확인
      try {
        const iosReuseResponse = await getIosReuseBidding(
          accountData.loginToken
        );

        // reuse 가능한 Bidding이 있으므로 해당 구매 정보로 재구매
        try {
          const consumeResponse = await consumeIosBidding(
            accountData.loginToken,
            biddingId,
            iosReuseResponse.data.response[0].docs[0].fullDocument
              .appleIapUnsignedTransaction.transactionId
          );
          const purchaseId = consumeResponse.data.response.id;
          console.log(
            "transactionId",
            iosReuseResponse.data.response[0].docs[0].fullDocument
              .appleIapUnsignedTransaction.transactionId
          );
          setProcessStatus("BEFORE");

          try {
            await unlockIosPurchase(accountData.loginToken, purchaseId);
            setProcessStatus("BEFORE");
            navigation.navigate("TelemedicineReservationPayment", {
              screen: "PaymentComplete",
              params: {
                biddingId: biddingId,
                type: "이용권 사용",
              },
            });
          } catch (error) {
            if (error?.data?.statusCode === 422) {
              // 재사용권 transaction 복구됨 (환불)
            } else {
              console.log("unlockIosPurchase error: ", error?.data);
              Alert.alert(
                "예약 오류",
                "구매 확정 오류가 발생했습니다. 관리자에게 문의해 주시기 바랍니다."
              );
              setProcessStatus("BEFORE");
            }
          }
        } catch (error) {
          console.log("consumeIosBidding error: ", error?.data);
          Alert.alert(
            "예약 오류",
            "예약 과정에서 오류가 발생했습니다. 관리자에게 문의해 주시기 바랍니다."
          );
          setProcessStatus("BEFORE");
        }
      } catch (error) {
        // statusCode 404의 경우 ios reuse가 없으므로 android reuse를 확인
        try {
          const androidReuseResponse = await getAndroidReuseBidding(
            accountData.loginToken
          );
          // reuse 가능한 Bidding이 있으므로 해당 구매 정보로 재구매
          try {
            const consumeResponse = await consumeAndroidBidding(
              accountData.loginToken,
              biddingId,
              androidReuseResponse.data.response[0].docs[0].fullDocument
                .googleIapProductPurchase.orderId,
              androidReuseResponse.data.response[0].docs[0].fullDocument
                .googleIapProductPurchase.purchaseToken
            );
            const purchaseId = consumeResponse.data.response.id;

            try {
              await unlockAndroidBidding(
                accountData.loginToken,
                purchaseId,
                androidReuseResponse.data.response[0].docs[0].fullDocument
                  .googleIapProductPurchase.purchaseToken
              );
              setProcessStatus("BEFORE");
              navigation.navigate("TelemedicineReservationPayment", {
                screen: "PaymentComplete",
                params: {
                  biddingId: biddingId,
                  type: "이용권 사용",
                },
              });
            } catch (error) {
              console.log("unlockAndroidBidding error: ", error?.data);
              Alert.alert(
                "예약 오류",
                "구매 확정 오류가 발생했습니다. 관리자에게 문의해 주시기 바랍니다."
              );
              setProcessStatus("BEFORE");
            }
          } catch (error) {
            console.log("consumeAndroidBidding error: ", error?.data);
            Alert.alert(
              "예약 오류",
              "예약 과정에서 오류가 발생했습니다. 관리자에게 문의해 주시기 바랍니다."
            );
            setProcessStatus("BEFORE");
          }
        } catch (error) {
          // ios, android 둘다 reuse가 없으므로 인앱결제를 시행
          if (error.data.statusCode === 404) {
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
              // 유저가 인앱결제창 나감
              setProcessStatus("NOTICE");
            }
          }
        }
      }
    } catch (error) {
      console.log("createBidding error: ", error?.data);
      setProcessStatus("BEFORE");
      Alert.alert("결제 정보 생성 실패", "고객센터로 문의해주시기 바랍니다.");
    }
  };

  useEffect(() => {
    console.log("currentPurchase", currentPurchase);
    if (currentPurchase && isAppointmentProcessStart) {
      const makeTreatmentAppointment = async () => {
        if (Platform.OS === "ios") {
          try {
            const consumeResponse = await consumeIosBidding(
              accountData.loginToken,
              telemedicineReservationStatus.biddingId,
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
                  setProcessStatus("BEFORE");
                  navigation.navigate("TelemedicineReservationPayment", {
                    screen: "PaymentComplete",
                    params: {
                      biddingId: telemedicineReservationStatus.biddingId,
                      type: "인앱결제",
                    },
                  });
                } catch (error) {
                  console.log("unlockIosPurchase error: ", error?.data);
                  setProcessStatus("BEFORE");
                }
              }, 2000);
            } catch (error) {
              console.log("finishTransaction error: ", error?.data);
              setProcessStatus("BEFORE");
            }
          } catch (error) {
            console.log("consumeIosBidding error: ", error?.data);
            setProcessStatus("BEFORE");
            Alert.alert("예약 실패", "고객센터로 문의해주시기 바랍니다.");
          }
        } else {
          const purchaseToken = currentPurchase.purchaseToken;
          try {
            const consumeResponse = await consumeAndroidBidding(
              accountData.loginToken,
              telemedicineReservationStatus.biddingId,
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
                  await unlockAndroidBidding(
                    accountData.loginToken,
                    purchaseId,
                    purchaseToken
                  );
                  setProcessStatus("BEFORE");
                  navigation.navigate("TelemedicineReservationPayment", {
                    screen: "PaymentComplete",
                    params: {
                      biddingId: telemedicineReservationStatus.biddingId,
                      type: "인앱결제",
                    },
                  });
                } catch (error) {
                  console.log("unlockAndroidBidding error: ", error?.data);
                  setProcessStatus("BEFORE");
                }
              }, 2000);
            } catch (error) {
              console.log("finishTransaction error: ", error?.data);
              setProcessStatus("BEFORE");
            }
          } catch (error) {
            console.log("consumeIosBidding error: ", error?.data);
            setProcessStatus("BEFORE");
            Alert.alert("예약 실패", "고객센터로 문의해주시기 바랍니다.");
          }
        }
      };

      makeTreatmentAppointment();
    }
  }, [currentPurchase]);

  return (
    <>
      <SafeArea>
        <ScrollView>
          <PaddingContainer>
            <Text T3 bold mTop={30}>
              의료 상담을 위해{"\n"}예약하신 정보를 확인 해주세요
            </Text>
            <Row mTop={24}>
              <Text T3 bold color={COLOR.MAIN}>
                비용{" "}
                {telemedicineReservationStatus.product.price?.toLocaleString()}
                원
              </Text>
              {telemedicineReservationStatus.product.price === 0 && (
                <StyledText T6 medium color={COLOR.GRAY2} mTop={8} mLeft={6}>
                  130,000원
                </StyledText>
              )}
            </Row>
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
                {telemedicineReservationStatus?.doctorInfo?.subject} / 의료 상담
              </Text>
            </Row>
            <Row align mTop={12}>
              <Ionicons name="checkmark-sharp" size={18} color={COLOR.MAIN} />
              <Text T6 medium mLeft={6}>
                2024년 {telemedicineReservationStatus?.date?.substr(0, 2)}월{" "}
                {telemedicineReservationStatus?.date?.substr(-2)}일 (
                {telemedicineReservationStatus.time})
              </Text>
            </Row>
            <Row align mTop={12}>
              <Ionicons name="checkmark-sharp" size={18} color={COLOR.MAIN} />
              <Text T6 medium mLeft={6}>
                예약자 : {telemedicineReservationStatus.profileInfo.name}
              </Text>
            </Row>
          </PaddingContainer>

          <DividingLine mTop={30} />

          <PaddingContainer>
            <Text T3 bold mTop={30}>
              유의사항
            </Text>
            <Row mTop={15}>
              <Ionicons name="checkmark-sharp" size={18} color={COLOR.MAIN} />
              <Text T6 bold color={COLOR.MAIN} mLeft={6}>
                대한민국에서는 상담실 입장이 제한됩니다.
              </Text>
            </Row>
            <Row mTop={15}>
              <Ionicons name="checkmark-sharp" size={18} color={COLOR.MAIN} />
              <Text T6 bold color={COLOR.MAIN} mLeft={6}>
                현지 약 처방 및 배송은 제공하지 않습니다.
              </Text>
            </Row>
            <Row mTop={15}>
              <Ionicons name="checkmark-sharp" size={18} color={COLOR.MAIN} />
              <Text T6 medium mLeft={6}>
                재외국민 비대면 의료 상담은 비급여 항목 입니다.
              </Text>
            </Row>
            <Row mTop={15}>
              <Ionicons name="checkmark-sharp" size={18} color={COLOR.MAIN} />
              <Text T6 medium mLeft={6}>
                기본 10분 상담이며, 추가로 5분 연장 가능합니다.
              </Text>
            </Row>
            {productList[2].price !== 0 && (
              <Row mTop={15}>
                <Ionicons name="checkmark-sharp" size={18} color={COLOR.MAIN} />
                <Text T6 medium mLeft={6}>
                  상담 시간 연장 시 {productList[2].price.toLocaleString()}원의
                  추가 비용이 발생합니다.
                </Text>
              </Row>
            )}
          </PaddingContainer>

          <DividingLine mTop={30} />

          <PaddingContainer>
            <Text T3 bold mTop={30}>
              결제 내용 확인 및 결제 동의
            </Text>
            <Row mTop={15} align>
              <AgreeRow onPress={() => setPaymentAgreement(!paymentAgreement)}>
                <Ionicons
                  name="checkbox"
                  size={22}
                  color={paymentAgreement ? COLOR.MAIN : COLOR.GRAY3}
                />
                <Text T6 bold mBottom={1.5} mLeft={6}>
                  [필수]{" "}
                </Text>
                <Text T6 medium>
                  개인정보 제3자 제공 동의
                </Text>
              </AgreeRow>
              <PolicyDetailIconWrapper
                onPress={() => handlePaymentPolicyDetail()}
              >
                <Ionicons name="chevron-forward" size={22} />
              </PolicyDetailIconWrapper>
            </Row>
            <Row mTop={15} align>
              <AgreeRow onPress={() => setRefundAgreement(!refundAgreement)}>
                <Ionicons
                  name="checkbox"
                  size={22}
                  color={refundAgreement ? COLOR.MAIN : COLOR.GRAY3}
                />
                <Text T6 bold mBottom={1.5} mLeft={6}>
                  [필수]{" "}
                </Text>
                <Text T6 medium>
                  취소 및 환불 규정 동의
                </Text>
              </AgreeRow>
              <PolicyDetailIconWrapper
                onPress={() => handleRefundPolicyDetail()}
              >
                <Ionicons name="chevron-forward" size={22} />
              </PolicyDetailIconWrapper>
            </Row>
            <RefundPolicyNotificationContainer>
              <Row align>
                <BulletPoint />
                <Text T7 color={COLOR.GRAY2}>
                  상담 시작 5분 전 : 진료 상담 1회 이용권 환불
                </Text>
              </Row>
              <Row align>
                <BulletPoint />
                <Text T7 color={COLOR.GRAY2}>
                  이외 시간 : 환불 불가
                </Text>
              </Row>
              <Row align>
                <BulletPoint />
                <Text T7 color={COLOR.GRAY2}>
                  결제에 대한 환불 등의 조치가 필요한 경우{" "}
                  {Platform.OS === "ios" ? "앱스토어" : "구글 플레이스토어"}{" "}
                  환불 운영 정책 및 절차에 따라 처리합니다.
                </Text>
              </Row>
            </RefundPolicyNotificationContainer>

            <SolidButton
              mTop={60}
              mBottom={20}
              text={
                reuseTickets > 0 ? "결제하기 (잔여 이용권 사용)" : "결제하기"
              }
              disabled={!paymentAgreement || !refundAgreement}
              action={async () => {
                if (
                  Platform.OS === "ios" &&
                  ENV === "production" &&
                  useTestAccount(accountData.email)
                ) {
                  const internalSkus = [IAP_PRODUCT_ID.INTERNAL_TOKEN];
                  await getProducts({ skus: internalSkus });
                } else {
                  await getProducts({ skus });
                }
                setProcessStatus("NOTICE");
              }}
            />
          </PaddingContainer>
        </ScrollView>
      </SafeArea>

      {processStatus !== "BEFORE" && (
        <BottomSheetBackground>
          <BottomSheetContainer>
            {processStatus === "NOTICE" && (
              <>
                <Image
                  source={exclamationIcon}
                  width={70}
                  height={70}
                  mTop={-20}
                />
                <Text T4 medium center mTop={12}>
                  유의사항을 모두 확인하였으며,{"\n"}이에 동의하고 결제를
                  진행하시겠습니까?
                </Text>
                <Row gap={24} mTop={30}>
                  <DisabledButtonWrapper
                    onPress={() => setProcessStatus("BEFORE")}
                  >
                    <SolidButton disabled medium text="뒤로가기" />
                  </DisabledButtonWrapper>
                  <SolidButton
                    medium
                    text="결제하기"
                    action={() => handleProceedPayment()}
                  />
                </Row>
              </>
            )}
            {processStatus === "LOADING" && (
              <>
                <ActivityIndicator size="large" color="#5500CC" />
                <Text T4 medium center mTop={30} mBottom={50}>
                  결제를 진행중입니다.{"\n"}잠시만 기다려 주시기 바랍니다.
                </Text>
              </>
            )}
          </BottomSheetContainer>
        </BottomSheetBackground>
      )}
    </>
  );
};

export default withIAPContext(PaymentNotificationScreen);

const LoadingBackground = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffffdd;
`;

const AgreeRow = styled.Pressable`
  flex-direction: row;
  align-items: center;
`;

const PolicyDetailIconWrapper = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  bottom: -3px;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
`;

const RefundPolicyNotificationContainer = styled.View`
  margin-top: 18px;
  width: 100%;
  padding: 18px 24px;
  background-color: ${COLOR.GRAY6};
  border-radius: 10px;
  gap: 8px;
`;

const BulletPoint = styled.View`
  margin-right: 6px;
  width: 3px;
  height: 3px;
  border-radius: 50px;
  background-color: ${COLOR.GRAY1};
`;

const BottomSheetBackground = styled.Pressable`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #000000aa;
`;

const BottomSheetContainer = styled.View`
  position: absolute;
  height: 340px;
  width: 100%;
  bottom: 0;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
`;

const DisabledButtonWrapper = styled.Pressable``;

const StyledText = styled(Text)`
  text-decoration-line: line-through;
  text-decoration-color: ${COLOR.GRAY2};
`;
