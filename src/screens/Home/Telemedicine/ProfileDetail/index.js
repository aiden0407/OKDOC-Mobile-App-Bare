//React
import { useState, useContext, useRef } from "react";
import { ApiContext } from "context/ApiContext";
import { AppContext } from "context/AppContext";
import styled from "styled-components/native";
import { dataDogFrontendError } from "api/DataDog";

//Components
import { COLOR, BUTTON } from "constants/design";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeArea,
  KeyboardAvoiding,
  ScrollView,
  Row,
  DividingLine,
  PaddingContainer,
} from "components/Layout";
import { Text } from "components/Text";
import { LineInput, BoxInput } from "components/TextInput";
import { SolidButton } from "components/Button";

//Api
import { modifyPatientInformation } from "api/MyPage";

export default function ProfileDetailScreen({ navigation }) {
  const {
    state: { accountData, profileData },
    dispatch: apiContextDispatch,
  } = useContext(ApiContext);
  const {
    state: { telemedicineReservationStatus },
    dispatch: appContextDispatch,
  } = useContext(AppContext);
  const mainProfile = profileData?.[0];

  const profileInfo = telemedicineReservationStatus?.profileInfo;
  const [name, setName] = useState(profileInfo?.name);
  const [relationship, setRelationship] = useState(profileInfo?.relationship);
  const [birth, setBirth] = useState(
    profileInfo?.birth && formatDate(profileInfo?.birth)
  );
  const [gender, setGender] = useState(profileInfo?.gender);
  const [height, setHeight] = useState(profileInfo?.height?.toString());
  const [weight, setWeight] = useState(profileInfo?.weight?.toString());
  const [drinker, setDrinker] = useState(profileInfo?.drinker);
  const [smoker, setSmoker] = useState(profileInfo?.smoker);
  const [medicalHistory, setMedicalHistory] = useState(
    profileInfo?.medicalHistory === " " ? "" : profileInfo?.medicalHistory
  );
  const [medicalHistoryFamily, setMedicalHistoryFamily] = useState(
    profileInfo?.medicalHistoryFamily === " "
      ? ""
      : profileInfo?.medicalHistoryFamily
  );
  const [medication, setMedication] = useState(
    profileInfo?.medication === " " ? "" : profileInfo?.medication
  );
  const [allergicReaction, setAllergicReaction] = useState(
    profileInfo?.allergicReaction === " " ? "" : profileInfo?.allergicReaction
  );
  const [etcConsideration, setEtcConsideration] = useState(
    profileInfo?.etcConsideration === " " ? "" : profileInfo?.etcConsideration
  );

  const relationshipRef = useRef();
  const birthRef = useRef();
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

  function TinySolidButton({ isSelected, action, text }) {
    return (
      <TinySolidButtonBackground isSelected={isSelected} onPress={action}>
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

  const handleSubmitProfileDetail = async function () {
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
      apiContextDispatch({
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
      appContextDispatch({
        type: "TELEMEDICINE_RESERVATION_PROFILE",
        profileType: telemedicineReservationStatus.profileType,
        profileInfo: {
          id: mainProfile.id,
          name: name,
          relationship: relationship,
          birth: birth,
          gender: gender,
          height: height,
          weight: weight,
          drinker: drinker,
          smoker: smoker,
          medicalHistory: medicalHistory,
          medicalHistoryFamily: medicalHistoryFamily,
          medication: medication,
          allergicReaction: allergicReaction,
          etcConsideration: etcConsideration,
        },
      });
      navigation.navigate("SymptomDetail");
    } catch (error) {
      dataDogFrontendError(error);
    }
  };

  return (
    <SafeArea>
      <KeyboardAvoiding>
        <ScrollView ref={scrollRef}>
          <PaddingContainer>
            <Text T3 bold mTop={30}>
              {profileInfo?.name
                ? "개인정보를 확인해 주세요"
                : "개인정보를 입력해 주세요"}
            </Text>
            <Text T6 bold mTop={30}>
              이름
            </Text>
            <LineInput
              mTop={12}
              editable={!profileInfo?.name}
              placeholder="이름"
              value={name}
              onChangeText={setName}
              onFocus={() => handleTextInputFocus(0)}
              returnKeyType="next"
              onSubmitEditing={() => {
                relationshipRef.current.focus();
              }}
            />
            <Text T6 bold mTop={30}>
              관계
            </Text>
            <LineInput
              mTop={12}
              editable={!profileInfo?.relationship}
              placeholder="ex) 본인,자녀"
              value={relationship}
              onChangeText={setRelationship}
              onFocus={() => handleTextInputFocus(0)}
              returnKeyType="next"
              onSubmitEditing={() => {
                birthRef.current.focus();
              }}
              ref={relationshipRef}
            />
            <Text T6 bold mTop={30}>
              생년월일
            </Text>
            <LineInput
              mTop={12}
              editable={!profileInfo?.birth}
              placeholder="생년월일 8자리"
              value={birth}
              onChangeText={setBirth}
              onFocus={() => handleTextInputFocus(0)}
              ref={birthRef}
              inputMode="numeric"
            />
            <Text T6 bold mTop={30}>
              성별
            </Text>
            {profileInfo?.gender ? (
              <Row mTop={12} gap={12}>
                <SolidButton medium text="남성" disabled={gender !== "MALE"} />
                <SolidButton
                  medium
                  text="여성"
                  disabled={gender !== "FEMALE"}
                />
              </Row>
            ) : (
              <Row mTop={12} gap={12}>
                <MediumSolidButtonBackground
                  isSelected={gender === "MALE"}
                  onPress={() => setGender("MALE")}
                >
                  <Text
                    T6
                    medium={!gender === "MALE"}
                    bold={gender === "MALE"}
                    color={gender === "MALE" ? "#FFFFFF" : COLOR.GRAY2}
                  >
                    남성
                  </Text>
                </MediumSolidButtonBackground>
                <MediumSolidButtonBackground
                  isSelected={gender === "FEMALE"}
                  onPress={() => setGender("FEMALE")}
                >
                  <Text
                    T6
                    medium={!gender === "FEMALE"}
                    bold={gender === "FEMALE"}
                    color={gender === "FEMALE" ? "#FFFFFF" : COLOR.GRAY2}
                  >
                    여성
                  </Text>
                </MediumSolidButtonBackground>
              </Row>
            )}
          </PaddingContainer>

          <DividingLine marginVertical={42} />

          <PaddingContainer>
            <Text T3 bold>
              건강정보를 입력해 주세요
            </Text>
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
                isSelected={drinker === "FREQUENTLY"}
                action={() => setDrinker("FREQUENTLY")}
                text="자주"
              />
              <TinySolidButton
                isSelected={drinker === "SOMETIMES"}
                action={() => setDrinker("SOMETIMES")}
                text="가끔"
              />
              <TinySolidButton
                isSelected={drinker === "NONE"}
                action={() => setDrinker("NONE")}
                text="안함"
              />
            </Row>
            <Text T6 bold mTop={30}>
              흡연 여부
            </Text>
            <Row mTop={12} gap={12}>
              <TinySolidButton
                isSelected={smoker === "FREQUENTLY"}
                action={() => setSmoker("FREQUENTLY")}
                text="흡연"
              />
              <TinySolidButton
                isSelected={smoker === "NONE"}
                action={() => setSmoker("NONE")}
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
              placeholder="현재 앓고 있는 병이나 과거에 앓았던 질병이 있으면 병명을 입력해 주세요."
              value={medicalHistory}
              onChangeText={setMedicalHistory}
              onFocus={() => handleTextInputFocus(720)}
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
              placeholder="부모, 형제 등 직계 가족이 앓고 있거나 과거에 앓았던 질병이 있으면 병명을 입력해 주세요."
              value={medicalHistoryFamily}
              onChangeText={setMedicalHistoryFamily}
              onFocus={() => handleTextInputFocus(880)}
            />
            <Row mTop={30}>
              <Text T6 bold>
                복용 중인 약
              </Text>
              <Text T6 medium color={COLOR.GRAY2} mLeft={2}>
                (선택)
              </Text>
            </Row>
            <BoxInput
              medium
              mTop={12}
              placeholder="현재 복용 중인 약을 입력해 주세요."
              value={medication}
              onChangeText={setMedication}
              onFocus={() => handleTextInputFocus(1040)}
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
              placeholder="본인에게 알러지를 유발하는 음식이나 환경이 있다면 반응과 함께 입력해 주세요."
              value={allergicReaction}
              onChangeText={setAllergicReaction}
              onFocus={() => handleTextInputFocus(1200)}
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
              placeholder="의사 선생님이 알아야 하는 기타 사항이 있다면 입력해 주세요."
              value={etcConsideration}
              onChangeText={setEtcConsideration}
              onFocus={() => handleTextInputFocus(1360)}
            />
            <SolidButton
              mTop={90}
              mBottom={20}
              text="다음"
              disabled={
                !name ||
                !relationship ||
                !birth ||
                !gender ||
                !height ||
                !weight ||
                !drinker ||
                !smoker
              }
              action={() => handleSubmitProfileDetail()}
            />
          </PaddingContainer>
        </ScrollView>
      </KeyboardAvoiding>
    </SafeArea>
  );
}

const MediumSolidButtonBackground = styled.Pressable`
  width: ${BUTTON.MEDIUM.WIDTH};
  height: ${BUTTON.MEDIUM.HEIGHT};
  border-radius: ${BUTTON.MEDIUM.BORDER_RADIUS};
  background-color: ${(props) => (props.isSelected ? COLOR.MAIN : COLOR.GRAY6)};
  align-items: center;
  justify-content: center;
`;

const TinySolidButtonBackground = styled.Pressable`
  width: ${BUTTON.TINY.WIDTH};
  height: ${BUTTON.TINY.HEIGHT};
  border-radius: ${BUTTON.TINY.BORDER_RADIUS};
  background-color: ${(props) => (props.isSelected ? COLOR.MAIN : COLOR.GRAY6)};
  align-items: center;
  justify-content: center;
`;
