//React
import { useContext } from 'react';
import { AppContext } from 'context/AppContext';
import styled from 'styled-components/native';

//Components
import { COLOR } from 'constants/design'
import { SafeArea, Container, ContainerCenter } from 'components/Layout';
import { Text } from 'components/Text';
import { Image } from 'components/Image';
import { SolidButton, } from 'components/Button';

//Assets
import exclamationIcon from 'assets/icons/circle-exclamation.png';

export default function NeedPaymentScreen({ navigation, route }) {

  const { state: { needPaymentData } } = useContext(AppContext);

  function handleInvoicePaymnt() {
    navigation.navigate('NeedPaymentDetail', { telemedicineData: needPaymentData });
  }

  function handleOpenChannelTalk() {
    navigation.navigate('InquiryStackNavigation', {
      screen: 'Inquiry',
      params: { headerTitle: '추가 결제 문의' },
    });
  }

  return (
    <SafeArea>
      <ContainerCenter paddingHorizontal={20}>
        <ContainerCenter>
          <Image source={exclamationIcon} width={70} height={70} />
          <Text T2 bold mTop={18}>결제되지 않은 항목이 있어요</Text>
          <Text T5 center color={COLOR.GRAY1} mTop={18}>추가 결제를 진행 후{`\n`}서비스를 정상적으로 이용할 수 있어요</Text>
        </ContainerCenter>

        <FindEmailPasswordContainer onPress={() => handleOpenChannelTalk()}>
          <Text T6 medium color={COLOR.GRAY2}>추가 결제와 관련하여 문의하실 부분이 있나요?</Text>
        </FindEmailPasswordContainer>

        <SolidButton
          text="상담내역 확인하기"
          mBottom={20}
          disabled={false}
          action={() => handleInvoicePaymnt()}
        />
      </ContainerCenter>
    </SafeArea>
  );
}

const FindEmailPasswordContainer = styled.TouchableOpacity`
  margin-bottom: 20px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${COLOR.GRAY3};
`;