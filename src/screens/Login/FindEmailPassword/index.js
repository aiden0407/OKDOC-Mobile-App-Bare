//React
import { useState, useRef } from "react";
import styled from "styled-components/native";

//Components
import * as Device from "expo-device";
import { COLOR, TYPOGRAPHY } from "constants/design";
import { Alert, Keyboard } from "react-native";
import {
  SafeArea,
  KeyboardAvoiding,
  Container,
  Center,
  Box,
} from "components/Layout";
import { Text } from "components/Text";
import { LineInput } from "components/TextInput";
import { SolidButton } from "components/Button";
import { Image } from "components/Image";
import NavigationBackArrow from "components/NavigationBackArrow";

//Api
import {
  findFamilyAccount,
  emailCheckOpen,
  emailCheckClose,
  changePassword,
} from "api/Login";

//Assets
import exclamationIcon from "assets/icons/circle-exclamation.png";

export default function FindEmailPasswordScreen({ navigation }) {
  const [pageStatus, setPageStatus] = useState("EMAIL");
  const [isFindEmailSubmitted, setIsFindEmailSubmitted] = useState(false);
  const [findEmailName, setFindEmailName] = useState("");
  const [findEmailBirth, setFindEmailBirth] = useState("");
  const [foundEmail, setFoundEmail] = useState("");
  const findEmailBirthRef = useRef();

  const [findPasswordAccountType, setFindPasswordAccountType] = useState("");
  const [isFindPasswordSubmitted, setIsFindPasswordSubmitted] = useState(false);
  const [findPasswordEmail, setFindPasswordEmail] = useState("");
  const [findPasswordName, setFindPasswordName] = useState("");
  const [findPasswordBirth, setFindPasswordBirth] = useState("");
  const [verifiedToken, setVerifiedToken] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [findPasswordCertificationNumber, setFindPasswordCertificationNumber] =
    useState("");
  const [isEmailCertificated, setIsEmailCertificated] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");
  const findPasswordNameRef = useRef();
  const findPasswordBirthRef = useRef();
  const newPasswordCheckRef = useRef();

  const handleFindEmailBirthChange = (text) => {
    let formattedDate = "";
    if (text.length <= 10) {
      formattedDate = text
        .replace(/\D/g, "")
        .replace(/(\d{4})(\d{2})?(\d{0,2})?/, (match, p1, p2, p3) => {
          let result = p1;
          if (p2) result += `-${p2}`;
          if (p3) result += `-${p3}`;
          return result;
        });
    }
    setFindEmailBirth(formattedDate);
  };

  const handleFindPasswordBirthChange = (text) => {
    let formattedDate = "";
    if (text.length <= 10) {
      formattedDate = text
        .replace(/\D/g, "")
        .replace(/(\d{4})(\d{2})?(\d{0,2})?/, (match, p1, p2, p3) => {
          let result = p1;
          if (p2) result += `-${p2}`;
          if (p3) result += `-${p3}`;
          return result;
        });
    }
    setFindPasswordBirth(formattedDate);
  };

  function maskEmail(familyAccount) {
    const [username, domain] = familyAccount.id.split("@");
    const usernameLength = username.length;
    let maskedUsername = username.slice(0, 2);
    if (usernameLength > 2) {
      maskedUsername += "*".repeat(usernameLength - 2);
    }
    maskedUsername += username.charAt(usernameLength - 1);

    if (familyAccount?.apple_id) {
      return maskedUsername + "@" + domain + " (애플 로그인)";
    } else if (familyAccount?.google_id) {
      return maskedUsername + "@" + domain + " (구글 로그인)";
    } else {
      return maskedUsername + "@" + domain;
    }
  }

  function validatePassword(password) {
    const regExp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.?!@#$%^&*+=]).{8,14}$/;
    return regExp.test(password);
  }

  function isIdIncluded(idToCheck, familyAccountArray) {
    for (const account of familyAccountArray) {
      if (account?.id?.includes(idToCheck)) {
        return true;
      }
    }
    return false;
  }

  function handleOpenChannelTalk() {
    navigation.navigate("InquiryStackNavigation", {
      screen: "Inquiry",
      params: { headerTitle: "이메일 / 비밀번호 찾기 문의" },
    });
  }

  const handleFindEmail = async function () {
    Keyboard.dismiss();

    try {
      const response = await findFamilyAccount(
        findEmailName,
        Number(findEmailBirth.replaceAll("-", ""))
      );
      const familyAccountArray = response.data.response;
      const emailList = [];
      familyAccountArray.forEach((familyAccount) => {
        emailList.push(maskEmail(familyAccount));
      });

      setFoundEmail(emailList);
      setIsFindEmailSubmitted(true);
    } catch (error) {
      if (error?.response?.data.statusCode === 404) {
        Alert.alert("해당 정보로 등록된 유저가 존재하지 않습니다.");
      } else {
        Alert.alert("네트워크 오류로 인해 정보를 불러오지 못했습니다.");
      }
    }
  };

  const handleFindPassword = async function () {
    Keyboard.dismiss();

    try {
      const response = await findFamilyAccount(
        findPasswordName,
        Number(findPasswordBirth.replaceAll("-", ""))
      );
      const familyAccountArray = response.data.response;
      const isAccountExist = isIdIncluded(
        findPasswordEmail,
        familyAccountArray
      );

      if (isAccountExist) {
        try {
          const emailCheckOpenResponse = await emailCheckOpen(
            findPasswordEmail
          );
          setVerifiedToken(emailCheckOpenResponse.data.response.verified_token);
          setIsFindPasswordSubmitted(true);
        } catch {
          Alert.alert("오류", "다시 시도해 주시기 바랍니다.");
        }
      } else {
        Alert.alert("해당 정보로 등록된 유저가 존재하지 않습니다.");
      }
    } catch (error) {
      if (error?.response?.data.statusCode === 404) {
        Alert.alert("해당 정보로 등록된 유저가 존재하지 않습니다.");
      } else {
        Alert.alert(
          Array.isArray(error?.response?.data.message)
            ? error?.response?.data.message[0]
            : error?.response?.data.message
        );
      }
    }
  };

  const handleEmailResend = async function () {
    try {
      const emailCheckOpenResponse = await emailCheckOpen(findPasswordEmail);
      setVerifiedToken(emailCheckOpenResponse.data.response.verified_token);
      Alert.alert("해당 이메일로 인증번호가 재전송 되었습니다.");
    } catch {
      Alert.alert("오류", "다시 시도해 주시기 바랍니다.");
    }
  };

  const handleCheckCertificationNumber = async function () {
    try {
      const response = await emailCheckClose(
        verifiedToken,
        findPasswordEmail,
        findPasswordCertificationNumber
      );
      setAccessToken(response.data.response.accessToken);
      Alert.alert("인증 성공", "이메일 인증이 완료되었습니다.", [
        {
          text: "확인",
          onPress: () => setIsEmailCertificated(true),
        },
      ]);
    } catch {
      Alert.alert("인증번호가 일치하지 않습니다.");
    }
  };

  const handleChangePassword = async function () {
    try {
      await changePassword(
        accessToken,
        findPasswordEmail,
        newPassword,
        findPasswordName,
        Number(findPasswordBirth.replaceAll("-", ""))
      );
      Alert.alert(
        "비밀번호가 변경",
        "비밀번호가 변경되었습니다. 변경된 비밀번호로 로그인을 해주시기 바랍니다.",
        [
          {
            text: "확인",
            onPress: () => handleGoBackToLogin(),
          },
        ]
      );
    } catch {
      Alert.alert(
        "오류",
        "정보가 일치하지 않습니다. 입력하신 정보를 다시 확인해 주시기 바랍니다.",
        [
          {
            text: "확인",
            onPress: () => {
              setIsFindPasswordSubmitted(false);
              setIsEmailCertificated(false);
              setFindPasswordCertificationNumber("");
            },
          },
        ]
      );
    }
  };

  function handleGoBackToLogin() {
    navigation.goBack();
  }

  function handleGoBackToSNSLogin() {
    navigation.pop(2);
  }

  return (
    <>
      <SafeArea>
        <KeyboardAvoiding>
          <Container>
            <CustomHeader>
              <BackArrowWrapper>
                <NavigationBackArrow action={() => handleGoBackToLogin()} />
              </BackArrowWrapper>
              <HeaderColumn onPress={() => setPageStatus("EMAIL")}>
                <Text
                  T5
                  bold={pageStatus === "EMAIL"}
                  color={pageStatus === "EMAIL" ? "#000000" : COLOR.GRAY1}
                  mTop={10}
                >
                  이메일 찾기
                </Text>
                {pageStatus === "EMAIL" && <SelectedBorderBottom />}
              </HeaderColumn>
              <HeaderColumn onPress={() => setPageStatus("PASSWORD")}>
                <Text
                  T5
                  bold={pageStatus === "PASSWORD"}
                  color={pageStatus === "PASSWORD" ? "#000000" : COLOR.GRAY1}
                  mTop={10}
                >
                  비밀번호 찾기
                </Text>
                {pageStatus === "PASSWORD" && <SelectedBorderBottom />}
              </HeaderColumn>
            </CustomHeader>

            {pageStatus === "EMAIL" && !isFindEmailSubmitted && (
              <Container paddingHorizontal={20}>
                <Container>
                  <Text T3 bold mTop={42}>
                    회원정보를 입력해 주세요
                  </Text>
                  <Text T6 color={COLOR.GRAY1} mTop={12}>
                    회원 가입 시 입력했던 정보와{"\n"}동일하게 입력해주세요
                  </Text>
                  <LineInput
                    mTop={42}
                    placeholder="이름"
                    value={findEmailName}
                    onChangeText={setFindEmailName}
                    returnKeyType="next"
                    onSubmitEditing={() => findEmailBirthRef.current.focus()}
                  />
                  <LineInput
                    mTop={24}
                    placeholder="생년월일 8자리"
                    value={findEmailBirth}
                    onChangeText={handleFindEmailBirthChange}
                    inputMode="numeric"
                    maxLength={10}
                    ref={findEmailBirthRef}
                    onSubmitEditing={() => handleFindEmail()}
                  />
                </Container>

                <Center>
                  <FindEmailPasswordContainer
                    onPress={() => handleOpenChannelTalk()}
                  >
                    <Text T6 color={COLOR.GRAY2}>
                      이메일/비밀번호 찾는데 문제가 있으신가요?
                    </Text>
                  </FindEmailPasswordContainer>
                </Center>

                <SolidButton
                  text="확인"
                  mBottom={20}
                  disabled={!findEmailName || findEmailBirth.length !== 10}
                  action={() => handleFindEmail()}
                />
              </Container>
            )}

            {pageStatus === "EMAIL" && isFindEmailSubmitted && (
              <Container paddingHorizontal={20}>
                <Container>
                  <Text T3 bold mTop={42}>
                    이메일을 확인해주세요
                  </Text>
                  <Text T6 color={COLOR.GRAY1} mTop={12}>
                    입력하신 정보로 조회되는{"\n"}계정 이메일 정보입니다
                  </Text>
                  <EmailBoxColumn>
                    {foundEmail?.map((item) => (
                      <EmailBox key={item}>
                        <Text T6 medium>
                          {item}
                        </Text>
                      </EmailBox>
                    ))}
                  </EmailBoxColumn>
                </Container>

                <Center>
                  <FindEmailPasswordContainer
                    onPress={() => handleOpenChannelTalk()}
                  >
                    <Text T6 color={COLOR.GRAY2}>
                      이메일/비밀번호 찾는데 문제가 있으신가요?
                    </Text>
                  </FindEmailPasswordContainer>
                </Center>

                <SolidButton
                  text="뒤로가기"
                  mBottom={20}
                  action={() => handleGoBackToLogin()}
                />
              </Container>
            )}

            {pageStatus === "PASSWORD" && !isFindPasswordSubmitted && (
              <Container paddingHorizontal={20}>
                <Container>
                  <Text T3 bold mTop={42}>
                    회원정보를 입력해 주세요
                  </Text>
                  <Text T6 color={COLOR.GRAY1} mTop={12}>
                    회원 가입 시 입력했던 정보와{"\n"}동일하게 입력해주세요
                  </Text>
                  <LineInput
                    mTop={42}
                    placeholder="이메일"
                    value={findPasswordEmail}
                    onChangeText={setFindPasswordEmail}
                    autoComplete="email"
                    keyboardType="email-address"
                    returnKeyType="next"
                    onSubmitEditing={() => findPasswordNameRef.current.focus()}
                  />
                  <LineInput
                    mTop={24}
                    placeholder="이름"
                    value={findPasswordName}
                    onChangeText={setFindPasswordName}
                    returnKeyType="next"
                    ref={findPasswordNameRef}
                    onSubmitEditing={() => findPasswordBirthRef.current.focus()}
                  />
                  <LineInput
                    mTop={24}
                    placeholder="생년월일 8자리"
                    value={findPasswordBirth}
                    onChangeText={handleFindPasswordBirthChange}
                    inputMode="numeric"
                    maxLength={10}
                    ref={findPasswordBirthRef}
                    onSubmitEditing={() => handleFindPassword()}
                  />
                </Container>

                <Center>
                  <FindEmailPasswordContainer
                    onPress={() => handleOpenChannelTalk()}
                  >
                    <Text T6 color={COLOR.GRAY2}>
                      이메일/비밀번호 찾는데 문제가 있으신가요?
                    </Text>
                  </FindEmailPasswordContainer>
                </Center>

                <SolidButton
                  text="확인"
                  mBottom={20}
                  disabled={
                    !findPasswordEmail ||
                    !findPasswordName ||
                    findPasswordBirth.length !== 10
                  }
                  action={() => handleFindPassword()}
                />
              </Container>
            )}

            {pageStatus === "PASSWORD" &&
              isFindPasswordSubmitted &&
              !isEmailCertificated && (
                <Container paddingHorizontal={20}>
                  <Container>
                    <Text T3 bold mTop={42}>
                      이메일로 인증번호를 보냈습니다
                    </Text>
                    <Text T6 color={COLOR.GRAY1} mTop={12}>
                      아래 이메일로 인증번호를 발송하였습니다{"\n"}인증번호를
                      입력하고, 비밀번호를 변경해주세요
                    </Text>
                    <EmailBox mTop={48}>
                      <Text T6 medium>
                        {findPasswordEmail}
                      </Text>
                      <CustomOutlineButtonBackground
                        onPress={() => handleEmailResend()}
                        underlayColor={COLOR.SUB4}
                      >
                        <Text T7 medium color={COLOR.MAIN}>
                          재전송
                        </Text>
                      </CustomOutlineButtonBackground>
                    </EmailBox>

                    <InputContainer>
                      <CustomLineInput
                        placeholder="인증번호 6자리"
                        value={findPasswordCertificationNumber}
                        onChangeText={setFindPasswordCertificationNumber}
                        maxLength={6}
                        returnKeyType="next"
                        onSubmitEditing={() => handleFindPassword()}
                      />
                      <CustomOutlineButtonBackground
                        disabled={findPasswordCertificationNumber?.length < 6}
                        onPress={() =>
                          handleCheckCertificationNumber(
                            findPasswordCertificationNumber
                          )
                        }
                        underlayColor={COLOR.SUB4}
                        style={{
                          position: "absolute",
                          right: 16,
                          top: Device.osName === "Android" ? 22 : 16,
                          zIndex: 1,
                        }}
                      >
                        <Text
                          T7
                          medium
                          color={
                            findPasswordCertificationNumber?.length < 6
                              ? COLOR.GRAY2
                              : COLOR.MAIN
                          }
                        >
                          인증확인
                        </Text>
                      </CustomOutlineButtonBackground>
                    </InputContainer>
                  </Container>

                  <Center>
                    <FindEmailPasswordContainer
                      onPress={() => handleOpenChannelTalk()}
                    >
                      <Text T6 color={COLOR.GRAY2}>
                        이메일/비밀번호 찾는데 문제가 있으신가요?
                      </Text>
                    </FindEmailPasswordContainer>
                  </Center>
                </Container>
              )}

            {pageStatus === "PASSWORD" &&
              isFindPasswordSubmitted &&
              isEmailCertificated && (
                <Container paddingHorizontal={20}>
                  <Container>
                    <Text T3 bold mTop={42}>
                      이메일로 인증번호를 보냈습니다
                    </Text>
                    <Text T6 color={COLOR.GRAY1} mTop={12}>
                      아래 이메일로 인증번호를 발송하였습니다{"\n"}인증번호를
                      입력하고, 비밀번호를 변경해주세요
                    </Text>
                    <EmailBox mTop={48}>
                      <Text T6 medium>
                        {findPasswordEmail}
                      </Text>
                      <Box height={36} />
                    </EmailBox>

                    <InputContainer>
                      <LineInput
                        mTop={24}
                        placeholder="비밀번호 입력"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                        returnKeyType="next"
                        onSubmitEditing={() =>
                          newPasswordCheckRef.current.focus()
                        }
                      />
                      {!newPassword && (
                        <Text
                          T8
                          color={COLOR.GRAY1}
                          style={{
                            position: "absolute",
                            top: Device.osName === "Android" ? 32 : 27,
                            left: 98,
                          }}
                        >
                          (대소문자, 숫자, 특수문자 포함 8자~14자 이내)
                        </Text>
                      )}
                    </InputContainer>

                    {newPassword && !validatePassword(newPassword) && (
                      <Text T8 color="#FF0000CC" mTop={6}>
                        * 대소문자, 숫자, 특수문자 포함 8자~14자 이내를 충족하지
                        않습니다
                      </Text>
                    )}
                    <LineInput
                      mTop={24}
                      placeholder="비밀번호 확인"
                      value={newPasswordCheck}
                      onChangeText={setNewPasswordCheck}
                      secureTextEntry
                      returnKeyType="done"
                      ref={newPasswordCheckRef}
                      onSubmitEditing={() => handleChangePassword()}
                    />
                    {newPassword &&
                      newPasswordCheck &&
                      newPassword !== newPasswordCheck && (
                        <Text T8 color="#FF0000CC" mTop={6}>
                          * 비밀번호가 일치하지 않습니다
                        </Text>
                      )}
                  </Container>

                  <SolidButton
                    text="비밀번호 변경"
                    mBottom={20}
                    disabled={
                      !validatePassword(newPassword) ||
                      newPassword !== newPasswordCheck
                    }
                    action={() => handleChangePassword()}
                  />
                </Container>
              )}
          </Container>
        </KeyboardAvoiding>
      </SafeArea>

      {(findPasswordAccountType === "애플" ||
        findPasswordAccountType === "구글") && (
        <BottomSheetBackground onPress={() => setFindPasswordAccountType("")}>
          <BottomSheetContainer>
            <Image source={exclamationIcon} width={70} height={70} mTop={-20} />
            <Text T4 medium center mTop={20}>
              해당 계정은{"\n"}
              {findPasswordAccountType}&nbsp;로그인을 통해 가입하셨습니다
            </Text>
            <SolidButton
              text="로그인 하기"
              mTop={30}
              action={() => handleGoBackToSNSLogin()}
            />
          </BottomSheetContainer>
        </BottomSheetBackground>
      )}
    </>
  );
}

const CustomHeader = styled.View`
  width: 100%;
  height: ${Device.osName === "Android" ? "90px" : "50px"};
  padding: ${Device.osName === "Android" ? "40px 24px 0px 24px" : "0 24px"};
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  border-bottom-width: 1.5px;
  border-color: ${COLOR.GRAY3};
`;

const BackArrowWrapper = styled.View`
  position: absolute;
  top: ${Device.osName === "Android" ? "44px" : "10px"};
  left: 16px;
`;

const HeaderColumn = styled.Pressable`
  width: 120px;
  height: 100%;
  align-items: center;
`;

const SelectedBorderBottom = styled.View`
  position: absolute;
  width: 120px;
  height: 3px;
  bottom: -2px;
  background-color: ${COLOR.MAIN};
`;

const EmailBoxColumn = styled.View`
  width: 100%;
  margin-top: 48px;
  gap: 20px;
`;

const EmailBox = styled.View`
  ${(props) => props.mTop && `margin-top: ${props.mTop}px;`}
  width: 100%;
  padding: 12px 16px;
  background-color: ${COLOR.GRAY5};
  border-radius: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const InputContainer = styled.View`
  width: 100%;
  position: relative;
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

const CustomLineInput = styled.TextInput`
  margin-top: 24px;
  width: 100%;
  padding: 0 0 18px 8px;
  border-bottom-width: 1.5px;
  border-color: ${COLOR.GRAY3};
  font-family: "Pretendard-Regular";
  font-size: ${TYPOGRAPHY.T5.SIZE};
  color: ${(props) => (props.editable === false ? COLOR.GRAY0 : "#000000")};
`;

const FindEmailPasswordContainer = styled.TouchableOpacity`
  margin-bottom: 40px;
  border-bottom-width: 1px;
  border-bottom-color: ${COLOR.GRAY3};
`;

const BottomSheetBackground = styled.Pressable`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #000000aa;
`;

const BottomSheetContainer = styled.Pressable`
  position: absolute;
  padding: 20px;
  height: 340px;
  width: 100%;
  bottom: 0;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
`;
