//React
import { useContext } from "react";
import { ApiContext } from "context/ApiContext";
import { AppContext } from "context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styled from "styled-components/native";
import { dataDogFrontendError } from "api/DataDog";

//Components
import { COLOR } from "constants/design";
import { Alert } from "react-native";
import { SafeArea, Container, ContainerCenter } from "components/Layout";
import { Text } from "components/Text";
import { Image } from "components/Image";
import { SolidButton, OutlineButton } from "components/Button";

//Api
import {
  findFamilyAccount,
  createAppleAccount,
  createGoogleAccount,
  createLocalAccount,
  createPatientByBirth,
} from "api/Login";
import { deleteFamilyAccout } from "api/MyPage";

//Assets
import exclamationIcon from "assets/icons/circle-exclamation.png";

export default function RegisterCompleteScreen({ navigation, route }) {
  const { dispatch: apiContextDispatch } = useContext(ApiContext);
  const {
    state: { registerStatus },
    dispatch: appContextDispatch,
  } = useContext(AppContext);
  const emailList = route.params.emailList;
  const name = route.params.name;
  const birth = route.params.birth;
  const gender = route.params.gender;

  function handleGoBack() {
    navigation.popToTop();
  }

  const handleRegister = async function () {
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
    } catch {
      Alert.alert(
        "오류",
        "계정 생성에 실패하였습니다. 다시 시도해 주시기 바랍니다."
      );
    }
  };

  const initPatient = async function (loginToken) {
    try {
      const createPatientByBirthResponse = await createPatientByBirth(
        loginToken,
        registerStatus.email,
        name,
        birth,
        gender
      );
      const mainProfile = createPatientByBirthResponse.data.response;

      apiContextDispatch({
        type: "LOGIN",
        loginToken: loginToken,
        email: registerStatus.email,
      });
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
        dataDogFrontendError(error);
      }

      apiContextDispatch({
        type: "PROFILE_CREATE_MAIN",
        id: mainProfile.id,
        name: mainProfile.user_name,
        relationship: mainProfile.relationship,
        birth: mainProfile.birth,
        gender: mainProfile.gender,
      });
      appContextDispatch({ type: "REGISTER_COMPLETE" });
      navigation.navigate("RegisterComplete");
    } catch (error) {
      // 409 중복 프로필 생성 또는 기타 에러로 프로필 생성이 불가시 우선은 회원 탈퇴 콜을 날림
      try {
        await deleteFamilyAccout(loginToken, registerStatus.email);
        apiContextDispatch({ type: "LOGOUT" });
        try {
          await AsyncStorage.removeItem("@account_data");
        } catch (error) {
          dataDogFrontendError(error);
        }

        if (error?.response?.data.statusCode === 409) {
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
        } else {
          // 프로필 생성 후 회원탈퇴 성공 => 다시 시도 요청
          console.log(error?.response?.data);
          Alert.alert(
            "네트워크 에러",
            "프로필 생성에 실패했습니다. 다시 시도해 주시기 바랍니다."
          );
        }
      } catch {
        // 회원 탈퇴 실패
        Alert.alert(
          "네트워크 에러",
          "프로필 생성에 실패했습니다. 관리자에게 문의해 주시기 바랍니다."
        );
      }
    }
  };

  return (
    <SafeArea>
      <Container paddingHorizontal={20}>
        <ContainerCenter>
          <Image source={exclamationIcon} width={70} height={70} />
          <Text T2 bold mTop={18}>
            아래 계정을 확인해주세요
          </Text>
          <Text T3 medium color={COLOR.GRAY1} mTop={6}>
            동일한 정보로 등록된 계정이 존재합니다
          </Text>
          <Text T6 center color={COLOR.GRAY1} mTop={30}>
            아래 계정이 본인이 아니라면,{"\n"}회원가입을 계속 진행해주세요
          </Text>

          <EmailBoxColumn>
            {emailList?.map((item) => (
              <EmailBox key={item}>
                <Text T6 medium>
                  {item}
                </Text>
              </EmailBox>
            ))}
          </EmailBoxColumn>
        </ContainerCenter>

        <SolidButton text="회원가입 진행하기" action={() => handleRegister()} />
        <OutlineButton
          mTop={12}
          mBottom={20}
          text="위 계정으로 로그인하기"
          action={() => handleGoBack()}
        />
      </Container>
    </SafeArea>
  );
}

const EmailBoxColumn = styled.View`
  width: 100%;
  margin-top: 18px;
  gap: 8px;
`;

const EmailBox = styled.View`
  width: 100%;
  padding: 15px;
  background-color: ${COLOR.GRAY5};
  border-radius: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
