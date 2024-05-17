//React
import { useState, useContext } from "react";
import { AppContext } from "context/AppContext";
import { ApiContext } from "context/ApiContext";
import useTestAccount from "hook/useTestAccount";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styled from "styled-components/native";
import { dataDogFrontendError } from "api/DataDog";

//Components
import { COLOR } from "constants/design";
import { Platform, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  SafeArea,
  ScrollView,
  Row,
  DividingLine,
  Box,
} from "components/Layout";
import { Text } from "components/Text";
import { Image } from "components/Image";
import { SolidButton } from "components/Button";

//Assets
import starEmpty from "assets/icons/star-empty.png";
import starHalf from "assets/icons/star-half.png";
import starFull from "assets/icons/star-full.png";

export default function DoctorProfileScreen({ navigation }) {
  const {
    state: { telemedicineReservationStatus },
    dispatch,
  } = useContext(AppContext);
  const {
    state: { accountData, profileData, reuseTickets },
  } = useContext(ApiContext);
  const [informationCategory, setInformationCategory] = useState("profile");
  const doctorInfo = telemedicineReservationStatus.doctorInfo;

  const title = doctorInfo?.selfIntrodectionTitle;
  const text = doctorInfo?.selfIntrodectionDetale;

  async function handleApplyReservation() {
    if (accountData.loginToken) {
      let netInfo;
      try {
        const jsonValue = await AsyncStorage.getItem("@net_information");
        if (jsonValue !== null) {
          netInfo = JSON.parse(jsonValue);
        }
      } catch (error) {
        dataDogFrontendError(error);
      }

      if (
        netInfo?.geoip?.country?.iso_code === "KR" &&
        !useTestAccount(accountData.email)
      ) {
        Alert.alert(
          "안내",
          "대한한국에 위치해 계실 경우 서비스 예약 및 이용이 불가능합니다."
        );
      } else {
        dispatch({
          type: "TELEMEDICINE_RESERVATION_PROFILE",
          profileType: "my",
          profileInfo: profileData[0],
        });
        navigation.navigate("ProfileDetail");
      }
    } else {
      navigation.navigate("NeedLoginNavigation", {
        screen: "NeedLogin",
        params: { headerTitle: "비대면 상담실" },
      });
    }
  }

  function convertToHashtags(dataArray) {
    const hashtags = dataArray.map((tag) => `#${tag}`).join(" ");
    return hashtags;
  }

  // function Review() {
  //   return (<>
  //     <Row mTop={24} align>
  //       <ServiceSection>
  //         <Text T8 medium color={COLOR.MAIN}>진료</Text>
  //       </ServiceSection>
  //       <Row mLeft={6} gap={2}>
  //         <Image source={starFull} width={12} height={12} />
  //         <Image source={starFull} width={12} height={12} />
  //         <Image source={starFull} width={12} height={12} />
  //         <Image source={starFull} width={12} height={12} />
  //         <Image source={starFull} width={12} height={12} />
  //       </Row>
  //     </Row>
  //     <Text T6 mTop={12}>친절하시고 책임감 있으신거 같아요. {'\n'}만족할 때까지상담해주셨어요.</Text>
  //     <Text T7 medium mTop={12} color={COLOR.GRAY1}>전**님 | 23.04.07</Text>
  //   </>)
  // }

  return (
    <SafeArea>
      {/* <LinearGradient
        colors={['#FFFFFF', '#FFFFFF', '#FFFFFF', 'rgba(255,255,255,0)']}
        style={{
          width: '100%',
          padding: 20,
          paddingBottom: 60,
          position: 'absolute',
          zIndex: 1,
          top: 0
        }}
      >
        <ButtonsArea>
          {informationCategory === 'profile' && (
            <>
              <SellectedButton>
                <Text T5 bold color={COLOR.MAIN}>의사정보</Text>
              </SellectedButton>
              <UnsellectedButtonRight
                underlayColor='transparent'
                onPress={() => setInformationCategory('review')}
              >
                <Text T5 color={COLOR.GRAY1}>진료후기</Text>
              </UnsellectedButtonRight>
            </>
          )}
          {informationCategory === 'review' && (
            <>
              <UnsellectedButtonLeft
                underlayColor='transparent'
                onPress={() => setInformationCategory('profile')}
              >
                <Text T5 color={COLOR.GRAY1}>의사정보</Text>
              </UnsellectedButtonLeft>
              <SellectedButton>
                <Text T5 bold color={COLOR.MAIN}>진료후기</Text>
              </SellectedButton>
            </>
          )}
        </ButtonsArea>
      </LinearGradient> */}

      {/* <ScrollView showsVerticalScrollIndicator={false} paddingHorizontal={20} paddingTop={80}> */}
      <ScrollView paddingHorizontal={20}>
        {informationCategory === "profile" && (
          <>
            <Row align mTop={36}>
              <Image
                source={{ uri: doctorInfo?.image }}
                width={66}
                height={66}
                circle
              />
              <DoctorColumn>
                <Text T4 bold>
                  {doctorInfo.name} 교수
                </Text>
                <Text T7 medium color={COLOR.GRAY1}>
                  {doctorInfo.hospital} / {doctorInfo.subject}
                </Text>
                <StyledText T7 color={COLOR.GRAY1}>
                  {convertToHashtags(doctorInfo.strength)}
                </StyledText>
              </DoctorColumn>
            </Row>

            <DividingLine thin mTop={24} />

            <Text T4 bold mTop={24} mBottom={3}>
              학력 및 이력
            </Text>
            {doctorInfo?.field?.map((item, index) => (
              <Row align mTop={9} key={`date${index}`}>
                <BulletPoint />
                <Text T6 color={COLOR.GRAY1}>
                  {item}
                </Text>
              </Row>
            ))}

            <DividingLine thin mTop={24} />

            <Text T4 bold mTop={36}>
              {title}
            </Text>
            <Text T6 mTop={18} mBottom={60}>
              {text}
            </Text>
          </>
        )}
        {/* {informationCategory === 'review' && (
          <>
            <ReviewContainer>
              <Text T1 bold>4.5</Text>
              <Row mTop={6} gap={6}>
                <Image source={starFull} width={24} height={24} />
                <Image source={starFull} width={24} height={24} />
                <Image source={starFull} width={24} height={24} />
                <Image source={starFull} width={24} height={24} />
                <Image source={starHalf} width={24} height={24} />
              </Row>
            </ReviewContainer>

            <DividingLine thin mTop={42} />

            <Text T5 medium color={COLOR.GRAY1} mTop={24}>리뷰 34개</Text>

            <Review />
            <Review />
            <Review />
            <Review />
            <Review />
          </>
        )} */}
        <Box height={100} />
      </ScrollView>

      <LinearGradient
        colors={["rgba(255,255,255,0)", "#FFFFFF", "#FFFFFF", "#FFFFFF"]}
        style={{
          width: "100%",
          marginBottom: Platform.OS === "android" ? 0 : 34,
          padding: 20,
          paddingTop: 70,
          position: "absolute",
          bottom: 0,
        }}
      >
        <SolidButton
          text={
            reuseTickets > 0
              ? `상담 예약 신청 (잔여 이용권: ${reuseTickets}개)`
              : "상담 예약 신청"
          }
          action={() => handleApplyReservation()}
        />
      </LinearGradient>
    </SafeArea>
  );
}

const ButtonsArea = styled.View`
  width: 100%;
  height: 48px;
  background: ${COLOR.GRAY6};
  border-radius: 40px;
  flex-direction: row;
  align-items: center;
`;

const SellectedButton = styled.View`
  width: 55%;
  height: 48px;
  background: ${COLOR.SUB2};
  border-radius: 40px;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const UnsellectedButtonRight = styled.TouchableHighlight`
  margin-left: -10%;
  width: 55%;
  height: 48px;
  border-radius: 40px;
  align-items: center;
  justify-content: center;
`;

const UnsellectedButtonLeft = styled.TouchableHighlight`
  margin-right: -10%;
  width: 55%;
  height: 48px;
  border-radius: 40px;
  align-items: center;
  justify-content: center;
`;

const DoctorColumn = styled.View`
  margin-left: 24px;
  flex: 1;
`;

const BulletPoint = styled.View`
  margin-right: 14px;
  width: 4px;
  height: 4px;
  border-radius: 50px;
  background-color: ${COLOR.GRAY3};
`;

const ReviewContainer = styled.View`
  margin-top: 30px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const ServiceSection = styled.View`
  width: 58px;
  height: 26px;
  background-color: ${COLOR.SUB4};
  align-items: center;
  justify-content: center;
  border-radius: 25px;
`;

const StyledText = styled(Text)`
  width: 230px;
  margin-top: 12px;
`;
