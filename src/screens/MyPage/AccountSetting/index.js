//React
import { useState, useEffect, useContext } from "react";
import { ApiContext } from "context/ApiContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styled from "styled-components/native";
import { dataDogFrontendError } from "api/DataDog";

//Components
import { COLOR } from "constants/design";
import { Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeArea, Container, Row, DividingLine } from "components/Layout";
import { Text } from "components/Text";

//Api
import { getFamilyInfo } from "api/MyPage";

export default function AccountSettingScreen({ navigation }) {
  const {
    state: { accountData },
    dispatch,
  } = useContext(ApiContext);
  const [accountRoute, setAccountRoute] = useState(" ");

  useEffect(() => {
    checkLoginType();
  }, []);

  const checkLoginType = async function () {
    try {
      const response = await getFamilyInfo(
        accountData.loginToken,
        accountData.email
      );
      if (response.data.response?.apple_id) {
        setAccountRoute("애플");
      } else if (response.data.response?.google_id) {
        setAccountRoute("구글");
      } else {
        setAccountRoute("");
      }
    } catch (error) {
      console.log("getFamilyInfo error:", error);
    }
  };

  function handleChangePassword() {
    navigation.navigate("MyPageStackNavigation", { screen: "ChangePassword" });
  }

  const handleLogout = async function () {
    dispatch({ type: "LOGOUT" });
    try {
      await AsyncStorage.removeItem("@account_data");
    } catch (error) {
      dataDogFrontendError(error);
    }
    navigation.goBack();
  };

  function handleWithdrawal() {
    navigation.navigate("MyPageStackNavigation", { screen: "Withdrawal" });
  }

  function createLogoutAlert() {
    Alert.alert("접속중인 기기에서 로그아웃 하시겠습니까?", "", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "확인",
        onPress: () => handleLogout(),
      },
    ]);
  }

  function SettingButton({ title, action }) {
    return (
      <SettingButtonRow onPress={action}>
        <Text T5 medium>
          {title}
        </Text>
        <Ionicons name="chevron-forward" size={20} />
      </SettingButtonRow>
    );
  }

  return (
    <SafeArea>
      <Container>
        <Text T3 bold mTop={30} mLeft={20}>
          계정 이메일
        </Text>
        <Text T6 color={COLOR.GRAY2} mTop={12} mLeft={20}>
          해당 이메일은 가입 시 기입된 정보입니다.{"\n"}개인정보 관련 문의는
          고객센터 1:1 문의를 통해 전달해주세요.
        </Text>
        <Row mTop={24} paddingHorizontal={20} gap={6}>
          <PhoneNumberBox style={{ width: "100%" }}>
            <Text T5>
              {accountData?.email}{" "}
              {(accountRoute === "애플" || accountRoute === "구글") &&
                `(${accountRoute})`}
            </Text>
          </PhoneNumberBox>
        </Row>

        <DividingLine marginVertical={30} />

        <SettingButtonContainer>
          {accountRoute === "" && (
            <SettingButton
              title="비밀번호 변경"
              action={() => handleChangePassword()}
            />
          )}
          <SettingButton title="로그아웃" action={() => createLogoutAlert()} />
          <SettingButton title="회원탈퇴" action={() => handleWithdrawal()} />
        </SettingButtonContainer>
      </Container>
    </SafeArea>
  );
}

const PhoneNumberBox = styled.View`
  padding: 8px 0 8px 12px;
  background-color: ${COLOR.GRAY6};
  border-radius: 3px;
`;

const SettingButtonContainer = styled.View`
  width: 100%;
  padding: 0 20px;
  gap: 24px;
`;

const SettingButtonRow = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
