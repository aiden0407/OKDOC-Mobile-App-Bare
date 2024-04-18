//React
import { useState, useEffect } from "react";
import styled from "styled-components/native";

//Components
import { POLICY, CONSTANT_POLICY } from "constants/service";
import { Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeArea, ScrollView } from "components/Layout";
import { Text } from "components/Text";

//Api
import { getRegisterTerms } from "api/Login";

export default function PolicyScreen({ navigation }) {
  const [policyList, setPolicyList] = useState([]);

  useEffect(() => {
    initPolicy();
  }, []);

  const initPolicy = async function () {
    try {
      const response = await getRegisterTerms();
      setPolicyList(response.data.response);
    } catch {
      Alert.alert("네트워크 오류로 인해 정보를 불러오지 못했습니다.");
    }
  };

  function handleDetailScreen(content) {
    navigation.navigate("PolicyDetail", {
      content: content,
    });
  }

  function handleUserNotice() {
    navigation.navigate("UserNotice");
  }

  function PolicyButton({ title, content }) {
    return (
      <PolicyBox>
        <PolicyRow onPress={() => handleDetailScreen(content)}>
          <Text T5 medium>
            {title}
          </Text>
          <Ionicons name="chevron-forward" size={20} />
        </PolicyRow>
      </PolicyBox>
    );
  }

  return (
    <SafeArea>
      <ScrollView>
        <Text T3 bold mTop={30} mLeft={20}>
          약관 및 정책
        </Text>
        {policyList.map((item, index) => {
          if (item.level === "required") {
            return (
              <PolicyButton
                key={`policy${index}`}
                title={POLICY[item.type]?.TITLE ?? item.type}
                content={item.html}
              />
            );
          }
        })}
        {policyList.length ? (
          <PolicyBox>
            <PolicyRow
              onPress={() => handleDetailScreen(CONSTANT_POLICY.BUSINESS)}
            >
              <Text T5 medium>
                사업자 정보 확인
              </Text>
              <Ionicons name="chevron-forward" size={20} />
            </PolicyRow>
          </PolicyBox>
        ) : null}
        {policyList.length ? (
          <PolicyBox>
            <PolicyRow onPress={() => handleUserNotice()}>
              <Text T5 medium>
                이용자 고지사항
              </Text>
              <Ionicons name="chevron-forward" size={20} />
            </PolicyRow>
          </PolicyBox>
        ) : null}
      </ScrollView>
    </SafeArea>
  );
}

const PolicyBox = styled.View`
  width: 100%;
  padding: 24px;
  border-bottom-width: 2px;
  border-bottom-color: #f7f8fa;
`;

const PolicyRow = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
