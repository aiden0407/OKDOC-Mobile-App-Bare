//React
import { useState } from 'react';
import { AppContext } from 'context/AppContext';
import styled from 'styled-components/native';

//Components
import { COLOR } from 'constants/design'
import { SafeArea, Container, Row, Center } from 'components/Layout';
import { Text } from 'components/Text';
import { Image } from 'components/Image';
import { SolidButton } from 'components/Button';

//Assets
import passportIcon from 'assets/icons/register-passport.png';
import phoneIcon from 'assets/icons/register-phone.png';

export default function PassportPhoneCertifiactionScreen({ navigation }) {

  const [allPolicyAgreement, setAllPolicyAgreement] = useState('');

  function handleNextScreen() {
    if(allPolicyAgreement==='PASSPORT'){
      navigation.navigate('PassportInformation');
    } else {
      navigation.navigate('PhoneInformation');
    }
  }

  return (
    <SafeArea>
      <Container paddingHorizontal={20}>
        <Container>
          <Text T3 bold mTop={30}>오케이닥 서비스 이용을 위해{'\n'}본인 인증을 진행해 주세요</Text>
          <Text T6 color={COLOR.GRAY1} mTop={12}>재외국민이신 경우, 여권인증이 더 수월해요</Text>

          <Center mTop={72}>
            <Row gap={20}>
              <CertificationBox isSelected={allPolicyAgreement==='PASSPORT'} onPress={() => setAllPolicyAgreement('PASSPORT')}>
                <Image source={passportIcon} width={60} height={60} />
                <Text T6 medium mTop={14}>여권 인증</Text>
              </CertificationBox>
              <CertificationBox isSelected={allPolicyAgreement==='PHONE'} onPress={() => setAllPolicyAgreement('PHONE')}>
                <Image source={phoneIcon} width={60} height={60} />
                <Text T6 medium mTop={12}>휴대폰 인증</Text>
              </CertificationBox>
            </Row>
          </Center>

        </Container>

        <SolidButton
          text="다음"
          mBottom={20}
          disabled={!allPolicyAgreement}
          action={() => handleNextScreen()}
        />
      </Container>
    </SafeArea>
  );
}

const CertificationBox = styled.Pressable`
  width: 140px;
  height: 140px;
  border-width: 1.5px;
  border-radius: 5px;
  border-color: ${(props) => props.isSelected ? COLOR.MAIN : COLOR.GRAY3 };
  align-items: center;
  justify-content: center;
`;