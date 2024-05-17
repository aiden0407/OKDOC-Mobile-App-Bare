//React
import { useState, useContext, useRef } from "react";
import { ApiContext } from "context/ApiContext";
import { AppContext } from "context/AppContext";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Components
import { COLOR, BUTTON, INPUT_BOX } from "constants/design";
import { Platform, ActivityIndicator, Alert } from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { SafeArea, Container, ScrollView, Row, Box } from "components/Layout";
import { Text } from "components/Text";
import { Image } from "components/Image";
import { BoxInput } from "components/TextInput";
import { SolidButton } from "components/Button";

//Api
import {
  checkPassportInformation,
  createAppleAccount,
  createGoogleAccount,
  createLocalAccount,
  createPatientByPassport,
} from "api/Login";
import { deleteFamilyAccout } from "api/MyPage";

//Assets
import exclamationIcon from "assets/icons/circle-exclamation.png";

export default function PassportInformationScreen({ navigation }) {
  const { dispatch: apiContextDispatch } = useContext(ApiContext);
  const {
    state: { registerStatus },
    dispatch: appContextDispatch,
  } = useContext(AppContext);
  const [name, setName] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [gender, setGender] = useState("");

  const today = new Date();
  const [birth, setBirth] = useState(today);
  //const [birth, setBirth] = useState(new Date('1998-04-07T02:32:55.000Z'));
  const [isBirthPickerShow, setIsBirthPickerShow] = useState(false);
  const onBirthChange = (event, selectedDate) => {
    setBirth(selectedDate);
  };
  const showBirthSelector = () => {
    DateTimePickerAndroid.open({
      value: birth,
      onChange: onBirthChange,
      mode: "date",
      display: "spinner",
    });
  };

  const [dateOfIssue, setDateOfIssue] = useState(today);
  //const [dateOfIssue, setDateOfIssue] = useState(new Date('2023-03-15T02:32:55.000Z'));
  const [isDateOfIssuePickerShow, setIsDateOfIssuePickerShow] = useState(false);
  const onDateOfIssueChange = (event, selectedDate) => {
    setDateOfIssue(selectedDate);
  };
  const showDateOfIssueSelector = () => {
    DateTimePickerAndroid.open({
      value: dateOfIssue,
      onChange: onDateOfIssueChange,
      mode: "date",
      display: "spinner",
    });
  };

  const [dateOfExpiry, setDateOfExpiry] = useState(today);
  //const [dateOfExpiry, setDateOfExpiry] = useState(new Date('2033-03-15T02:32:55.000Z'));
  const [isDateOfExpiryPickerShow, setIsDateOfExpiryPickerShow] =
    useState(false);
  const onDateOfExpiryChange = (event, selectedDate) => {
    setDateOfExpiry(selectedDate);
  };
  const showDateOfExpirySelector = () => {
    DateTimePickerAndroid.open({
      value: dateOfExpiry,
      onChange: onDateOfExpiryChange,
      mode: "date",
      display: "spinner",
    });
  };

  const scrollRef = useRef();
  function handleTextInputFocus(value) {
    scrollRef.current?.scrollTo({
      y: value,
      animated: true,
    });
  }

  function validateName(name) {
    const regExp = /^[가-힣]+$/;
    return regExp.test(name);
  }

  const handlePassportNumberChange = (inputText) => {
    const filteredText = inputText.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setPassportNumber(filteredText);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return Number(year + month + day);
  }

  function formatDateString(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const [passportCertifiactionState, setPassportCertifiactionState] =
    useState("NONE");

  const passportCheck = async function () {
    setPassportCertifiactionState("CHECKING");
    try {
      const response = await checkPassportInformation(
        name,
        formatDate(birth),
        passportNumber,
        formatDate(dateOfIssue),
        formatDate(dateOfExpiry)
      );
      try {
        const deviceType = await AsyncStorage.getItem("@device_type");
        const deviceToken = await AsyncStorage.getItem("@device_token");
        let createLocalAccountResponse;

        if (
          registerStatus.route === "APPLE_EMAIL_EXISTENT" ||
          registerStatus.route === "APPLE_EMAIL_UNDEFINED"
        ) {
          createLocalAccountResponse = await createAppleAccount(
            registerStatus.email,
            registerStatus.policy,
            deviceType,
            deviceToken,
            registerStatus.invitationToken
          );
        }
        if (registerStatus.route === "GOOGLE_REGISTER") {
          createLocalAccountResponse = await createGoogleAccount(
            registerStatus.email,
            registerStatus.policy,
            deviceType,
            deviceToken,
            registerStatus.invitationToken
          );
        }
        if (registerStatus.route === "LOCAL_REGISTER") {
          createLocalAccountResponse = await createLocalAccount(
            registerStatus.email,
            registerStatus.password,
            registerStatus.policy,
            deviceType,
            deviceToken,
            registerStatus.invitationToken
          );
        }

        const loginToken = createLocalAccountResponse.data.response.accessToken;
        initPatient(loginToken);
      } catch (error) {
        setPassportCertifiactionState("NONE");
        Alert.alert(
          "오류",
          "계정 생성에 실패하였습니다. 다시 시도해 주시기 바랍니다."
        );
      }
    } catch (error) {
      if (error?.response?.data.statusCode === 422) {
        if (
          error?.response?.data.message.includes(
            "여권정보가 일치하지 않습니다."
          )
        ) {
          setPassportCertifiactionState("WRONG_INFORMATION_ERROR");
        } else {
          setPassportCertifiactionState("CERTIFICATE_ERROR");
        }
      } else {
        setPassportCertifiactionState("NONE");
        Alert.alert("네트워크 에러", "다시 시도해 주시기 바랍니다.");
      }
    }
  };

  const initPatient = async function (loginToken) {
    try {
      const createPatientByPassportResponse = await createPatientByPassport(
        loginToken,
        registerStatus.email,
        name,
        formatDate(birth),
        passportNumber,
        formatDate(dateOfIssue),
        formatDate(dateOfExpiry),
        gender
      );
      const mainProfile = createPatientByPassportResponse.data.response;
      apiContextDispatch({
        type: "LOGIN",
        loginToken: loginToken,
        email: registerStatus.email,
      });

      setPassportCertifiactionState("NONE");

      try {
        const accountData = {
          loginToken: loginToken,
          email: registerStatus.email,
        };
        await AsyncStorage.setItem(
          "@account_data",
          JSON.stringify(accountData)
        );
      } catch (error) {
        //console.log(error);
      }

      apiContextDispatch({
        type: "PROFILE_CREATE_MAIN",
        id: mainProfile.id,
        name: mainProfile.passport.user_name,
        relationship: mainProfile.relationship,
        birth: mainProfile.passport.birth,
        gender: mainProfile.gender,
      });
      appContextDispatch({ type: "REGISTER_COMPLETE" });
      navigation.navigate("RegisterComplete");
    } catch (error) {
      if (error?.response?.data.statusCode === 409) {
        try {
          await deleteFamilyAccout(loginToken, registerStatus.email);
          apiContextDispatch({ type: "LOGOUT" });
          try {
            await AsyncStorage.removeItem("@account_data");
          } catch (error) {
            //console.log(error);
          }
          setPassportCertifiactionState("NONE");
          Alert.alert(
            "계정 안내",
            "이미 가입된 회원입니다. 로그인 혹은 계정 찾기를 진행해주시기 바랍니다.",
            "",
            [
              {
                text: "확인",
                onPress: () => {
                  appContextDispatch({ type: "REGISTER_COMPLETE" });
                  navigation.popToTop();
                },
              },
            ]
          );
        } catch (error) {
          //회원 탈퇴 실패
          setPassportCertifiactionState("NONE");
          Alert.alert(
            "네트워크 에러",
            "프로필 생성에 실패했습니다. 관리자에게 문의해 주시기 바랍니다."
          );
        }
      } else {
        //중복 프로필 생성 외 프로필 생성 실패
        setPassportCertifiactionState("NONE");
        Alert.alert(
          "네트워크 에러",
          "프로필 생성에 실패했습니다. 관리자에게 문의해 주시기 바랍니다."
        );
      }
    }
  };

  return (
    <>
      <SafeArea>
        <Container paddingHorizontal={20}>
          <ScrollView ref={scrollRef}>
            <Text T3 bold mTop={30}>
              오케이닥 진료 서비스 이용을 위해{"\n"}여권 정보를 기입해 주세요
            </Text>
            <Text T6 color={COLOR.GRAY1} mTop={12}>
              의료법에 따라 본인 확인 후 서비스 이용이 가능합니다
            </Text>

            <Text T6 bold mTop={30}>
              한글 성명
            </Text>
            <BoxInput
              mTop={12}
              placeholder="한글 성명"
              value={name}
              onChangeText={setName}
              onFocus={() => handleTextInputFocus(0)}
              returnKeyType="next"
            />
            <Text T6 bold mTop={24}>
              생년월일
            </Text>
            <DateTimePickerOpenButton
              onPress={() =>
                Platform.OS === "android"
                  ? showBirthSelector()
                  : setIsBirthPickerShow(true)
              }
              underlayColor={COLOR.GRAY4}
            >
              <Text
                T6
                color={
                  birth.toDateString() === today.toDateString()
                    ? COLOR.GRAY2
                    : "#000000"
                }
              >
                {birth.toDateString() === today.toDateString()
                  ? "생년월일 8자리"
                  : formatDateString(birth)}
              </Text>
            </DateTimePickerOpenButton>
            <Text T6 bold mTop={24}>
              여권 번호
            </Text>
            <BoxInput
              mTop={12}
              placeholder="알파벳+숫자 총 9자리"
              maxLength={9}
              value={passportNumber}
              onChangeText={handlePassportNumberChange}
              onFocus={() => handleTextInputFocus(200)}
            />
            <Text T6 bold mTop={24}>
              여권 발급일
            </Text>
            <DateTimePickerOpenButton
              onPress={() =>
                Platform.OS === "android"
                  ? showDateOfIssueSelector()
                  : setIsDateOfIssuePickerShow(true)
              }
              underlayColor={COLOR.GRAY4}
            >
              <Text
                T6
                color={
                  dateOfIssue.toDateString() === today.toDateString()
                    ? COLOR.GRAY2
                    : "#000000"
                }
              >
                {dateOfIssue.toDateString() === today.toDateString()
                  ? "발급일 숫자 8자리"
                  : formatDateString(dateOfIssue)}
              </Text>
            </DateTimePickerOpenButton>
            <Text T6 bold mTop={24}>
              여권 만료일
            </Text>
            <DateTimePickerOpenButton
              onPress={() =>
                Platform.OS === "android"
                  ? showDateOfExpirySelector()
                  : setIsDateOfExpiryPickerShow(true)
              }
              underlayColor={COLOR.GRAY4}
            >
              <Text
                T6
                color={
                  dateOfExpiry.toDateString() === today.toDateString()
                    ? COLOR.GRAY2
                    : "#000000"
                }
              >
                {dateOfExpiry.toDateString() === today.toDateString()
                  ? "기간 만료일 숫자 8자리"
                  : formatDateString(dateOfExpiry)}
              </Text>
            </DateTimePickerOpenButton>
            <Text T6 bold mTop={24}>
              성별
            </Text>
            <Row mTop={12} gap={12}>
              <MediumSolidButtonBackground
                isSelected={gender === "MALE"}
                onPress={() => setGender("MALE")}
              >
                <Text
                  T6
                  medium={!gender === "MALE"}
                  bold={gender === "MALE"}
                  color={gender === "MALE" ? "#FFFFFF" : COLOR.GRAY2}
                >
                  남성
                </Text>
              </MediumSolidButtonBackground>
              <MediumSolidButtonBackground
                isSelected={gender === "FEMALE"}
                onPress={() => setGender("FEMALE")}
              >
                <Text
                  T6
                  medium={!gender === "FEMALE"}
                  bold={gender === "FEMALE"}
                  color={gender === "FEMALE" ? "#FFFFFF" : COLOR.GRAY2}
                >
                  여성
                </Text>
              </MediumSolidButtonBackground>
            </Row>

            <Box height={40} />

            <SolidButton
              text="다음"
              mBottom={20}
              disabled={
                !validateName(name) ||
                passportNumber.length !== 9 ||
                !gender ||
                birth.toDateString() === today.toDateString() ||
                dateOfIssue.toDateString() === today.toDateString() ||
                dateOfExpiry.toDateString() === today.toDateString()
              }
              action={() => passportCheck()}
            />
          </ScrollView>
        </Container>
      </SafeArea>

      {isBirthPickerShow && (
        <BottomSheetBackground onPress={() => setIsBirthPickerShow(false)}>
          <DateTimePickerContainer>
            <DateTimePicker
              display="spinner"
              value={birth}
              onChange={onBirthChange}
              style={{ backgroundColor: COLOR.GRAY5 }}
              locale="ko-KO"
            />
            <CustomSolidButton
              underlayColor={COLOR.SUB1}
              onPress={() => setIsBirthPickerShow(false)}
            >
              <Text T5 medium color="#FFFFFF">
                확인
              </Text>
            </CustomSolidButton>
          </DateTimePickerContainer>
        </BottomSheetBackground>
      )}

      {isDateOfIssuePickerShow && (
        <BottomSheetBackground
          onPress={() => setIsDateOfIssuePickerShow(false)}
        >
          <DateTimePickerContainer>
            <DateTimePicker
              display="spinner"
              value={dateOfIssue}
              onChange={onDateOfIssueChange}
              style={{ backgroundColor: COLOR.GRAY5 }}
              locale="ko-KO"
            />
            <CustomSolidButton
              underlayColor={COLOR.SUB1}
              onPress={() => setIsDateOfIssuePickerShow(false)}
            >
              <Text T5 medium color="#FFFFFF">
                확인
              </Text>
            </CustomSolidButton>
          </DateTimePickerContainer>
        </BottomSheetBackground>
      )}

      {isDateOfExpiryPickerShow && (
        <BottomSheetBackground
          onPress={() => setIsDateOfExpiryPickerShow(false)}
        >
          <DateTimePickerContainer>
            <DateTimePicker
              display="spinner"
              value={dateOfExpiry}
              onChange={onDateOfExpiryChange}
              style={{ backgroundColor: COLOR.GRAY5 }}
              locale="ko-KO"
            />
            <CustomSolidButton
              underlayColor={COLOR.SUB1}
              onPress={() => setIsDateOfExpiryPickerShow(false)}
            >
              <Text T5 medium color="#FFFFFF">
                확인
              </Text>
            </CustomSolidButton>
          </DateTimePickerContainer>
        </BottomSheetBackground>
      )}

      {passportCertifiactionState === "CHECKING" && (
        <BottomSheetBackground>
          <PassportCertifiactionContainer gap={30}>
            <ActivityIndicator size="large" color="#5500CC" />
            <Text T4 medium center>
              잠시만 기다려주세요{"\n"}여권 정보를 확인중이에요
            </Text>
          </PassportCertifiactionContainer>
        </BottomSheetBackground>
      )}

      {passportCertifiactionState === "CERTIFICATE_ERROR" && (
        <BottomSheetBackground>
          <PassportCertifiactionContainer>
            <Image source={exclamationIcon} width={70} height={70} mTop={-20} />
            <Text T4 medium center mTop={12}>
              여권 검증 서버에 문제가 발생했습니다{"\n"}관리자에게 문의해주세요.
            </Text>
            <Row gap={24} mTop={18}>
              <CustomSolidButtonBackground
                onPress={() => setPassportCertifiactionState("NONE")}
                underlayColor={COLOR.SUB3}
              >
                <Text T6 medium color={COLOR.MAIN}>
                  닫기
                </Text>
              </CustomSolidButtonBackground>
            </Row>
          </PassportCertifiactionContainer>
        </BottomSheetBackground>
      )}

      {passportCertifiactionState === "WRONG_INFORMATION_ERROR" && (
        <BottomSheetBackground>
          <PassportCertifiactionContainer>
            <Image source={exclamationIcon} width={70} height={70} mTop={-20} />
            <Text T4 medium center mTop={12}>
              입력하신 정보와 일치하는{"\n"}여권정보가 존재하지 않아요
            </Text>
            <Row gap={24} mTop={18}>
              <CustomSolidButtonBackground
                onPress={() => setPassportCertifiactionState("NONE")}
                underlayColor={COLOR.SUB3}
              >
                <Text T6 medium color={COLOR.MAIN}>
                  여권정보 재입력
                </Text>
              </CustomSolidButtonBackground>
            </Row>
          </PassportCertifiactionContainer>
        </BottomSheetBackground>
      )}
    </>
  );
}

const DateTimePickerOpenButton = styled.TouchableHighlight`
  margin-top: 12px;
  width: 100%;
  padding: ${INPUT_BOX.DEFAULT.BACKGROUND_PADDING};
  background-color: ${COLOR.GRAY6};
  border-radius: 5px;
`;

const MediumSolidButtonBackground = styled.Pressable`
  width: ${BUTTON.MEDIUM.WIDTH};
  height: ${BUTTON.MEDIUM.HEIGHT};
  border-radius: ${BUTTON.MEDIUM.BORDER_RADIUS};
  background-color: ${(props) => (props.isSelected ? COLOR.MAIN : COLOR.GRAY6)};
  align-items: center;
  justify-content: center;
`;

const CustomSolidButtonBackground = styled.TouchableHighlight`
  width: ${BUTTON.MEDIUM.WIDTH};
  height: ${BUTTON.MEDIUM.HEIGHT};
  border-radius: ${BUTTON.MEDIUM.BORDER_RADIUS};
  background-color: ${COLOR.SUB4};
  align-items: center;
  justify-content: center;
`;

const BottomSheetBackground = styled.Pressable`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #000000aa;
`;

const DateTimePickerContainer = styled.View`
  position: absolute;
  padding-top: 18px;
  width: 100%;
  bottom: 0;
  gap: 10px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: ${COLOR.GRAY5};
`;

const PassportCertifiactionContainer = styled.View`
  position: absolute;
  height: 314px;
  width: 100%;
  bottom: 0;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
`;

const CustomSolidButton = styled.TouchableHighlight`
  width: 100%;
  height: 70px;
  padding-bottom: 14px;
  background-color: ${COLOR.MAIN};
  align-items: center;
  justify-content: center;
`;
