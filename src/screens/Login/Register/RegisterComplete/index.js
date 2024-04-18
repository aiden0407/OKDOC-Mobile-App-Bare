//React
import { useEffect } from 'react';
import styled from 'styled-components/native';

//Components
import { COLOR } from 'constants/design'
import { SafeArea, Container, ContainerCenter, Row } from 'components/Layout';
import { Text } from 'components/Text';
import { Image } from 'components/Image';
import { SolidButton, OutlineButton } from 'components/Button';

//Assets
import checkIcon from 'assets/icons/circle-check.png';

export default function RegisterCompleteScreen({ navigation }) {

  function handleFillInProfileDetail() {
    navigation.popToTop();
    navigation.goBack();
    navigation.navigate('MyPageStackNavigation', { screen: 'ProfileDetail' });
  }

  function handleNextScreen() {
    navigation.popToTop();
    navigation.goBack();
  }

  return (
    <SafeArea>
      <Container paddingHorizontal={20}>
        <ContainerCenter>

          <Image source={checkIcon} width={70} height={70} />
          <Text T2 bold mTop={18}>환영합니다</Text>
          <Text T3 medium color={COLOR.GRAY1} mTop={6}>회원가입이 완료되었습니다</Text>

          <Text T6 center color={COLOR.GRAY1} mTop={30}>더 빠른 이용을 위해{'\n'}추가 설정을 진행 하시겠습니까?</Text>
          <OutlineButton
            large
            mTop={18}
            text="프로필 정보 등록"
            action={() => handleFillInProfileDetail()}
          />

        </ContainerCenter>

        <SolidButton
          text="OK DOK 시작하기"
          mBottom={20}
          disabled={false}
          action={() => handleNextScreen()}
        />
      </Container>
    </SafeArea>
  );
}