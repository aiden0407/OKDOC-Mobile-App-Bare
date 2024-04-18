//React
import { useState, useEffect, useContext } from "react";
import { AppContext } from "context/AppContext";
import styled from "styled-components/native";

//Components
import { COLOR } from "constants/design";
import { SYMPTOM, DEPARTMENT } from "constants/service";
import { Alert } from "react-native";
import { SafeArea, ContainerTop } from "components/Layout";
import { Text } from "components/Text";
import { Image } from "components/Image";

//Api
import { getSymptoms, getDepartments } from "api/Home";

export default function CategoryScreen({ navigation }) {
  const { dispatch } = useContext(AppContext);
  const [categoryGroup, setCategoryGroup] = useState("subjects");
  const [symptomsData, setSymptomsData] = useState([]);
  const [departmentsData, setdepartmentsData] = useState([]);

  useEffect(() => {
    initCategories();
  }, []);

  const initCategories = async function () {
    try {
      const getSymptomsResponse = await getSymptoms();
      const symptomList = getSymptomsResponse.data.response;
      setSymptomsData(symptomList);

      const getDepartmentsResponse = await getDepartments();
      const departmentList = getDepartmentsResponse.data.response;
      departmentList.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        } else {
          return -1;
        }
      });
      setdepartmentsData(departmentList);
    } catch {
      Alert.alert("네트워크 오류로 인해 정보를 불러오지 못했습니다.");
    }
  };

  function handleNextStep(category, name) {
    let department;
    if (category === "symptom") {
      department = SYMPTOM[name]?.DEPARTMENT;
    } else if (name === "외과") {
      department = DEPARTMENT[name]?.DEPARTMENT;
    } else {
      department = [name];
    }
    dispatch({
      type: "TELEMEDICINE_RESERVATION_DEPARTMENT",
      department: department,
    });
    navigation.navigate("Reservation");
  }

  function Icon({ category, name }) {
    if (name === "중환자외상외과" || name === "이비인후과") {
      return;
    } else {
      return (
        <IconButton
          underlayColor={COLOR.GRAY5}
          onPress={() => handleNextStep(category, name)}
        >
          <>
            {category === "symptom" && (
              <>
                <Image
                  source={SYMPTOM[name]?.ICON}
                  mTop={8}
                  width={60}
                  height={60}
                />
                <Text T6>{name}</Text>
              </>
            )}
            {category === "medicalSubject" && (
              <>
                <Image
                  source={DEPARTMENT[name]?.ICON}
                  mTop={8}
                  width={60}
                  height={60}
                />
                <Text T6>{name}</Text>
              </>
            )}
          </>
        </IconButton>
      );
    }
  }

  return (
    <SafeArea>
      <ContainerTop paddingHorizontal={20} paddingVertical={36}>
        {categoryGroup === "subjects" && (
          <ButtonsArea>
            <SellectedButton>
              <Text T5 bold color={COLOR.MAIN}>
                상담과목
              </Text>
            </SellectedButton>
            <UnsellectedButtonRight
              underlayColor="transparent"
              onPress={() => setCategoryGroup("symptoms")}
            >
              <Text T5 color={COLOR.GRAY1}>
                증상
              </Text>
            </UnsellectedButtonRight>
          </ButtonsArea>
        )}

        {categoryGroup === "symptoms" && (
          <ButtonsArea>
            <UnsellectedButtonLeft
              underlayColor="transparent"
              onPress={() => setCategoryGroup("subjects")}
            >
              <Text T5 color={COLOR.GRAY1}>
                상담과목
              </Text>
            </UnsellectedButtonLeft>
            <SellectedButton>
              <Text T5 bold color={COLOR.MAIN}>
                증상
              </Text>
            </SellectedButton>
          </ButtonsArea>
        )}

        <IconsContainer showsVerticalScrollIndicator={false}>
          <IconsWrapper>
            {categoryGroup === "symptoms" &&
              symptomsData.map((item) => (
                <Icon key={item.name} category="symptom" name={item.name} />
              ))}
            {categoryGroup === "subjects" &&
              departmentsData.map((item) => (
                <Icon
                  key={item.name}
                  category="medicalSubject"
                  name={item.name}
                />
              ))}
          </IconsWrapper>
        </IconsContainer>
      </ContainerTop>
    </SafeArea>
  );
}

const ButtonsArea = styled.View`
  width: 320px;
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

const IconsContainer = styled.ScrollView`
  margin-top: 36px;
  width: 320px;
  flex: 1;
`;

const IconsWrapper = styled.View`
  width: 100%;
  flex-flow: row wrap;
  gap: 10px;
`;

const IconButton = styled.TouchableHighlight`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  background-color: ${COLOR.GRAY6};
  align-items: center;
`;
