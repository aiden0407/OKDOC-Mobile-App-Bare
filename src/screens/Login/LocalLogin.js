//React
import { useState, useRef, useContext } from "react";
import { ApiContext } from "context/ApiContext";
import { AppContext } from "context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styled from "styled-components/native";
import { dataDogFrontendError } from "api/DataDog";

//Components
import { COLOR } from "constants/design";
import { Alert, ActivityIndicator } from "react-native";
import {
  SafeArea,
  KeyboardAvoiding,
  ContainerCenter,
  Center,
} from "components/Layout";
import { Text } from "components/Text";
import { Image } from "components/Image";
import { BorderInput } from "components/TextInput";
import { SolidButton, OutlineButton } from "components/Button";

//Api
import { familyLocalLogin } from "api/Login";

//Assets
import mainLogo from "assets/main/main_logo.png";

export default function LoginPage({ navigation }) {
  const { dispatch } = useContext(ApiContext);
  const { dispatch: appContextDispatch } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef();

  const handleLogin = async function (email, password) {
    setLoading(true);

    try {
      const familyLocalLoginResponse = await familyLocalLogin(email, password);
      const loginToken = familyLocalLoginResponse.data.response.accessToken;
      dispatch({
        type: "LOGIN",
        loginToken: loginToken,
        email: email,
      });

      try {
        const accountData = {
          loginToken: loginToken,
          email: email,
        };
        await AsyncStorage.setItem(
          "@account_data",
          JSON.stringify(accountData)
        );
        navigation.goBack();
        navigation.pop();
        setLoading(false);
      } catch (error) {
        dataDogFrontendError(error);
      }
    } catch {
      setLoading(false);
      Alert.alert("오류", "이메일과 비밀번호를 다시 확인해 주시기 바랍니다.");
    }
  };

  function handleRegister() {
    appContextDispatch({
      type: "REGISTER_ROUTE",
      route: "LOCAL_REGISTER",
    });
    navigation.navigate("RegisterPolicy");
  }

  function handleFindEmailPassword() {
    navigation.navigate("FindEmailPassword");
  }

  return (
    <>
      {loading && (
        <LoadingBackground>
          <ActivityIndicator size="large" color="#5500CC" />
        </LoadingBackground>
      )}
      <SafeArea>
        <KeyboardAvoiding>
          <ContainerCenter paddingHorizontal={20}>
            <Center>
              <Image source={mainLogo} width={182} height={40} />
              <Text T5 medium color={COLOR.MAIN} mTop={20}>
                해외에서도{" "}
                <Text T5 bold color={COLOR.MAIN}>
                  대학병원 전문의
                </Text>
                를 만나보세요
              </Text>
            </Center>

            <BorderInput
              mTop={30}
              value={email}
              onChangeText={setEmail}
              placeholder="이메일"
              autoComplete="email"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordRef.current.focus();
              }}
            />
            <BorderInput
              mTop={8}
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호"
              secureTextEntry
              autoComplete="current-password"
              returnKeyType="done"
              onSubmitEditing={() => {
                handleLogin(email, password);
              }}
              ref={passwordRef}
            />

            <SolidButton
              mTop={120}
              text="로그인"
              action={() => handleLogin(email, password)}
            />
            <OutlineButton
              mTop={8}
              text="회원가입"
              action={() => handleRegister()}
            />

            <FindEmailPasswordContainer
              onPress={() => handleFindEmailPassword()}
            >
              <Text T6 medium color={COLOR.GRAY2}>
                이메일/비밀번호가 기억나지 않나요?
              </Text>
            </FindEmailPasswordContainer>
          </ContainerCenter>
        </KeyboardAvoiding>
      </SafeArea>
    </>
  );
}

const LoadingBackground = styled.Pressable`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #00000022;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FindEmailPasswordContainer = styled.TouchableOpacity`
  margin-top: 40px;
  border-bottom-width: 1px;
  border-bottom-color: ${COLOR.GRAY3};
`;
