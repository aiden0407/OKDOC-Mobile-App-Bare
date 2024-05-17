//React
import { useState, useEffect, useContext } from "react";
import { ApiContext } from "context/ApiContext";
import { useIsFocused } from "@react-navigation/native";
import styled from "styled-components/native";
import useTestAccount from "hook/useTestAccount";
import { ENV } from "constants/api";

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
// import * as Clipboard from "expo-clipboard";

//Api
import {
  getInvoicePurchaseInformation,
  getTreatmentResults,
} from "api/History";

//Expo Print
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

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

const TelemedicineDetailScreen = ({ navigation, route }) => {
  const {
    state: { accountData },
  } = useContext(ApiContext);
  const [isLoading, setIsLoading] = useState(true);
  const [invoicePaymentData, setInvoicePaymentData] = useState();
  const [needInvoicePayment, setNeedInvoicePayment] = useState(false);
  const telemedicineData = route.params.telemedicineData;
  const biddingId = telemedicineData.bidding_id;
  const isFocused = useIsFocused();

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
    if (isFocused) {
      initData();
    }
  }, [isFocused]);

  const initData = async function () {
    // await Clipboard.setStringAsync(JSON.stringify(telemedicineData));
    if (ENV === "production" && useTestAccount(accountData.email)) {
      const internalSkus = [IAP_PRODUCT_ID.INTERNAL_TOKEN];
      await getProducts({ skus: internalSkus });
    } else {
      await getProducts({ skus });
    }

    try {
      const response = await getTreatmentResults(
        accountData.loginToken,
        telemedicineData.id
      );
      telemedicineData.opinion = response.data.response[0];
    } catch (error) {
      if (error.data.statusCode === 404) {
        //소견서 작성중
      } else {
        Alert.alert(
          "오류",
          "네트워크 에러로 인해 소견서를 불러오지 못했습니다."
        );
      }
    }

    if (telemedicineData?.invoiceInfo) {
      try {
        const response = await getInvoicePurchaseInformation(
          accountData.loginToken,
          telemedicineData.invoiceInfo.id
        );
        setInvoicePaymentData(response.data.response?.[0]);
        // await Clipboard.setStringAsync(
        //   JSON.stringify(response.data.response?.[0])
        // );
      } catch {
        setNeedInvoicePayment(true);
      }
    }

    setIsLoading(false);
  };

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
            console.log("==========consumeAndroidInvoice start==========");
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
                  navigation.replace("PaymentComplete", {
                    telemedicineData: telemedicineData,
                  });
                } catch (error) {
                  console.log("unlockAndroidPurchase error: ", error?.data);
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

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    return `${year}.${month}.${day} (${hour}:${minute})`;
  }

  function formatDate2(inputDate) {
    const year = inputDate.substring(0, 4);
    const month = inputDate.substring(4, 6);
    const day = inputDate.substring(6, 8);
    return `${year}.${month}.${day}`;
  }

  function formatDate3(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  }

  function concatenateDeasesName(arr) {
    const koreanNames = arr.map((obj) => obj.한글명);
    const concatenatedString = koreanNames.join(", ");
    return concatenatedString;
  }

  function concatenateDeasesId(arr) {
    const koreanNames = arr.map((obj) => obj.상병기호);
    const concatenatedString = koreanNames.join(", ");
    return concatenatedString;
  }

  function convertToHashtags(dataArray) {
    const hashtags = dataArray.map((tag) => `#${tag}`).join(" ");
    return hashtags;
  }

  const handleViewTelemedicineOpinion = async () => {
    const html = `
    <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            <link href="//fonts.googleapis.com/earlyaccess/nanumgothic.css" rel="stylesheet" type="text/css">

            <style>
                html {
                    display: flex;
                    justify-content: center;
                }
                body {
                    font-family: 'Nanumgothic';
                    height: 842;
                    width: 595;
                    padding: 25 40;
                    font-size: 11;
                }
                p {
                    margin: 0;
                }
                div {
                    box-sizing: border-box;
                }
                .watermark {
                    position: absolute;
                    top: 260;
                    left: 54%;
                    transform: translate(-50%, 0%);
                    width: 300;
                    opacity: 0.2;
                }
                .main {
                    font-size: 20;
                    font-weight: 700;
                    text-align: center;
                }
                .title {
                    text-align: center;
                    font-weight: 700;
                }
                .content {
                    text-align: start;
                }
                .row1 {
                    margin-top: 30;
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                }
                .titleBox1 {
                    min-width: 80;
                    height: 24;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 1px solid #7A7A7A;
                    background-color: #F0F0F0;
                }
                .contentBox1 {
                    padding: 0 10px;
                    width: 100%;
                    height: 24;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    border: 1px solid #7A7A7A;
                }
                .row2 {
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                }
                .column1 {
                    margin-top: 4;
                    margin-left: 12;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 4
                }
                .titleBox2 {
                    min-width: 80;
                    height: 75;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    border: 1px solid #7A7A7A;
                    background-color: #F0F0F0;
                }
                .contentBox2 {
                    padding: 0 10px;
                    width: 100%;
                    height: 75;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    border: 1px solid #7A7A7A;
                }
                .titleBox3 {
                    min-width: 80;
                    height: 460;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 1px solid #7A7A7A;
                    background-color: #F0F0F0;
                    font-size: 10.5;
                }
                .contentBox3 {
                    width: 100%;
                    height: 460;
                    max-height: 460;
                    padding: 10px 10px 60px 10px;
                    display: flex;
                    flex-direction: column;
                    border: 1px solid #7A7A7A;
                    justify-content: space-between;
                }
                .column2 {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 4
                }
                .contentBox4 {
                    width: 100%;
                    height: 170;
                    padding: 10px 30px 30px 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    border: 1px solid #7A7A7A;
                }
                .row3 {
                    margin-top: 10;
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                }
                .row4 {
                    padding: 30px 0 0 30px;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
            </style>
        </head>

        <body>
            <img class='watermark' src="https://unsafe-public-okdoc-user-upload-image.s3.ap-northeast-2.amazonaws.com/eulji-logo.png" alt="인성 아이콘">

            <p class='main'>소견서</p>

            <div class='row1'>
                <div class='titleBox1'>
                    <p class='title'>환자의 성명</p>
                </div>
                <div class='contentBox1'>
                    <p class='content'>${
                      telemedicineData.opinion.treatment_appointment.patient
                        ?.passport?.user_name ??
                      telemedicineData.opinion.treatment_appointment.patient
                        ?.passapp_certification?.name
                    }</p>
                </div>
                <div class='titleBox1'>
                    <p class='title'>환자 생년월일</p>
                </div>
                <div class='contentBox1'>
                    <p class='content'>${
                      telemedicineData.opinion.treatment_appointment.patient
                        ?.passport
                        ? formatDate2(
                            String(
                              telemedicineData.opinion.treatment_appointment
                                .patient?.passport?.birth
                            )
                          )
                        : telemedicineData.opinion.treatment_appointment.patient?.passapp_certification?.birthday.replaceAll(
                            "-",
                            "."
                          )
                    }</p>
                </div>
            </div>

            <div class='row2'>
                <div class='titleBox2'>
                    <p class='title'>병명</p>
                    <div class='column1'>
                        <p>${
                          telemedicineData.opinion.diagnosis_type ===
                          "presumptive"
                            ? "◉ 임상적 추정"
                            : "○ 임상적 추정"
                        }</p>
                        <p>${
                          telemedicineData.opinion.diagnosis_type ===
                          "definitive"
                            ? "◉ 최종 진단"
                            : "○ 최종 진단"
                        }</p>
                    </div>
                </div>
                <div class='contentBox2'>
                    <p class='content'>${concatenateDeasesName(
                      telemedicineData.opinion.diseases
                    )}</p>
                </div>
                <div class='titleBox2'>
                    <p class='title'>질병 분류 기호</p>
                </div>
                <div class='contentBox2'>
                    <p class='content'>${concatenateDeasesId(
                      telemedicineData.opinion.diseases
                    )}</p>
                </div>
            </div>

            <div class='row2'>
                <div class='titleBox3'>
                    <p class='title'>상담 내용 및<br>향후 치료에 대한<br>소견</p>
                </div>
                <div class='contentBox3'>
                    <div class='column2'>
                        <p class='title'>(환자 호소 증상)</p>
                        <p class='content'>${
                          telemedicineData.opinion.chief_complaint
                        }</p>
                        <p class='content'>${
                          telemedicineData.opinion.subjective_symptom
                        }</p>
                    </div>

                    <div class='column2'>
                        <p class='title'>(본 의사의 판단)</p>
                        <p class='content'>${
                          telemedicineData.opinion.objective_finding
                        }</p>
                        <p class='content'>${
                          telemedicineData.opinion.assessment
                        }</p>
                    </div>

                    <div class='column2'>
                        <p class='title'>(치료 계획)</p>
                        <p class='content'>${telemedicineData.opinion.plan}</p>
                    </div>

                    <div class='column2'>
                        <p class='title'>(본 의사의 소견)</p>
                        <p class='content'>${
                          telemedicineData.opinion.medical_opinion
                        }</p>
                    </div>
                </div>
            </div>

            <div class='contentBox4'>
                <p class='content'>상기 상담은 ㈜인성정보의 OK DOC 플랫폼을 통한 원격 상담으로 진행되었으며, 위와 같이 소견합니다.</p>
                <div class='row3'>
                    <p class='content'>${formatDate3(
                      telemedicineData.opinion.createdAt
                    )}</p>
                </div>
                <div class='row4'>
                    <p class='content'>의료기관 명칭 : 의정부을지대학교병원</p>
                    <p class='content'>주소 : 경기도 의정부시 동일로 712 (금오동)</p>
                    <p class='content'>[○]의사 [ ]치과의사 [ ]한의사 면허번호 : 제 ${
                      telemedicineData.opinion.treatment_appointment.doctor.id
                    } 호</p>
                    <br>
                    <p class='content'>
                        성명:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${
                          telemedicineData.opinion.treatment_appointment.doctor
                            .name
                        }
                    </p>
                </div>
            </div>
        </body>
    </html>
    `;

    const { uri } = await Print.printToFileAsync({
      html,
      height: 842,
      width: 595,
    });
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

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

          {telemedicineData?.STATUS === "CANCELED" ? (
            <></>
          ) : (
            <>
              <PaddingContainer>
                <Text T3 bold mTop={24}>
                  전자 소견서
                </Text>
                {needInvoicePayment ? (
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
                ) : telemedicineData?.opinion ? (
                  <CustomSubColorButton
                    underlayColor={COLOR.SUB2}
                    onPress={() => handleViewTelemedicineOpinion()}
                  >
                    <Text T5 medium color={COLOR.MAIN}>
                      전자 소견서 저장
                    </Text>
                  </CustomSubColorButton>
                ) : telemedicineData?.STATUS === "ABNORMAL_FINISHED" ? (
                  <Center>
                    <Box height={24} />
                    <Text T3 bold mTop={12}>
                      작성된 소견서가 없습니다
                    </Text>
                    <Text T6 medium center color={COLOR.GRAY1} mTop={12}>
                      환자분의 상담 미참여 혹은 짧은 상담으로 인해{"\n"}작성된
                      소견서가 없습니다.
                    </Text>
                  </Center>
                ) : (
                  <Center>
                    <Box height={24} />
                    <Text T3 bold mTop={12}>
                      전자 소견서 작성중
                    </Text>
                    <Text T6 medium center color={COLOR.GRAY1} mTop={12}>
                      담당 의사가 소견서를 작성중입니다{"\n"}잠시만 기다려주세요
                    </Text>
                  </Center>
                )}
              </PaddingContainer>
              <DividingLine mTop={36} />
            </>
          )}

          <PaddingContainer>
            <Text T3 bold mTop={24}>
              {telemedicineData?.STATUS === "CANCELED" ? "취소" : "결제"} 내역
            </Text>
            <Text T3 bold color={COLOR.MAIN} mTop={20}>
              진료 상담 예약
            </Text>
            <Row mTop={18}>
              <Text T6 medium color={COLOR.GRAY1} mRight={42}>
                결제 금액
              </Text>
              <Text T6 color={COLOR.GRAY1}>
                {telemedicineData.fullDocument?.appleIapUnsignedTransaction ||
                telemedicineData.fullDocument?.googleIapProductPurchase
                  ? "130,000원 | 일시불"
                  : "0원"}
              </Text>
            </Row>
            <Row mTop={6}>
              <Text T6 medium color={COLOR.GRAY1} mRight={42}>
                결제 수단
              </Text>
              <Text T6 color={COLOR.GRAY1}>
                {telemedicineData.fullDocument?.appleIapUnsignedTransaction ||
                telemedicineData.fullDocument?.googleIapProductPurchase
                  ? "인앱결제"
                  : "프로모션"}
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
            {telemedicineData?.STATUS === "CANCELED" &&
            (telemedicineData.fullDocument?.appleIapUnsignedTransaction ||
              telemedicineData.fullDocument?.googleIapProductPurchase) ? (
              <Row mTop={6}>
                <Text T6 medium color={COLOR.GRAY1} mRight={42}>
                  반환 내역
                </Text>
                <Text T6 color={COLOR.GRAY1}>
                  이용권 1매
                </Text>
              </Row>
            ) : (
              <></>
            )}
          </PaddingContainer>

          {invoicePaymentData ? (
            <PaddingContainer>
              <Text T3 bold color={COLOR.MAIN} mTop={36}>
                진료 상담 연장
              </Text>
              <Row mTop={18}>
                <Text T6 medium color={COLOR.GRAY1} mRight={42}>
                  결제 금액
                </Text>
                <Text T6 color={COLOR.GRAY1}>
                  {telemedicineData.fullDocument?.appleIapUnsignedTransaction ||
                  telemedicineData.fullDocument?.googleIapProductPurchase
                    ? "50,000원 | 일시불"
                    : "0원"}
                </Text>
              </Row>
              <Row mTop={6}>
                <Text T6 medium color={COLOR.GRAY1} mRight={42}>
                  결제 수단
                </Text>
                <Text T6 color={COLOR.GRAY1}>
                  {telemedicineData.fullDocument?.appleIapUnsignedTransaction ||
                  telemedicineData.fullDocument?.googleIapProductPurchase
                    ? "인앱결제"
                    : "프로모션"}
                </Text>
              </Row>
              <Row mTop={6}>
                <Text T6 medium color={COLOR.GRAY1} mRight={42}>
                  결제 일시
                </Text>
                <Text T6 color={COLOR.GRAY1}>
                  {formatDate(invoicePaymentData?.updatedAt)}
                </Text>
              </Row>
            </PaddingContainer>
          ) : null}

          {needInvoicePayment ? (
            <PaddingContainer>
              <SolidButton
                text="추가 결제하기"
                mTop={24}
                action={() => handleInvoicePaymnt()}
              />
            </PaddingContainer>
          ) : null}

          <Box height={100} />
        </ScrollView>
      </Container>
    </SafeArea>
  );
};

export default withIAPContext(TelemedicineDetailScreen);

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

const CustomSubColorButton = styled.TouchableHighlight`
  margin-top: 24px;
  width: ${BUTTON.FULL.WIDTH};
  height: 48px;
  border-radius: ${BUTTON.FULL.BORDER_RADIUS};
  background-color: ${COLOR.SUB3};
  align-items: center;
  justify-content: center;
`;

const Center = styled.View`
  width: 100%;
  align-items: center;
`;

const StyledText = styled(Text)`
  width: 230px;
  margin-top: 12px;
`;
