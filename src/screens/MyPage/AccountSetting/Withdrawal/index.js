//React
import { useContext } from "react";
import { ApiContext } from "context/ApiContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styled from "styled-components/native";
import useVersionCheck from "hook/useVersionCheck";
import { dataDogFrontendError } from "api/DataDog";

//Components
import { COLOR } from "constants/design";
import { Alert, Linking } from "react-native";
import { SafeArea, KeyboardAvoiding, Container } from "components/Layout";
import { Text } from "components/Text";
import { LineInput } from "components/TextInput";
import { SolidButton } from "components/Button";

//Api
import { deleteFamilyAccout } from "api/MyPage";

export default function WithdrawalScreen({ navigation }) {
  const isLastestVersion = useVersionCheck();

  const {
    state: { accountData, profileData },
    dispatch,
  } = useContext(ApiContext);
  const mainProfile = profileData?.[0];

  function createWithdrawalAlert() {
    if (isLastestVersion === "Android") {
      Alert.alert(
        "알림",
        "새로운 버전이 출시되었습니다.\n업데이트 후 이용해 주시기 바랍니다.",
        [
          {
            text: "확인",
            onPress: () =>
              Linking.openURL(
                "https://play.google.com/store/apps/details?id=kr.co.insunginfo.okdoc"
              ),
          },
        ]
      );
      return;
    } else if (isLastestVersion === "iOS") {
      Alert.alert(
        "알림",
        "새로운 버전이 출시되었습니다.\n업데이트 후 이용해 주시기 바랍니다.",
        [
          {
            text: "확인",
            onPress: () =>
              Linking.openURL(
                "https://apps.apple.com/us/app/%EC%98%A4%EC%BC%80%EC%9D%B4%EB%8B%A5/id6463086824"
              ),
          },
        ]
      );
      return;
    }

    Alert.alert(
      "정말 탈퇴하시겠습니까?",
      "\n회원탈퇴 시 모든 정보가 삭제되며,\n예약하신 상담은 환불 규정에 따라\n취소 처리됩니다.",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "확인",
          onPress: () => handleWithdrawal(),
        },
      ]
    );
  }

  const handleWithdrawal = async function () {
    try {
      await deleteFamilyAccout(accountData.loginToken, accountData.email);
      dispatch({ type: "LOGOUT" });
      try {
        await AsyncStorage.removeItem("@account_data");
      } catch (error) {
        dataDogFrontendError(error);
      }
      navigation.popToTop();
      navigation.goBack();
      navigation.navigate("Home");
      Alert.alert("안내", "회원탈퇴가 정상적으로 완료되었습니다.");
    } catch {
      Alert.alert("오류", "네트워크 에러로 인해 정보를 불러오지 못했습니다.");
    }
  };

  function formatDate(date) {
    const year = date.toString().slice(0, 4);
    const month = date.toString().slice(4, 6);
    const day = date.toString().slice(6, 8);
    return `${year}-${month}-${day}`;
  }

  return (
    <SafeArea>
      <KeyboardAvoiding>
        <Container paddingHorizontal={20}>
          <Container>
            <Text T3 bold mTop={30}>
              회원 탈퇴를 위해{"\n"}아래 내용을 확인해주세요
            </Text>
            <Text T6 color={COLOR.GRAY2} mTop={12}>
              이 작업은 실행 취소할 수 없습니다.{"\n"}취급하고 있는 개인정보
              데이터는 삭제되며,{"\n"}동일한 이메일로 재가입이 불가능하게
              됩니다.
            </Text>

            <Text T5 medium mTop={24}>
              이메일
            </Text>
            <LineInput mTop={12} value={accountData.email} editable={false} />
            {mainProfile?.name && (
              <>
                <Text T5 medium mTop={24}>
                  이름
                </Text>
                <LineInput
                  mTop={12}
                  value={mainProfile?.name}
                  editable={false}
                />
              </>
            )}
            {mainProfile?.birth && (
              <>
                <Text T5 medium mTop={24}>
                  생년월일
                </Text>
                <LineInput
                  mTop={12}
                  value={formatDate(mainProfile?.birth)}
                  editable={false}
                />
              </>
            )}
          </Container>

          <SolidButton
            text="탈퇴하기"
            mBottom={20}
            action={() => createWithdrawalAlert()}
          />
        </Container>
      </KeyboardAvoiding>
    </SafeArea>
  );
}
