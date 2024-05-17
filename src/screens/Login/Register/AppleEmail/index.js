//React
import { useState, useContext, useRef } from "react";
import { AppContext } from "context/AppContext";
import styled from "styled-components/native";
import useTestAccount from "hook/useTestAccount";

//Components
import { COLOR, TYPOGRAPHY } from "constants/design";
import { Platform, Alert, ActivityIndicator } from "react-native";
import { SafeArea, KeyboardAvoiding, Container } from "components/Layout";
import { Text } from "components/Text";
import { SolidButton } from "components/Button";

//Api
import {
  emailAvailabilityCheck,
  emailCheckOpen,
  emailCheckClose,
} from "api/Login";

export default function AppleEmailScreen({ navigation }) {
  const {
    state: { registerStatus },
    dispatch: appContextDispatch,
  } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [verifiedToken, setVerifiedToken] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [certificationNumber, setCertificationNumber] = useState("");
  const [isEmailCertificated, setIsEmailCertificated] = useState(false);

  function validateEmail(email) {
    const regExp = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return regExp.test(email);
  }

  const handleRequestCertification = async function () {
    setLoading(true);
    try {
      await emailAvailabilityCheck(email);
      emailOpen();
    } catch (error) {
      setLoading(false);
      if (error?.response?.data.statusCode === 422) {
        if (useTestAccount(email)) {
          emailOpen();
        } else {
          Alert.alert("안내", "해당 계정으로 재가입이 불가능합니다.");
        }
      } else if (error?.response?.data.statusCode === 409) {
        Alert.alert(
          "안내",
          "이미 가입된 이메일입니다. 다른 이메일로 시도해 주시기 바랍니다."
        );
      } else {
        Alert.alert(
          "인증요청 실패",
          "네트워크 에러로 인해 인증번호 발송을 실패하였습니다. 다시 시도해 주시기 바랍니다."
        );
      }
    }
  };

  const emailOpen = async function () {
    try {
      const emailCheckOpenResponse = await emailCheckOpen(email);
      setVerifiedToken(emailCheckOpenResponse.data.response.verified_token);
      setIsEmailSent(true);
      setLoading(false);
      Alert.alert("안내", "해당 이메일 주소로\n인증번호가 전송되었습니다.");
    } catch (error) {
      setLoading(false);
      if (error?.response?.data.statusCode === 409) {
        Alert.alert(
          "안내",
          "이미 가입된 이메일입니다. 다른 이메일로 시도해 주시기 바랍니다."
        );
      } else {
        Alert.alert(
          "인증요청 실패",
          "네트워크 에러로 인해 인증번호 발송을 실패하였습니다. 다시 시도해 주시기 바랍니다."
        );
      }
    }
  };

  const handleCheckCertificationNumber = async function () {
    setLoading(true);
    try {
      await emailCheckClose(verifiedToken, email, certificationNumber);
      setIsEmailCertificated(true);
      setLoading(false);
      Alert.alert("안내", "이메일이 인증되었습니다.");
    } catch {
      setLoading(false);
      Alert.alert(
        "인증 실패",
        "인증번호가 일치하지 않습니다. 다시 입력해 주시기 바랍니다."
      );
    }
  };

  const handleNextScreen = async function () {
    appContextDispatch({
      type: "REGISTER_EMAIL_PASSWORD_INVITATION_TOKEN",
      email: email,
      password: undefined,
      invitationToken: registerStatus.invitationToken,
    });
    navigation.navigate("BirthInformation");
  };

  return (
    <SafeArea>
      {loading && (
        <LoadingBackground>
          <ActivityIndicator size="large" color="#5500CC" />
        </LoadingBackground>
      )}
      <KeyboardAvoiding>
        <Container paddingHorizontal={20}>
          <Container>
            <Text T3 bold mTop={30}>
              Apple ID 회원가입을 진행합니다
            </Text>
            <Text T6 medium color={COLOR.GRAY2} mTop={12}>
              Apple 계정과 OK DOC 계정 연동을 위해{`\n`}이메일을 인증해 주세요
            </Text>

            <InputContainer>
              <CustomLineInput
                editable={!isEmailSent}
                placeholder="이메일"
                value={email}
                onChangeText={setEmail}
                inputMode="email"
                returnKeyType="next"
                onSubmitEditing={() => {
                  if (!validateEmail(email)) {
                    handleRequestCertification();
                  }
                }}
              />
              {!isEmailCertificated && (
                <CustomOutlineButtonBackground
                  disabled={!validateEmail(email)}
                  onPress={() => handleRequestCertification()}
                  underlayColor={COLOR.SUB4}
                  style={{
                    position: "absolute",
                    right: 4,
                    top: Platform.OS === "android" ? 21 : 13,
                    zIndex: 1,
                  }}
                >
                  <Text
                    T7
                    medium
                    color={validateEmail(email) ? COLOR.MAIN : COLOR.GRAY1}
                  >
                    {isEmailSent ? "재전송" : "인증요청"}
                  </Text>
                </CustomOutlineButtonBackground>
              )}
            </InputContainer>

            {isEmailSent && !isEmailCertificated && (
              <InputContainer>
                <CustomLineInput
                  placeholder="인증번호 6자리"
                  value={certificationNumber}
                  onChangeText={setCertificationNumber}
                  inputMode="numeric"
                  maxLength={6}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    if (certificationNumber?.length < 6) {
                      handleCheckCertificationNumber();
                    }
                  }}
                />
                <CustomOutlineButtonBackground
                  disabled={certificationNumber?.length < 6}
                  onPress={() => handleCheckCertificationNumber()}
                  underlayColor={COLOR.SUB4}
                  style={{
                    position: "absolute",
                    right: 4,
                    top: Platform.OS === "android" ? 22 : 14,
                    zIndex: 1,
                  }}
                >
                  <Text
                    T7
                    medium
                    color={
                      certificationNumber?.length < 6 ? COLOR.GRAY2 : COLOR.MAIN
                    }
                  >
                    인증확인
                  </Text>
                </CustomOutlineButtonBackground>
              </InputContainer>
            )}
          </Container>

          <SolidButton
            text="다음"
            mBottom={20}
            disabled={!isEmailCertificated}
            action={() => handleNextScreen()}
          />
        </Container>
      </KeyboardAvoiding>
    </SafeArea>
  );
}

const LoadingBackground = styled.Pressable`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InputContainer = styled.View`
  width: 100%;
  position: relative;
`;

const CustomLineInput = styled.TextInput`
  margin-top: 24px;
  width: 100%;
  padding: 0 0 12px 8px;
  border-bottom-width: 1.5px;
  border-color: ${(props) =>
    props.editable === false ? COLOR.MAIN : COLOR.GRAY3};
  font-family: "Pretendard-Regular";
  font-size: ${TYPOGRAPHY.T5.SIZE};
  color: ${(props) => (props.editable === false ? COLOR.GRAY0 : "#000000")};
`;

const CustomOutlineButtonBackground = styled.TouchableHighlight`
  width: 72px;
  height: 36px;
  border-width: 1px;
  border-radius: 5px;
  border-color: ${(props) => (props.disabled ? COLOR.GRAY3 : COLOR.MAIN)};
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
`;
