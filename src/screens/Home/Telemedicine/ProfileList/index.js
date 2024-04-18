//React
import { useState, useContext } from 'react';
import { AppContext } from 'context/AppContext';
import { ApiContext } from 'context/ApiContext';
import styled from 'styled-components/native';

//Components
import { COLOR } from 'constants/design';
import { SafeArea, Container, Row } from 'components/Layout';
import { Text } from 'components/Text';
import { Image } from 'components/Image';
import { SolidButton } from 'components/Button';

//Assets
import profileDefault from 'assets/icons/profile-default.png';
import profileSelected from 'assets/icons/profile-selected.png';

export default function ProfileListScreen({ navigation, route }) {

  const { dispatch } = useContext(AppContext);
  const { state: { profileData } } = useContext(ApiContext);
  const [profileIndex, setProfileIndex] = useState(null);

  function Profile({ name, relationship, isSelected, action }) {
    return (
      <ProfileButton
        isSelected={isSelected}
        onPress={action}
      >
        <>
          <Image source={isSelected ? profileSelected : profileDefault} width={40} height={40} />
          <Text T5 bold mTop={8} color={isSelected ? '#FFFFFF' : COLOR.GRAY1}>{name}</Text>
          <Text T7 medium color={isSelected ? '#FFFFFF' : COLOR.GRAY2}>{relationship}</Text>
        </>
      </ProfileButton>
    )
  }

  function handleSelectProfile(profileIndex) {
    if (profileIndex === 0) {
      dispatch({ type: 'TELEMEDICINE_RESERVATION_PROFILE', profileType: 'my', profileInfo: profileData[0] });
      navigation.navigate('ProfileDetail');
    } else {
      dispatch({ type: 'TELEMEDICINE_RESERVATION_PROFILE', profileType: 'else' });
      navigation.navigate('ProfileDetail');
    }
  }

  return (
    <SafeArea>
      <Container paddingHorizontal={20}>
        <Container>
          <Text T3 bold mTop={30}>상담 받을 분을 선택해 주세요</Text>
          <Row mTop={42} gap={10}>
            <Profile
              name={profileData[0].name}
              relationship={profileData[0].relationship}
              isSelected={profileIndex === 0}
              action={() => setProfileIndex(0)}
            />
            <Profile
              name='기타'
              relationship='가족 / 지인'
              isSelected={profileIndex === 1}
              action={() => setProfileIndex(1)}
            />
          </Row>
        </Container>

        <SolidButton
          mBottom={20}
          disabled={profileIndex === null}
          text="다음"
          action={() => handleSelectProfile(profileIndex)}
        />
      </Container>
    </SafeArea>
  );
}

const ProfileButton = styled.Pressable`
  width: 100px;
  height: 116px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.isSelected ? COLOR.MAIN : COLOR.GRAY6};
`;