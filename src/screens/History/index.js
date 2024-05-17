//React
import { useState, useEffect, useContext } from "react";
import { ApiContext } from "context/ApiContext";
import { AppContext } from "context/AppContext";
import useHistoryUpdate from "hook/useHistoryUpdate";
import useReuseUpdate from "hook/useReuseUpdate";
import styled from "styled-components/native";
import { getCalendars } from "expo-localization";

//Components
import { COLOR } from "constants/design";
import { Alert, ActivityIndicator, RefreshControl } from "react-native";
import {
  SafeArea,
  ScrollView,
  Container,
  ContainerCenter,
  Row,
  DividingLine,
  Box,
} from "components/Layout";
import { Text } from "components/Text";
import { Image } from "components/Image";
import { SolidButton } from "components/Button";
import NeedLogin from "components/NeedLogin";

//Api
import { cancelCashlessPayment } from "api/History";
import { cancelIosPurchase, cancelAndroidPurchase } from "api/Iap";

//Assets
import letterIcon from "assets/icons/mypage-letter.png";

export default function HistoryScreen({ navigation }) {
  const { refresh } = useHistoryUpdate();
  const { updateReuse } = useReuseUpdate();
  const {
    state: { accountData, historyData },
  } = useContext(ApiContext);
  const {
    state: { historyDataLoading },
  } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deviceCalendar, setDeviceCalendar] = useState();

  useEffect(() => {
    const calendar = getCalendars()[0];
    setDeviceCalendar(calendar);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    refresh();
    updateReuse();
  };

  const loadingRefresh = () => {
    setIsLoading(true);
    refresh();
    updateReuse();
  };

  useEffect(() => {
    if (historyDataLoading) {
      if (!refreshing) {
        setIsLoading(true);
      }
    } else {
      setRefreshing(false);
      setIsLoading(false);
    }
  }, [historyDataLoading]);

  function getRemainingTime(wishAt) {
    const wishTime = new Date(wishAt).getTime();
    const currentTime = Date.now();
    const remainingTime = wishTime - currentTime;
    const remainingSeconds = Math.floor(remainingTime / 1000);
    return remainingSeconds;
  }

  function convertToHashtags(dataArray) {
    const hashtags = dataArray.map((tag) => `#${tag}`).join(" ");
    return hashtags;
  }

  function handleCancelReservation(item) {
    Alert.alert(
      "해당 상담 예약을 취소하시겠습니까?",
      "환불 규정에 따라 의료 상담 이용권이 지급됩니다.",
      [
        {
          text: "이전으로",
        },
        {
          text: "예약 취소",
          style: "destructive",
          onPress: () => handleCancelComplete(item),
        },
      ]
    );
  }

  const handleCancelComplete = async function (item) {
    if (getRemainingTime(item.wish_at) < 300) {
      Alert.alert("취소 불가 안내", "상담 5분 전에는 취소가 불가능합니다.", [
        {
          text: "확인",
          onPress: () => loadingRefresh(),
        },
      ]);
    } else {
      try {
        if (item.fullDocument?.appleIapUnsignedTransaction) {
          await cancelIosPurchase(accountData.loginToken, item.purchaseId);
        } else if (item.fullDocument?.googleIapProductPurchase) {
          await cancelAndroidPurchase(accountData.loginToken, item.purchaseId);
        } else {
          await cancelCashlessPayment(accountData.loginToken, item.purchaseId);
        }
        Alert.alert("안내", "해당 예약이 정상적으로 취소되었습니다.", [
          {
            text: "확인",
            onPress: () => {
              loadingRefresh();
            },
          },
        ]);
      } catch {
        Alert.alert(
          "네트워크 에러",
          "예약 취소 중 에러가 발생했습니다. 다시 시도해 주시기 바랍니다.",
          [
            {
              text: "확인",
              onPress: () => loadingRefresh(),
            },
          ]
        );
      }
    }
  };

  function handleEnterTelemedicine(item) {
    navigation.navigate("HistoryStackNavigation", {
      screen: "SymptomDetailCheck",
      params: { telemedicineData: item },
    });
  }

  function handleViewTelemedicineDetail(item) {
    navigation.navigate("HistoryStackNavigation", {
      screen: "TelemedicineDetail",
      params: { telemedicineData: item },
    });
  }

  function handleMakeReservation() {
    navigation.navigate("TelemedicineReservation", { screen: "Category" });
  }

  function handleLogin() {
    navigation.navigate("LoginStackNavigation");
  }

  function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function HistoryCard({ item, type }) {
    return (
      <HistoryCardContainer>
        <CardTitleSection>
          <CardTitleColumn>
            <Text T6 bold>
              {item.doctorInfo.department_name} /{" "}
              {item.profileInfo.passport?.user_name ??
                item.profileInfo.passapp_certification?.name}
              님 ({item.profileInfo.relationship})
            </Text>
            <Text T7 color={COLOR.GRAY1}>
              {item.date} ({item.time})
            </Text>
            {type === "pastHistory" ? (
              <Text T7 color={COLOR.GRAY1}>
                결제{" "}
                {formatNumber(
                  item?.invoiceInfo?.P_TID
                    ? item?.biddingInfo?.product?.price + 50000
                    : item?.biddingInfo?.product?.price
                )}
                원
              </Text>
            ) : null}
          </CardTitleColumn>
          {type === "underReservation" ? (
            getRemainingTime(item?.wish_at) > 0 ? (
              <CardTitleButton
                underlayColor={COLOR.GRAY5}
                onPress={() => handleCancelReservation(item)}
              >
                <Text T7 medium color={COLOR.GRAY1}>
                  예약 취소
                </Text>
              </CardTitleButton>
            ) : (
              <CardTitleButton underlayColor={COLOR.GRAY5}>
                <Text T7 medium color={COLOR.GRAY1}>
                  상담중
                </Text>
              </CardTitleButton>
            )
          ) : item.STATUS === "CANCELED" ? (
            <CardTitleButton>
              <Text T7 medium color={COLOR.GRAY1}>
                취소됨
              </Text>
            </CardTitleButton>
          ) : (
            <CardTitleButton>
              <Text T7 medium color={COLOR.GRAY1}>
                완료
              </Text>
            </CardTitleButton>
          )}
        </CardTitleSection>

        <DividingLine thin />

        <CardDoctorInfoSection>
          <Row>
            <Image
              source={{
                uri:
                  item.doctorInfo?.attachments?.[0]?.Location ??
                  item.doctorInfo.photo,
              }}
              width={66}
              height={66}
              circle
            />
            <CardDoctorInfoColumn>
              <Text T4 bold>
                {item.doctorInfo.name} 교수
              </Text>
              <Text T7 bold color={COLOR.GRAY2}>
                {item.doctorInfo.hospital_name} /{" "}
                {item.doctorInfo.department_name}
              </Text>
              <StyledText
                T7
                color={COLOR.GRAY1}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {convertToHashtags(item.doctorInfo.strengths)}
              </StyledText>
            </CardDoctorInfoColumn>
          </Row>
          {type === "underReservation" ? (
            getRemainingTime(item?.wish_at) > 0 ? (
              <CustomSolidButton
                underlayColor={COLOR.SUB1}
                onPress={() => handleEnterTelemedicine(item)}
              >
                <Text T5 medium color="#FFFFFF">
                  상담 예약 정보
                </Text>
              </CustomSolidButton>
            ) : (
              <CustomSolidButton
                underlayColor={COLOR.SUB1}
                onPress={() => handleEnterTelemedicine(item)}
              >
                <Text T5 medium color="#FFFFFF">
                  상담실 입장
                </Text>
              </CustomSolidButton>
            )
          ) : item.STATUS === "CANCELED" ? (
            item?.CANCELER === "PATIENT" ? (
              <CustomSolidButton
                underlayColor={COLOR.SUB1}
                onPress={() => handleViewTelemedicineDetail(item)}
              >
                <Text T5 medium color="#FFFFFF">
                  환자에 의한 취소
                </Text>
              </CustomSolidButton>
            ) : item?.CANCELER === "DOCTOR" ? (
              <CustomSolidButton
                underlayColor={COLOR.SUB1}
                onPress={() => handleViewTelemedicineDetail(item)}
              >
                <Text T5 medium color="#FFFFFF">
                  의사에 의한 취소
                </Text>
              </CustomSolidButton>
            ) : item?.CANCELER === "ADMIN" ? (
              <CustomSolidButton
                underlayColor={COLOR.SUB1}
                onPress={() => handleViewTelemedicineDetail(item)}
              >
                <Text T5 medium color="#FFFFFF">
                  관리자에 의한 환불
                </Text>
              </CustomSolidButton>
            ) : (
              <CustomSolidButton
                underlayColor={COLOR.SUB1}
                onPress={() => handleViewTelemedicineDetail(item)}
              >
                <Text T5 medium color="#FFFFFF">
                  정책에 의한 환불
                </Text>
              </CustomSolidButton>
            )
          ) : !item?.invoiceInfo?.needPayment ? (
            <CustomSolidButton
              underlayColor={COLOR.SUB1}
              onPress={() => handleViewTelemedicineDetail(item)}
            >
              <Text T5 medium color="#FFFFFF">
                상담 내역
              </Text>
            </CustomSolidButton>
          ) : (
            <CustomSolidButton
              underlayColor={COLOR.SUB1}
              onPress={() => handleViewTelemedicineDetail(item)}
            >
              <Text T5 medium color="#FFFFFF">
                추가 결제 필요
              </Text>
            </CustomSolidButton>
          )}
        </CardDoctorInfoSection>
      </HistoryCardContainer>
    );
  }

  if (isLoading) {
    return (
      <LoadingBackground>
        <ActivityIndicator size="large" color="#5500CC" />
      </LoadingBackground>
    );
  }

  return (
    <SafeArea>
      {accountData.loginToken ? (
        <>
          {historyData?.underReservation?.length ||
          historyData?.pastHistory?.length ? (
            <Container backgroundColor={COLOR.GRAY6} paddingHorizontal={20}>
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={COLOR.MAIN}
                    progressViewOffset={20}
                  />
                }
              >
                {historyData?.underReservation?.length ? (
                  <>
                    <Text T3 bold mTop={30}>
                      예약 / 접수 내역
                    </Text>
                    {deviceCalendar?.timeZone && (
                      <Text T7 medium color={COLOR.GRAY1}>
                        ({deviceCalendar?.timeZone} 시간대 기준)
                      </Text>
                    )}

                    <HistoryColumn>
                      {historyData?.underReservation?.map((item, index) => (
                        <HistoryCard
                          key={`underReservation${index}`}
                          item={item}
                          type="underReservation"
                        />
                      ))}
                    </HistoryColumn>
                  </>
                ) : null}
                {historyData?.pastHistory?.length ? (
                  <>
                    <Row mTop={30}>
                      <Text T3 bold>
                        지난 내역
                      </Text>
                      <Text T7 medium color={COLOR.GRAY1} mLeft={6} mTop={9}>
                        전체 {historyData.pastHistory.length}건
                      </Text>
                    </Row>
                    {deviceCalendar?.timeZone && (
                      <Text T7 medium color={COLOR.GRAY1}>
                        ({deviceCalendar?.timeZone} 시간대 기준)
                      </Text>
                    )}

                    <HistoryColumn>
                      {historyData?.pastHistory?.map((item, index) => (
                        <HistoryCard
                          key={`pastHistory${index}`}
                          item={item}
                          type="pastHistory"
                        />
                      ))}
                    </HistoryColumn>
                  </>
                ) : null}
                <Box height={40} />
              </ScrollView>
            </Container>
          ) : (
            <ContainerCenter
              backgroundColor={COLOR.GRAY6}
              paddingHorizontal={20}
            >
              <HistoryEmptyContainer mTop={-40}>
                <Image source={letterIcon} width={70} height={74} />
                <Text T3 bold mTop={24}>
                  상담 내역이 없습니다
                </Text>
                <Text T6 medium center color={COLOR.GRAY1} mTop={12}>
                  해외에서도 비대면으로{"\n"}한국 대학병원 전문의를 만나보세요
                </Text>
                <SolidButton
                  large
                  mTop={24}
                  text="상담 예약"
                  action={() => handleMakeReservation()}
                />
              </HistoryEmptyContainer>
            </ContainerCenter>
          )}
        </>
      ) : (
        <ContainerCenter backgroundColor={COLOR.GRAY6} paddingHorizontal={20}>
          <NeedLogin mTop={-40} action={() => handleLogin()} />
        </ContainerCenter>
      )}
    </SafeArea>
  );
}

const LoadingBackground = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${COLOR.GRAY6};
`;

const HistoryColumn = styled.View`
  margin-top: 30px;
  width: 100%;
  gap: 20px;
`;

const HistoryCardContainer = styled.View`
  width: 100%;
  background-color: #ffffff;
  border-radius: 10px;
`;

const CardTitleSection = styled.View`
  width: 100%;
  padding: 20px 20px 12px 20px;
  flex-direction: row;
  justify-content: space-between;
`;

const CardTitleColumn = styled.View`
  gap: 4px;
`;

const CardTitleButton = styled.TouchableHighlight`
  width: 74px;
  height: 38px;
  background-color: ${COLOR.GRAY6};
  border-radius: 5px;
  align-items: center;
  justify-content: center;
`;

const CardDoctorInfoSection = styled.View`
  width: 100%;
  padding: 24px 20px 30px 20px;
`;

const CardDoctorInfoColumn = styled.View`
  margin-left: 24px;
`;

const CustomSolidButton = styled.TouchableHighlight`
  margin-top: 24px;
  width: 100%;
  height: 48px;
  background-color: ${COLOR.MAIN};
  border-radius: 5px;
  align-items: center;
  justify-content: center;
`;

const HistoryEmptyContainer = styled.View`
  ${(props) => props.mTop && `margin-top: ${props.mTop}px;`}
  width: 100%;
  padding: 40px 20px;
  border-radius: 10px;
  background-color: #ffffff;
  align-items: center;
`;

const StyledText = styled(Text)`
  width: 230px;
  margin-top: 12px;
`;
