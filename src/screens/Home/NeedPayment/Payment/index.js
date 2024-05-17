//React
import { useState, useEffect, useContext } from "react";
import { ApiContext } from "context/ApiContext";
import { AppContext } from "context/AppContext";
import cheerio from "cheerio";
import * as Linking from "expo-linking";
import styled from "styled-components/native";

//Components
import { SafeArea } from "components/Layout";
import { Platform, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { Text } from "components/Text";

//Api
import { ZOOMURL } from "constants/api";
import { createInvoicePaymentRequest } from "api/History";

export default function PaymentScreen({ navigation, route }) {
  const {
    state: { accountData },
  } = useContext(ApiContext);
  const {
    state: { needPayment },
  } = useContext(AppContext);
  const telemedicineData = route.params.telemedicineData;
  const [canGoBack, setCanGoBack] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    navigation.setOptions({
      headerShown: Platform.OS === "android" ? true : canGoBack,
      headerBackVisible: false,
      headerRight: () => {
        if (Platform.OS === "android") {
          if (canGoBack) {
            return (
              <EditButton
                onPress={() =>
                  navigation.navigate("NeedPaymentDetail", {
                    telemedicineData: telemedicineData,
                  })
                }
              >
                <Text T5 bold>
                  X
                </Text>
              </EditButton>
            );
          }
        } else {
          return (
            <EditButton
              onPress={() =>
                navigation.navigate("NeedPaymentDetail", {
                  telemedicineData: telemedicineData,
                })
              }
            >
              <Text T5 bold>
                X
              </Text>
            </EditButton>
          );
        }
      },
    });
  }, [navigation, canGoBack]);

  useEffect(() => {
    paymentRequest();
  }, []);

  const paymentRequest = async function () {
    try {
      const response = await createInvoicePaymentRequest(
        telemedicineData,
        accountData.email
      );
      var htmlDecoded = decodeValues(response.data);
      setHtmlContent(htmlDecoded);
    } catch {
      Alert.alert(
        "네트워크 에러",
        "결제 요청에 실패하였습니다. 다시 시도해 주시기 바랍니다."
      );
      navigation.goBack();
    }
  };

  const decodeValues = (html) => {
    const $ = cheerio.load(html);

    const pUnameInput = $('input[name="P_UNAME"]');
    if (pUnameInput) {
      const decodedValue = decodeURIComponent(pUnameInput.attr("value"));
      pUnameInput.attr("value", decodedValue);
    }

    const pGoodsInput = $('input[name="P_GOODS"]');
    if (pGoodsInput) {
      const decodedValue = decodeURIComponent(pGoodsInput.attr("value"));
      pGoodsInput.attr("value", decodedValue);
    }

    return $.html();
  };

  const onShouldStartLoadWithRequest = (navState) => {
    if (
      navState.url.startsWith("http://") ||
      navState.url.startsWith("https://") ||
      navState.url.startsWith("about:blank")
    ) {
      return true;
    } else {
      Linking.openURL(navState.url).catch((error) => {
        Alert.alert(
          "결제 안내",
          "앱 실행에 실패했습니다. 설치가 되어있지 않은 경우 설치하기 버튼을 눌러주세요."
        );
      });
      return false;
    }
  };

  function handlePaymentComplete(url) {
    if (url?.split("?invoice_id=")[1]) {
      navigation.replace("TelemedicineRoomNavigation", {
        screen: "PaymentComplete",
        params: { telemedicineData: telemedicineData },
      });
    } else {
      Alert.alert(
        "안내",
        "결제 과정에서 문제가 발생했습니다. 다시 시도해 주시기 바랍니다."
      );
      navigation.navigate("NeedPaymentDetail", {
        telemedicineData: telemedicineData,
      });
    }
  }

  return (
    <SafeArea>
      <WebView
        source={{ html: htmlContent }}
        originWhitelist={["*"]}
        onNavigationStateChange={(navState) => {
          if (Platform.OS === "android") {
            if (
              navState.url.includes(
                "https://ksmobile.inicis.com/smart/payment/"
              ) ||
              navState.url.includes("about:blank")
            ) {
              setCanGoBack(false);
            } else {
              setCanGoBack(true);
            }
          } else {
            if (navState.canGoBack) {
              setCanGoBack(true);
            }
          }

          if (navState.url.includes(`${ZOOMURL}/reservation`)) {
            handlePaymentComplete(navState.url);
          }
        }}
        onShouldStartLoadWithRequest={(navState) => {
          return onShouldStartLoadWithRequest(navState);
        }}
        onError={(error) => {
          if (error.nativeEvent.code === -1003) {
            Alert.alert(
              "안내",
              "결제 과정에서 문제가 발생했습니다. 다시 시도해 주시기 바랍니다."
            );
            navigation.goBack();
          }
        }}
      />
    </SafeArea>
  );
}

const EditButton = styled.Pressable``;
