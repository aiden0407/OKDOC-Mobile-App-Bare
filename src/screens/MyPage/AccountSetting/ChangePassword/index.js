//React
import { useState, useRef, useContext } from "react";
import { ApiContext } from "context/ApiContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dataDogFrontendError } from "api/DataDog";

//Components
import { COLOR } from "constants/design";
import { Alert } from "react-native";
import {
  SafeArea,
  KeyboardAvoiding,
  Container,
  DividingLine,
  PaddingContainer,
} from "components/Layout";
import { Text } from "components/Text";
import { LineInput } from "components/TextInput";
import { SolidButton } from "components/Button";

//Api
import { changePassword } from "api/MyPage";

export default function ChangePasswordScreen({ navigation }) {
  const {
    state: { accountData },
    dispatch,
  } = useContext(ApiContext);
  const [currentPassword, setCurrentPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [newPasswordCheck, setNewPasswordCheck] = useState();
  const newPasswordRef = useRef();
  const newPasswordCheckRef = useRef();

  function validatePassword(password) {
    const regExp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.?!@#$%^&*+=]).{8,14}$/;
    return regExp.test(password);
  }

  function createChangePasswordAlert() {
    Alert.alert("비밀번호를 변경하시겠습니까?", "", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "확인",
        onPress: () => handleChangePassword(),
      },
    ]);
  }

  const handleChangePassword = async function () {
    try {
      await changePassword(
        accountData.loginToken,
        accountData.email,
        currentPassword,
        newPassword
      );
      dispatch({ type: "LOGOUT" });
      try {
        await AsyncStorage.removeItem("@account_data");
      } catch (error) {
        dataDogFrontendError(error);
      }
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
      Alert.alert("현재 비밀번호가 일치하지 않습니다.");
    }
  };

  function handleGoBackToLogin() {
    navigation.popToTop();
    navigation.goBack();
  }

  return (
    <SafeArea>
      <KeyboardAvoiding>
        <Container>
          <Container>
            <PaddingContainer>
              <Text T3 bold mTop={30}>
                비밀번호 변경
              </Text>
              <Text T5 medium mTop={24}>
                이메일
              </Text>
              <LineInput mTop={12} value={accountData.email} editable={false} />
              <Text T5 medium mTop={24}>
                현재 비밀번호
              </Text>
              <LineInput
                mTop={12}
                placeholder="비밀번호 입력"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                returnKeyType="next"
                onSubmitEditing={() => {
                  newPasswordRef.current.focus();
                }}
              />
            </PaddingContainer>

            <DividingLine marginVertical={30} />

            <PaddingContainer>
              <Text T5 medium>
                비밀번호 변경
              </Text>
              {!newPassword && (
                <Text
                  T8
                  color={COLOR.GRAY1}
                  style={{ position: "absolute", top: 41, left: 112 }}
                >
                  (대소문자, 숫자, 특수문자 포함 8자~14자 이내)
                </Text>
              )}
              <LineInput
                mTop={14}
                placeholder="비밀번호 입력"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                returnKeyType="next"
                ref={newPasswordRef}
                onSubmitEditing={() => {
                  newPasswordCheckRef.current.focus();
                }}
              />
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
                onSubmitEditing={() => {
                  createChangePasswordAlert();
                }}
              />
              {newPasswordCheck && newPassword !== newPasswordCheck && (
                <Text T8 color="#FF0000CC" mTop={6}>
                  * 비밀번호가 일치하지 않습니다
                </Text>
              )}
            </PaddingContainer>
          </Container>

          <PaddingContainer>
            <SolidButton
              text="저장"
              mBottom={20}
              disabled={
                !currentPassword ||
                !validatePassword(newPassword) ||
                newPassword !== newPasswordCheck
              }
              action={() => createChangePasswordAlert()}
            />
          </PaddingContainer>
        </Container>
      </KeyboardAvoiding>
    </SafeArea>
  );
}
