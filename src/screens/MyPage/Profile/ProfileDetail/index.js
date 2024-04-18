//React
import { useState, useEffect, useContext, useRef } from "react";
import { ApiContext } from "context/ApiContext";
import styled from "styled-components/native";

//Components
import { COLOR } from "constants/design";
import { Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeArea,
  KeyboardAvoiding,
  Container,
  ScrollView,
  Row,
  Box,
} from "components/Layout";
import { Text } from "components/Text";
import { LineInput, BoxInput } from "components/TextInput";
import { SolidButton } from "components/Button";
import Toast from "react-native-root-toast";

//Api
import { modifyPatientInformation } from "api/MyPage";

export default function ProfileDetailScreen({ navigation }) {
  const {
    state: { accountData, profileData },
    dispatch,
  } = useContext(ApiContext);
  const mainProfile = profileData?.[0];
  const [informationCategory, setInformationCategory] =
    useState("personalInfo");
  const [isEditable, setIsEditable] = useState(false);
  const [height, setHeight] = useState(mainProfile?.height?.toString());
  const [weight, setWeight] = useState(mainProfile?.weight?.toString());
  const [drinker, setDrinker] = useState(mainProfile?.drinker);
  const [smoker, setSmoker] = useState(mainProfile?.smoker);
  const [medicalHistory, setMedicalHistory] = useState(
    mainProfile?.medicalHistory === " " ? "" : mainProfile?.medicalHistory
  );
  const [medicalHistoryFamily, setMedicalHistoryFamily] = useState(
    mainProfile?.medicalHistoryFamily === " "
      ? ""
      : mainProfile?.medicalHistoryFamily
  );
  const [medication, setMedication] = useState(
    mainProfile?.medication === " " ? "" : mainProfile?.medication
  );
  const [allergicReaction, setAllergicReaction] = useState(
    mainProfile?.allergicReaction === " " ? "" : mainProfile?.allergicReaction
  );
  const [etcConsideration, setEtcConsideration] = useState(
    mainProfile?.etcConsideration === " " ? "" : mainProfile?.etcConsideration
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (informationCategory === "healthInfo") {
          if (isEditable) {
            return (
              <EditButton onPress={() => handleModifyPatientInformation()}>
                <Text T6 bold color={COLOR.MAIN}>
                  완료
                </Text>
              </EditButton>
            );
          } else {
            return (
              <EditButton onPress={() => setIsEditable(true)}>
                <Text T6 bold color={COLOR.MAIN}>
                  수정
                </Text>
              </EditButton>
            );
          }
        }
      },
    });
  }, [
    navigation,
    isEditable,
    informationCategory,
    height,
    weight,
    drinker,
    smoker,
    medicalHistory,
    medicalHistoryFamily,
    medication,
    allergicReaction,
    etcConsideration,
  ]);

  const scrollRef = useRef();
  function handleTextInputFocus(value) {
    scrollRef.current?.scrollTo({
      y: value,
      animated: true,
    });
  }

  function formatDate(date) {
    const year = date.toString().slice(0, 4);
    const month = date.toString().slice(4, 6);
    const day = date.toString().slice(6, 8);
    return `${year}-${month}-${day}`;
  }

  const handleModifyPatientInformation = async function () {
    if (!height || !weight || !drinker || !smoker) {
      Alert.alert(
        "프로필 수정",
        "키/몸무게/음주여부/흡연여부 항목은 필수 기입 정보입니다."
      );
      return null;
    }

    try {
      const data = {
        height: height,
        weight: weight,
        drinker: drinker,
        smoker: smoker,
        medical_history: medicalHistory?.length ? medicalHistory : " ",
        family_medical_history: medicalHistoryFamily?.length
          ? medicalHistoryFamily
          : " ",
        medication: medication?.length ? medication : " ",
        allergic_reaction: allergicReaction?.length ? allergicReaction : " ",
        consideration: etcConsideration?.length ? etcConsideration : " ",
      };
      const response = await modifyPatientInformation(
        accountData.loginToken,
        mainProfile.id,
        data
      );
      const modifiedProfile = response.data.response;
      dispatch({
        type: "PROFILE_UPDATE_MAIN",
        id: mainProfile.id,
        name: mainProfile.name,
        relationship: mainProfile.relationship,
        birth: mainProfile.birth,
        gender: mainProfile.gender,
        height: modifiedProfile?.height,
        weight: modifiedProfile?.weight,
        drinker: modifiedProfile?.drinker,
        smoker: modifiedProfile?.smoker,
        medicalHistory: modifiedProfile?.medical_history,
        medicalHistoryFamily: modifiedProfile?.family_medical_history,
        medication: modifiedProfile?.medication,
        allergicReaction: modifiedProfile?.allergic_reaction,
        etcConsideration: modifiedProfile?.consideration,
      });
      setIsEditable(false);
      Toast.show("건강정보가 저장되었습니다", {
        duration: 500,
        position: -50,
      });
    } catch {
      Alert.alert(
        "네트워크 에러",
        "프로필 정보 업데이트에 실패하였습니다. 다시 시도해 주시기 바랍니다."
      );
    }
  };

  function TinySolidButton({ isEditable, isSelected, action, text }) {
    return (
      <TinySolidButtonBackground
        isEditable={isEditable}
        isSelected={isSelected}
        onPress={action}
      >
        <Text
          T6
          medium={!isSelected}
          bold={isSelected}
          color={isSelected ? "#FFFFFF" : COLOR.GRAY2}
        >
          {text}
        </Text>
      </TinySolidButtonBackground>
    );
  }

  return (
    <SafeArea>
      <KeyboardAvoiding>
        <>
          <LinearGradient
            colors={[
              "#FFFFFF",
              "#FFFFFF",
              "#FFFFFF",
              "#FFFFFF",
              "rgba(255,255,255,0)",
            ]}
            style={{
              width: "100%",
              padding: 20,
              paddingBottom: 50,
              position: "absolute",
              zIndex: 1,
              top: 0,
            }}
          >
            <ButtonsArea>
              {informationCategory === "personalInfo" && (
                <>
                  <SellectedButton>
                    <Text T5 bold color={COLOR.MAIN}>
                      개인정보
                    </Text>
                  </SellectedButton>
                  <UnsellectedButtonRight
                    underlayColor="transparent"
                    onPress={() => setInformationCategory("healthInfo")}
                  >
                    <Text T5 color={COLOR.GRAY1}>
                      건강정보
                    </Text>
                  </UnsellectedButtonRight>
                </>
              )}
              {informationCategory === "healthInfo" && (
                <>
                  <UnsellectedButtonLeft
                    underlayColor="transparent"
                    onPress={() =>
                      !isEditable && setInformationCategory("personalInfo")
                    }
                  >
                    <Text T5 color={COLOR.GRAY1}>
                      개인정보
                    </Text>
                  </UnsellectedButtonLeft>
                  <SellectedButton>
                    <Text T5 bold color={COLOR.MAIN}>
                      건강정보
                    </Text>
                  </SellectedButton>
                </>
              )}
            </ButtonsArea>
          </LinearGradient>

          {informationCategory === "personalInfo" && (
            <Container paddingHorizontal={20} paddingTop={80}>
              <Text T6 bold mTop={30}>
                이름
              </Text>
              <LineInput mTop={12} value={mainProfile?.name} editable={false} />
              <Text T6 bold mTop={30}>
                관계
              </Text>
              <LineInput
                mTop={12}
                value={mainProfile?.relationship}
                editable={false}
              />
              <Text T6 bold mTop={30}>
                생년월일
              </Text>
              <LineInput
                mTop={12}
                value={formatDate(mainProfile?.birth)}
                editable={false}
              />
              <Text T6 bold mTop={30}>
                성별
              </Text>
              <Row mTop={12} gap={12}>
                <SolidButton
                  medium
                  text="남성"
                  disabled={mainProfile?.gender !== "MALE"}
                />
                <SolidButton
                  medium
                  text="여성"
                  disabled={mainProfile?.gender !== "FEMALE"}
                />
              </Row>
            </Container>
          )}

          {informationCategory === "healthInfo" && (
            <ScrollView paddingHorizontal={20} paddingTop={80} ref={scrollRef}>
              <Text T6 bold mTop={30}>
                키 & 몸무게
              </Text>
              <Row mTop={12} align>
                <LineInput
                  value={height}
                  onChangeText={setHeight}
                  onBlur={() =>
                    height?.replace(/[^0-9.]/g, "")
                      ? setHeight(
                          parseFloat(height.replace(/[^0-9.]/g, "")).toFixed(1)
                        )
                      : setHeight("")
                  }
                  editable={isEditable}
                  style={{ width: 100 }}
                  placeholder="키"
                  inputMode="decimal"
                />
                <Text T5 medium mLeft={6}>
                  cm
                </Text>
                <LineInput
                  mLeft={30}
                  value={weight}
                  onChangeText={setWeight}
                  onBlur={() =>
                    weight?.replace(/[^0-9.]/g, "")
                      ? setWeight(
                          parseFloat(weight.replace(/[^0-9.]/g, "")).toFixed(1)
                        )
                      : setWeight("")
                  }
                  editable={isEditable}
                  style={{ width: 100 }}
                  placeholder="몸무게"
                  inputMode="decimal"
                />
                <Text T5 medium mLeft={6}>
                  kg
                </Text>
              </Row>
              <Row mTop={30} align>
                <Text T6 bold mRight={12}>
                  음주 여부
                </Text>
                <Ionicons
                  name="alert-circle-outline"
                  size={14}
                  color={COLOR.GRAY2}
                />
                <Text T8 color={COLOR.GRAY0} mBottom={0.5} mLeft={2}>
                  주 2회 미만 '가끔'/ 주 2회 이상 '자주'
                </Text>
              </Row>
              <Row mTop={12} gap={12}>
                <TinySolidButton
                  isEditable={isEditable}
                  isSelected={drinker === "FREQUENTLY"}
                  action={() => isEditable && setDrinker("FREQUENTLY")}
                  text="자주"
                />
                <TinySolidButton
                  isEditable={isEditable}
                  isSelected={drinker === "SOMETIMES"}
                  action={() => isEditable && setDrinker("SOMETIMES")}
                  text="가끔"
                />
                <TinySolidButton
                  isEditable={isEditable}
                  isSelected={drinker === "NONE"}
                  action={() => isEditable && setDrinker("NONE")}
                  text="안함"
                />
              </Row>
              <Text T6 bold mTop={30}>
                흡연 여부
              </Text>
              <Row mTop={12} gap={12}>
                <TinySolidButton
                  isEditable={isEditable}
                  isSelected={smoker === "FREQUENTLY"}
                  action={() => isEditable && setSmoker("FREQUENTLY")}
                  text="흡연"
                />
                <TinySolidButton
                  isEditable={isEditable}
                  isSelected={smoker === "NONE"}
                  action={() => isEditable && setSmoker("NONE")}
                  text="비흡연"
                />
              </Row>
              <Row mTop={30}>
                <Text T6 bold>
                  본인 병력
                </Text>
                <Text T6 medium color={COLOR.GRAY2} mLeft={2}>
                  (선택)
                </Text>
              </Row>
              <BoxInput
                medium
                mTop={12}
                editable={isEditable}
                placeholder="현재 앓고 있는 병이나 과거에 앓았던 질병이 있으면 병명을 입력해 주세요."
                value={medicalHistory}
                onChangeText={setMedicalHistory}
                onFocus={() => handleTextInputFocus(200)}
              />
              <Row mTop={30}>
                <Text T6 bold>
                  가족 병력
                </Text>
                <Text T6 medium color={COLOR.GRAY2} mLeft={2}>
                  (선택)
                </Text>
              </Row>
              <BoxInput
                medium
                mTop={12}
                editable={isEditable}
                placeholder="부모, 형제 등 직계 가족이 앓고 있거나 과거에 앓았던 질병이 있으면 병명을 입력해 주세요."
                value={medicalHistoryFamily}
                onChangeText={setMedicalHistoryFamily}
                onFocus={() => handleTextInputFocus(360)}
              />
              <Row mTop={30}>
                <Text T6 bold>
                  현재 복용중인 약
                </Text>
                <Text T6 medium color={COLOR.GRAY2} mLeft={2}>
                  (선택)
                </Text>
              </Row>
              <BoxInput
                medium
                mTop={12}
                editable={isEditable}
                placeholder="현재 복용중인 약을 입력해 주세요."
                value={medication}
                onChangeText={setMedication}
                onFocus={() => handleTextInputFocus(520)}
              />
              <Row mTop={30}>
                <Text T6 bold>
                  알러지 반응
                </Text>
                <Text T6 medium color={COLOR.GRAY2} mLeft={2}>
                  (선택)
                </Text>
              </Row>
              <BoxInput
                medium
                mTop={12}
                editable={isEditable}
                placeholder="본인에게 알러지를 유발하는 음식이나 환경이 있다면 반응과 함께 입력해 주세요."
                value={allergicReaction}
                onChangeText={setAllergicReaction}
                onFocus={() => handleTextInputFocus(680)}
              />
              <Row mTop={30}>
                <Text T6 bold>
                  기타 사항
                </Text>
                <Text T6 medium color={COLOR.GRAY2} mLeft={2}>
                  (선택)
                </Text>
              </Row>
              <BoxInput
                medium
                mTop={12}
                editable={isEditable}
                placeholder="의사 선생님이 알아야 하는 기타 사항이 있다면 입력해 주세요."
                value={etcConsideration}
                onChangeText={setEtcConsideration}
                onFocus={() => handleTextInputFocus(840)}
              />
              <Box height={200} />
            </ScrollView>
          )}
        </>
      </KeyboardAvoiding>
    </SafeArea>
  );
}

const EditButton = styled.Pressable``;

const ButtonsArea = styled.View`
  width: 100%;
  height: 48px;
  background: ${COLOR.GRAY6};
  border-radius: 40px;
  flex-direction: row;
  align-items: center;
`;

const SellectedButton = styled.View`
  width: 55%;
  height: 48px;
  background: ${COLOR.SUB2};
  border-radius: 40px;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const UnsellectedButtonRight = styled.TouchableHighlight`
  margin-left: -10%;
  width: 55%;
  height: 48px;
  border-radius: 40px;
  align-items: center;
  justify-content: center;
`;

const UnsellectedButtonLeft = styled.TouchableHighlight`
  margin-right: -10%;
  width: 55%;
  height: 48px;
  border-radius: 40px;
  align-items: center;
  justify-content: center;
`;

const TinySolidButtonBackground = styled.Pressable`
  width: 82px;
  height: 36px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.isSelected
      ? COLOR.MAIN
      : props.isEditable
      ? COLOR.GRAY6
      : COLOR.GRAY4};
  border-radius: 25px;
`;
