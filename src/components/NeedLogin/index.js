//Components
import styled from 'styled-components/native';
import { COLOR } from 'constants/design'
import { Text } from 'components/Text';
import { Image } from 'components/Image';
import { SolidButton } from 'components/Button';

//Assets
import profileCard from 'assets/icons/mypage-profile.png';

export default function NeedLoginBox({ mTop, action }) {
  return (
    <NeedLoginContainer mTop={mTop}>
      <Image source={profileCard} width={94} height={55} />
      <Text T3 bold mTop={24}>로그인이 필요해요</Text>
      <Text T6 medium center color={COLOR.GRAY1} mTop={12}>해외에서도 비대면으로{'\n'}한국 대학병원 전문의를 만나보세요</Text>
      <SolidButton
        large
        mTop={24}
        text="로그인 / 회원가입"
        action={action}
      />
    </NeedLoginContainer>
  );
}

const NeedLoginContainer = styled.View`
  ${(props) => props.mTop && `margin-top: ${props.mTop}px;`}
  ${(props) => props.mRight && `margin-right: ${props.mRight}px;`}
  ${(props) => props.mBottom && `margin-bottom: ${props.mBottom}px;`}
  ${(props) => props.mLeft && `margin-left: ${props.mLeft}px;`}
  width: 100%;
  padding: 40px 20px;
  border-radius: 10px;
  background-color: #FFFFFF;
  align-items: center;
`;