//React
import { useState, useContext } from "react";
import { AppContext } from "context/AppContext";
import styled from "styled-components/native";

//Components
import { COLOR } from "constants/design";
import { Ionicons } from "@expo/vector-icons";
import { Alert } from "react-native";
import { SafeArea, KeyboardAvoiding, Row, Container } from "components/Layout";
import { Text } from "components/Text";
import { Image } from "components/Image";
import { BoxInput } from "components/TextInput";
import { SolidButton } from "components/Button";
import * as ImagePicker from "expo-image-picker";

//Assets
import addImageIcon from "assets/icons/add-image.png";
import circleClose from "assets/icons/circle-close.png";

export default function SymptomDetailScreen({ navigation }) {
  const {
    state: { telemedicineReservationStatus },
    dispatch,
  } = useContext(AppContext);
  const [symptom, setSymptom] = useState(
    telemedicineReservationStatus?.symptom
  );
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  const pickImage1 = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.2,
      });

      if (!result.canceled) {
        if (result.assets[0].fileSize < 5 * 1024 * 1024) {
          setImage1(result.assets[0].uri);
        } else {
          Alert.alert("안내", "10MB 이내의 이미지 파일만 첨부가 가능합니다.");
        }
      }
    } catch {
      Alert.alert("오류", "이미지를 가져오는데 실패했습니다.");
    }
  };

  const pickImage2 = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        if (result.assets[0].fileSize < 5 * 1024 * 1024) {
          setImage2(result.assets[0].uri);
        } else {
          Alert.alert("안내", "10MB 이내의 이미지 파일만 첨부가 가능합니다.");
        }
      }
    } catch {
      Alert.alert("오류", "이미지를 가져오는데 실패했습니다.");
    }
  };

  function handleSubmitSymptomDetail() {
    const images = [];
    if (image1) {
      images.push(image1);
    }
    if (image2) {
      images.push(image2);
    }

    dispatch({
      type: "TELEMEDICINE_RESERVATION_SYMPTOM",
      symptom: symptom,
      images: images,
    });
    navigation.navigate("PaymentNotification");
  }

  return (
    <SafeArea>
      <KeyboardAvoiding>
        <Container paddingHorizontal={20}>
          <Container>
            <Text T3 bold mTop={30}>
              증상을 설명해주세요
            </Text>
            <BoxInput
              large
              mTop={12}
              placeholder="상담받고자 하는 증상을 서술해 주세요."
              value={symptom}
              onChangeText={setSymptom}
            />
            <Row mTop={30}>
              <Text T3 bold>
                파일을 첨부해주세요
              </Text>
              <Text T3 bold color={COLOR.GRAY2} mLeft={2}>
                (선택)
              </Text>
            </Row>
            <Text T6 medium color={COLOR.GRAY1} mTop={6}>
              증상과 관련된 이미지, 파일을 첨부해주세요
            </Text>

            <IconContainer>
              <IconColumn>
                {image1 && (
                  <CancelButton onPress={() => setImage1(null)}>
                    <Image
                      source={circleClose}
                      width={20}
                      height={20}
                      zIndex={2}
                    />
                  </CancelButton>
                )}
                <IconButton onPress={pickImage1}>
                  {image1 ? (
                    <Image
                      source={{ uri: image1 }}
                      width={85}
                      height={80}
                      borderRadius={8}
                    />
                  ) : (
                    <Image
                      source={addImageIcon}
                      width={44}
                      height={44}
                      mLeft={4}
                      mBottom={4}
                    />
                  )}
                </IconButton>
                <Text T7 medium color={COLOR.GRAY1}>
                  첨부사진 (1)
                </Text>
              </IconColumn>
              <IconColumn>
                {image2 && (
                  <CancelButton onPress={() => setImage2(null)}>
                    <Image
                      source={circleClose}
                      width={20}
                      height={20}
                      zIndex={2}
                    />
                  </CancelButton>
                )}
                <IconButton onPress={pickImage2}>
                  {image2 ? (
                    <Image
                      source={{ uri: image2 }}
                      width={85}
                      height={80}
                      borderRadius={8}
                    />
                  ) : (
                    <Image
                      source={addImageIcon}
                      width={44}
                      height={44}
                      mLeft={4}
                      mBottom={4}
                    />
                  )}
                </IconButton>
                <Text T7 medium color={COLOR.GRAY1}>
                  첨부사진 (2)
                </Text>
              </IconColumn>
            </IconContainer>

            <Row mTop={24} align>
              <Ionicons
                name="alert-circle-outline"
                size={14}
                color={COLOR.GRAY2}
              />
              <Text T8 color={COLOR.GRAY0} mBottom={1} mLeft={2}>
                10MB 이내 이미지 파일(jpg, png) 2개까지 첨부가 가능합니다.
              </Text>
            </Row>
          </Container>

          <SolidButton
            text="다음"
            mBottom={20}
            disabled={!symptom}
            action={() => handleSubmitSymptomDetail()}
          />
        </Container>
      </KeyboardAvoiding>
    </SafeArea>
  );
}

const IconContainer = styled.View`
  margin-top: 24px;
  width: 100%;
  flex-direction: row;
  gap: 24px;
`;

const IconButton = styled.Pressable`
  width: 85px;
  height: 80px;
  border-width: 1px;
  border-color: ${COLOR.GRAY3};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;

const IconColumn = styled.View`
  gap: 6px;
  align-items: center;
  position: relative;
`;

const CancelButton = styled.Pressable`
  width: 20px;
  height: 20px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -8px;
  right: -8px;
  z-index: 1;
`;
