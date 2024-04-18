//React
import { useEffect, useContext } from "react";
import { ApiContext } from "context/ApiContext";
import styled from "styled-components/native";
import useTestAccount from "hook/useTestAccount";
import { dataDogFrontendError } from "api/DataDog";

//Components
import { COLOR } from "constants/design";
import { Platform, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeArea, ContainerTop, DividingLine, Row } from "components/Layout";
import { Text } from "components/Text";
import { Image } from "components/Image";
import * as Clipboard from "expo-clipboard";

//Assets
import accountPerson from "assets/icons/mypage-account.png";
import profileCard from "assets/icons/mypage-profile.png";

// IAP
import { withIAPContext, requestPurchase, useIAP } from "react-native-iap";
const skus = ["internal.staff.token"];

const MyPageScreen = ({ navigation }) => {
  const {
    state: { accountData, profileData, reuseTickets },
  } = useContext(ApiContext);
  const mainProfile = profileData?.[0];

  const {
    initConnectionError,
    currentPurchase,
    products,
    getProducts,
    finishTransaction,
  } = useIAP();

  useEffect(() => {
    getProducts({ skus });
  }, []);

  useEffect(() => {
    if (initConnectionError && useTestAccount(accountData?.email)) {
      dataDogFrontendError(initConnectionError);
      Alert.alert(
        "인앱결제 에러",
        `${
          Platform.OS === "ios" ? "앱스토어" : "구글 플레이스토어"
        } 연결에 실패하였습니다. 앱을 종료 후 다시 시도해 주시기 바랍니다.`
      );
    }
  }, [initConnectionError]);

  useEffect(() => {
    if (currentPurchase && useTestAccount(accountData?.email)) {
      Clipboard.setStringAsync(JSON.stringify(currentPurchase));
      Alert.alert("토큰 구매", "결제 정보가 클립보드에 복사되었습니다.");
    }
  }, [currentPurchase]);

  function handleLogin() {
    navigation.navigate("LoginStackNavigation");
  }

  function handleAccountInformation() {
    if (accountData.loginToken) {
      navigation.navigate("MyPageStackNavigation", {
        screen: "AccountSetting",
      });
    } else {
      navigation.navigate("NeedLoginNavigation", {
        screen: "NeedLogin",
        params: { headerTitle: "마이페이지" },
      });
    }
  }

  function handleProfileList() {
    if (accountData?.loginToken) {
      navigation.navigate("MyPageStackNavigation", {
        screen: "ProfileDetail",
      });
    } else {
      navigation.navigate("NeedLoginNavigation", {
        screen: "NeedLogin",
        params: { headerTitle: "마이페이지" },
      });
    }
  }

  function handleMyPageScreen(navigate) {
    navigation.navigate("MyPageStackNavigation", {
      screen: navigate,
      params: navigate === "Inquiry" && { headerTitle: "1:1 문의" },
    });
  }

  function ServicesButton({ title, navigate }) {
    return (
      <CustomerSurviceRow onPress={() => handleMyPageScreen(navigate)}>
        <Text T5 medium>
          {title}
        </Text>
        <Ionicons name="chevron-forward" size={20} />
      </CustomerSurviceRow>
    );
  }

  return (
    <SafeArea>
      <ContainerTop paddingTop={30}>
        <LoginContainer>
          {accountData?.loginToken ? (
            mainProfile?.id ? (
              <>
                <LoginButton activeOpacity={1}>
                  <Text T3 bold>
                    안녕하세요,{" "}
                    <Text T3 bold color={COLOR.MAIN} mRight={12}>
                      {mainProfile.name}
                    </Text>
                    님
                  </Text>
                </LoginButton>
              </>
            ) : (
              <Row>
                <StyledLoginButton onPress={() => handleProfileList()}>
                  <Text T3 bold color={COLOR.MAIN}>
                    프로필 등록
                  </Text>
                </StyledLoginButton>
                <Text T3 bold>
                  &nbsp;&nbsp;
                  <Text T4 bold>
                    후 서비스 이용이 가능합니다
                  </Text>{" "}
                </Text>
              </Row>
            )
          ) : (
            <>
              <LoginButton onPress={() => handleLogin()}>
                <Text T3 bold mRight={12}>
                  로그인을 해주세요
                </Text>
                <Ionicons name="chevron-forward" size={20} />
              </LoginButton>
            </>
          )}
        </LoginContainer>

        <InformationContainer>
          <InformationButton
            underlayColor={COLOR.GRAY5}
            onPress={() => handleAccountInformation()}
          >
            <>
              <Image
                source={accountPerson}
                width={35}
                height={40.25}
                mTop={13}
              />
              <Text T6 mTop={11}>
                계정 설정
              </Text>
            </>
          </InformationButton>

          <InformationButton
            underlayColor={COLOR.GRAY5}
            onPress={() => handleProfileList()}
          >
            <>
              <Image source={profileCard} width={54} height={32} mTop={18} />
              {accountData?.loginToken && !mainProfile?.id ? (
                <Text T6 mTop={14}>
                  프로필 등록
                </Text>
              ) : (
                <Text T6 mTop={14}>
                  프로필 정보
                </Text>
              )}
            </>
          </InformationButton>
        </InformationContainer>

        <DividingLine />

        <CustomerSurviceContainer>
          <Text T6 medium color={COLOR.GRAY1}>
            고객센터
          </Text>
          <ServicesButton title="1:1 문의" navigate="Inquiry" />
          <ServicesButton title="약관 및 정책" navigate="Policy" />

          {useTestAccount(accountData?.email) &&
            products.map((product) => (
              <CustomerSurviceRow
                key={product.productId}
                onPress={async () => {
                  const params = Platform.select({
                    ios: {
                      sku: product.productId,
                    },
                    android: {
                      skus: [product.productId],
                    },
                  });
                  if (params) {
                    try {
                      await requestPurchase(params);
                    } catch (error) {
                      if (error?.code === "E_USER_CANCELLED") {
                        // 유저가 결제창을 나감
                      } else {
                        dataDogFrontendError(error);
                      }
                    }
                  } else {
                    Alert.alert(
                      "토큰 구매 에러",
                      "해당 플랫폼에서는 튜토리얼을 진행하실 수 없습니다."
                    );
                  }
                }}
              >
                <Text T5 medium>
                  직원용 토큰 구매
                </Text>
                <Ionicons name="chevron-forward" size={20} />
              </CustomerSurviceRow>
            ))}

          {useTestAccount(accountData?.email) && currentPurchase && (
            <CustomerSurviceRow
              onPress={async () => {
                try {
                  await finishTransaction({
                    purchase: currentPurchase,
                    isConsumable: true,
                    developerPayloadAndroid: undefined,
                  });
                  Alert.alert("토큰 구매 완료");
                } catch (error) {
                  dataDogFrontendError(error);
                  Alert.alert(
                    "토큰 구매 실패",
                    "트랜잭션 종료에 실패하였습니다."
                  );
                }
              }}
            >
              <Text T5 medium>
                직원용 토큰 구매 트랜잭션 종료
              </Text>
              <Ionicons name="chevron-forward" size={20} />
            </CustomerSurviceRow>
          )}
        </CustomerSurviceContainer>
      </ContainerTop>
    </SafeArea>
  );
};

export default withIAPContext(MyPageScreen);

const LoginContainer = styled.View`
  width: 100%;
`;

const LoginButton = styled.TouchableOpacity`
  margin-left: 20px;
  flex-direction: row;
  align-items: center;
`;

const StyledLoginButton = styled(LoginButton)`
  border-bottom-width: 1px;
  border-bottom-color: ${COLOR.MAIN};
`;

const InformationContainer = styled.View`
  width: 100%;
  height: 190px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 60px;
`;

const InformationButton = styled.TouchableHighlight`
  width: 100px;
  height: 94px;
  border-radius: 10px;
  background-color: ${COLOR.GRAY6};
  align-items: center;
`;

const CustomerSurviceContainer = styled.View`
  width: 100%;
  height: 100%;
  padding: 30px 20px 0 20px;
`;

const CustomerSurviceRow = styled.TouchableOpacity`
  margin-top: 26px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
