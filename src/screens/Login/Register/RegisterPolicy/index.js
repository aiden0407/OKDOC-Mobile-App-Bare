//React
import { useContext, useState, useEffect } from "react";
import { AppContext } from "context/AppContext";
import styled from "styled-components/native";

//Components
import { COLOR } from "constants/design";
import { POLICY } from "constants/service";
import { Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeArea, Container, Row } from "components/Layout";
import { Text } from "components/Text";
import { SolidButton } from "components/Button";

//Api
import { getRegisterTerms } from "api/Login";

export default function RegisterPolicyScreen({ navigation }) {
  const {
    state: { registerStatus },
    dispatch: appContextDispatch,
  } = useContext(AppContext);
  const [policyList, setPolicyList] = useState([]);
  const [allPolicyAgreement, setAllPolicyAgreement] = useState(false);
  const [policy1Agreement, setPolicy1Agreement] = useState(false);
  const [policy2Agreement, setPolicy2Agreement] = useState(false);
  const [policy3Agreement, setPolicy3Agreement] = useState(false);
  const [policy4Agreement, setPolicy4Agreement] = useState(false);
  const [policy5Agreement, setPolicy5Agreement] = useState(false);
  const [policy6Agreement, setPolicy6Agreement] = useState(false);
  const [policy7Agreement, setPolicy7Agreement] = useState(false);
  const [policy8Agreement, setPolicy8Agreement] = useState(false);
  const [meetRequirement, setMeetRequirement] = useState(false);
  const [checkedPolicies, setCheckedPolicies] = useState([]);

  const useStateValues = [
    policy1Agreement,
    policy2Agreement,
    policy3Agreement,
    policy4Agreement,
    policy5Agreement,
    policy6Agreement,
    policy7Agreement,
    policy8Agreement,
  ];
  const setUseStateValues = [
    setPolicy1Agreement,
    setPolicy2Agreement,
    setPolicy3Agreement,
    setPolicy4Agreement,
    setPolicy5Agreement,
    setPolicy6Agreement,
    setPolicy7Agreement,
    setPolicy8Agreement,
  ];

  useEffect(() => {
    initPolicy();
  }, []);

  const initPolicy = async function () {
    try {
      const getRegisterTermsResponse = await getRegisterTerms();
      const sortedPolicyList = getRegisterTermsResponse.data.response;
      sortedPolicyList.push({
        id: "4a387957-7d37-417e-b23e-b158315c6d4b",
        type: "NOTIFICATION_OF_ADS",
      });
      setPolicyList(sortedPolicyList);
    } catch {
      Alert.alert("네트워크 오류로 인해 정보를 불러오지 못했습니다.");
    }
  };

  function handleAgreeAllPolicy() {
    setAllPolicyAgreement(!allPolicyAgreement);
    if (allPolicyAgreement) {
      setPolicy1Agreement(false);
      setPolicy2Agreement(false);
      setPolicy3Agreement(false);
      setPolicy4Agreement(false);
      setPolicy5Agreement(false);
      setPolicy6Agreement(false);
      setPolicy7Agreement(false);
      setPolicy8Agreement(false);
      setMeetRequirement(false);
      setCheckedPolicies([]);
    } else {
      setPolicy1Agreement(true);
      setPolicy2Agreement(true);
      setPolicy3Agreement(true);
      setPolicy4Agreement(true);
      setPolicy5Agreement(true);
      setPolicy6Agreement(true);
      setPolicy7Agreement(true);
      setPolicy8Agreement(true);
      setMeetRequirement(true);
      const checkedList = [];
      for (let ii = 0; ii < policyList.length - 1; ii++) {
        checkedList.push(policyList[ii].id);
      }
      setCheckedPolicies(checkedList);
    }
  }

  function requiredAgreementCheck(index) {
    const checkedList = [];
    for (let ii = 0; ii < policyList.length; ii++) {
      if (ii === index) {
        if (!useStateValues[ii]) {
          checkedList.push(policyList[ii].id);
        }
      } else {
        if (useStateValues[ii]) {
          checkedList.push(policyList[ii].id);
        }
      }
    }
    setCheckedPolicies(checkedList);

    setAllPolicyAgreement(true);
    setMeetRequirement(true);
    for (let ii = 0; ii < policyList.length - 1; ii++) {
      if (policyList[ii].level === "required") {
        if (ii === index) {
          if (useStateValues[ii]) {
            setMeetRequirement(false);
            setAllPolicyAgreement(false);
          }
        } else {
          if (!useStateValues[ii]) {
            setMeetRequirement(false);
            setAllPolicyAgreement(false);
          }
        }
      } else {
        if (ii === index) {
          if (useStateValues[ii]) {
            setAllPolicyAgreement(false);
          }
        } else {
          if (!useStateValues[ii]) {
            setAllPolicyAgreement(false);
          }
        }
      }
    }
  }

  function handleDetailScreen(content) {
    navigation.navigate("RegisterPolicyDetail", {
      content: content,
    });
  }

  function handleNotice1() {
    Alert.alert(
      "오케이닥에서 광고성 정보 알림을 보내고자 합니다.",
      "해당 기기로 이벤트, 할인 혜택 등을 푸시 알림으로 보내드리곘습니다. 앱 푸시에 수신 동의하시겠습니까?",
      [
        {
          text: "허용 안함",
          onPress: () => handleNotice2(),
        },
        {
          text: "허용",
          onPress: () => handleNextScreen(true),
        },
      ]
    );
  }

  function handleNotice2() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    Alert.alert(
      "광고성 정보 수신 거부 처리 결과",
      `${year}년 ${month}월 ${day}일 오케이닥 광고성 정보 수신 거부 처리 완료 되었습니다.`,
      [
        {
          text: "확인",
          onPress: () => handleNextScreen(false),
        },
      ]
    );
  }

  const handleNextScreen = async function (isMarketingAgreed) {
    let checkedList = checkedPolicies;
    checkedList = checkedList.filter(
      (policy) => policy !== policyList[policyList.length - 1].id
    );
    if (isMarketingAgreed) {
      checkedList.push(policyList[policyList.length - 1].id);
    }

    appContextDispatch({
      type: "REGISTER_POLICY",
      policy: checkedList,
    });

    if (
      registerStatus.route === "GOOGLE_REGISTER" ||
      registerStatus.route === "APPLE_EMAIL_EXISTENT"
    ) {
      navigation.navigate("BirthInformation");
    }

    if (registerStatus.route === "APPLE_EMAIL_UNDEFINED") {
      navigation.navigate("AppleEmail");
    }

    if (registerStatus.route === "LOCAL_REGISTER") {
      navigation.navigate("EmailPassword");
    }
  };

  function PolicyButton({ essential, title, content, index }) {
    if (title === "NOTIFICATION_OF_ADS") return;

    return (
      <Row mTop={15} align>
        <AgreeRow
          onPress={() => {
            setUseStateValues[index](!useStateValues[index]);
            requiredAgreementCheck(index);
          }}
          mLeft={3}
          pTop={1}
        >
          <Ionicons
            name="checkmark-sharp"
            size={22}
            color={useStateValues[index] ? COLOR.MAIN : COLOR.GRAY3}
          />
          <Text T6 medium color={COLOR.GRAY0} mLeft={12}>
            {essential ? "[필수] " : "[선택] "}
            {title}
          </Text>
        </AgreeRow>
        <PolicyDetailIconWrapper
          onPress={() => {
            handleDetailScreen(content);
          }}
        >
          <Ionicons name="chevron-forward" size={22} />
        </PolicyDetailIconWrapper>
      </Row>
    );
  }

  return (
    <SafeArea>
      {!policyList.length && (
        <LoadingBackground>
          <ActivityIndicator size="large" color="#5500CC" />
        </LoadingBackground>
      )}

      <Container paddingHorizontal={20}>
        <Container>
          <Text T3 bold mTop={30}>
            아래 약관을{"\n"}꼼꼼히 읽고 동의해 주세요
          </Text>

          <AgreeRow mTop={30} pTop={1} onPress={() => handleAgreeAllPolicy()}>
            <Ionicons
              name="checkbox"
              size={30}
              color={allPolicyAgreement ? COLOR.MAIN : COLOR.GRAY3}
            />
            <Text T4 bold mLeft={6}>
              모든 약관에 동의합니다.
            </Text>
          </AgreeRow>
          {policyList.map((item, index) => (
            <PolicyButton
              key={`policy${index}`}
              essential={item.level === "required"}
              title={POLICY[item.type]?.TITLE ?? item.type}
              content={item.html}
              index={index}
            />
          ))}
        </Container>

        <SolidButton
          text="다음"
          mBottom={20}
          disabled={!meetRequirement}
          action={() => handleNotice1()}
        />
      </Container>
    </SafeArea>
  );
}

const LoadingBackground = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AgreeRow = styled.Pressable`
  ${(props) => props.mTop && `margin-top: ${props.mTop}px;`}
  ${(props) => props.mRight && `margin-right: ${props.mRight}px;`}
  ${(props) => props.mBottom && `margin-bottom: ${props.mBottom}px;`}
  ${(props) => props.mLeft && `margin-left: ${props.mLeft}px;`}
  ${(props) => props.pTop && `padding-top: ${props.pTop}px;`}
  flex-direction: row;
  align-items: center;
`;

const PolicyDetailIconWrapper = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  bottom: -3px;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
`;
