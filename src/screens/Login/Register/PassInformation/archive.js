//React
import { useContext } from "react";
import { ApiContext } from "context/ApiContext";
import { AppContext } from "context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IMP from "iamport-react-native";

//Components
import { SafeArea } from "components/Layout";
import { Alert } from "react-native";

//Api
import {
  createAppleAccount,
  createGoogleAccount,
  createLocalAccount,
  createPatientByPassApp,
} from "api/Login";
import { deleteFamilyAccout } from "api/MyPage";

export default function EmailPasswordScreen({ navigation }) {
  const { dispatch: apiContextDispatch } = useContext(ApiContext);
  const {
    state: { registerStatus },
    dispatch: appContextDispatch,
  } = useContext(AppContext);

  const data = {
    merchant_uid: `mid_${new Date().getTime()}`,
    company: "인성정보",
  };

  const callback = async function (response) {
    if (response.success) {
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
        initPatient(loginToken, response.imp_uid);
      } catch (error) {
        Alert.alert(
          "오류",
          "계정 생성에 실패하였습니다. 다시 시도해 주시기 바랍니다."
        );
      }
    }
  };

  const initPatient = async function (loginToken, imp_uid) {
    try {
      const createPatientByPassAppResponse = await createPatientByPassApp(
        loginToken,
        imp_uid
      );
      const mainProfile = createPatientByPassAppResponse.data.response;
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
        //console.log(error);
      }

      apiContextDispatch({
        type: "PROFILE_CREATE_MAIN",
        id: mainProfile.id,
        name: mainProfile.passapp_certification.name,
        relationship: mainProfile.relationship,
        birth: mainProfile.passapp_certification.birthday.replaceAll("-", ""),
        gender: mainProfile.passapp_certification.gender.toUpperCase(),
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
          Alert.alert(
            "네트워크 에러",
            "프로필 생성에 실패했습니다. 관리자에게 문의해 주시기 바랍니다.",
            "",
            [
              {
                text: "확인",
                onPress: () => navigation.goBack(),
              },
            ]
          );
        }
      } else {
        //중복 프로필 생성 외 프로필 생성 실패
        Alert.alert(
          "네트워크 에러",
          "프로필 생성에 실패했습니다. 관리자에게 문의해 주시기 바랍니다.",
          "",
          [
            {
              text: "확인",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    }
  };

  return (
    <SafeArea>
      <IMP.Certification
        userCode={"imp64183758"}
        data={data}
        callback={callback}
        loading={<SafeArea />}
      />
    </SafeArea>
  );
}
