//Styled Components
import styled from 'styled-components/native';
import { COLOR, TYPOGRAPHY, BUTTON } from 'constants/design'

function buttonSizeSelector(large, medium, tiny){
  if(large) return `width: ${BUTTON.LARGE.WIDTH}; height: ${BUTTON.LARGE.HEIGHT}; border-radius: ${BUTTON.LARGE.BORDER_RADIUS};`
  if(medium) return `width: ${BUTTON.MEDIUM.WIDTH}; height: ${BUTTON.MEDIUM.HEIGHT}; border-radius: ${BUTTON.MEDIUM.BORDER_RADIUS};`
  if(tiny) return `width: ${BUTTON.TINY.WIDTH}; height: ${BUTTON.TINY.HEIGHT}; border-radius: ${BUTTON.TINY.BORDER_RADIUS};`
  return `width: ${BUTTON.FULL.WIDTH}; height: ${BUTTON.FULL.HEIGHT}; border-radius: ${BUTTON.FULL.BORDER_RADIUS};`
}

function textSizeSelector(large, medium, tiny, double){
  if(large || medium || double) return `font-size: ${TYPOGRAPHY.T5.SIZE}; line-height: ${TYPOGRAPHY.T5.LEADING}; font-family: Pretendard-Medium;`
  if(tiny) return `font-size: ${TYPOGRAPHY.T6.SIZE}; line-height: ${TYPOGRAPHY.T6.LEADING}; font-family: Pretendard-Bold;`
  return `font-size: ${TYPOGRAPHY.T5.SIZE}; line-height: ${TYPOGRAPHY.T5.LEADING}; font-family: Pretendard-Medium;`
}

export function SolidButton({ text, action, mTop, mBottom, large, medium, tiny, double, disabled }) {
  return (
    <SolidButtonBackground
      disabled={disabled}
      large={large}
      medium={medium}
      tiny={tiny}
      double={double}
      mTop={mTop}
      mBottom={mBottom}
      underlayColor={!disabled && COLOR.SUB1}
      onPress={action}
    >
      <SolidButtonText disabled={disabled} large={large} medium={medium} tiny={tiny} double={double}>{text}</SolidButtonText>
    </SolidButtonBackground>
  );
}

const SolidButtonBackground = styled.TouchableHighlight`
  ${(props) => buttonSizeSelector(props.large, props.medium, props.tiny)}
  ${(props) => props.mTop && `margin-top: ${props.mTop}px;`}
  ${(props) => props.mRight && `margin-right: ${props.mRight}px;`}
  ${(props) => props.mBottom && `margin-bottom: ${props.mBottom}px;`}
  ${(props) => props.mLeft && `margin-left: ${props.mLeft}px;`}
  background-color: ${(props) => props.disabled ? COLOR.GRAY4 : COLOR.MAIN};
  align-items: center;
  justify-content: center;
`;

const SolidButtonText = styled.Text`
  ${(props) => textSizeSelector(props.large, props.medium, props.tiny, props.double)}
  color: ${(props) => props.disabled ? COLOR.GRAY2 : '#FFFFFF'};
`;

export function OutlineButton({ text, action, mTop, mBottom, large, medium, tiny, double, disabled }) {
  return (
    <OutlineButtonBackground
      disabled={disabled}
      large={large}
      medium={medium}
      tiny={tiny}
      double={double}
      mTop={mTop}
      mBottom={mBottom}
      underlayColor={!disabled && COLOR.SUB4}
      onPress={action}
    >
      <OutlineButtonText disabled={disabled} large={large} medium={medium} tiny={tiny} double={double}>{text}</OutlineButtonText>
    </OutlineButtonBackground>
  );
}

const OutlineButtonBackground = styled.TouchableHighlight`
  ${(props) => buttonSizeSelector(props.large, props.medium, props.tiny)}
  ${(props) => props.mTop && `margin-top: ${props.mTop}px;`}
  ${(props) => props.mRight && `margin-right: ${props.mRight}px;`}
  ${(props) => props.mBottom && `margin-bottom: ${props.mBottom}px;`}
  ${(props) => props.mLeft && `margin-left: ${props.mLeft}px;`}
  border-width: 1.5px;
  border-color: ${(props) => props.disabled ? COLOR.GRAY3 : COLOR.MAIN};
  background-color: #FFFFFF;
  align-items: center;
  justify-content: center;
`;

const OutlineButtonText = styled.Text`
  ${(props) => textSizeSelector(props.large, props.medium, props.tiny, props.double)}
  color: ${(props) => props.disabled ? COLOR.GRAY2 : COLOR.MAIN};
`;

export function SubColorButton({ text, action, mTop, mBottom, large, medium, tiny, double, disabled }) {
  return (
    <SubColorButtonBackground
      disabled={disabled}
      large={large}
      medium={medium}
      tiny={tiny}
      double={double}
      mTop={mTop}
      mBottom={mBottom}
      underlayColor={!disabled && COLOR.SUB2}
      onPress={action}
    >
      <SubColorButtonText disabled={disabled} large={large} medium={medium} tiny={tiny} double={double}>{text}</SubColorButtonText>
    </SubColorButtonBackground>
  );
}

const SubColorButtonBackground = styled.TouchableHighlight`
  ${(props) => buttonSizeSelector(props.large, props.medium, props.tiny)}
  ${(props) => props.mTop && `margin-top: ${props.mTop}px;`}
  ${(props) => props.mRight && `margin-right: ${props.mRight}px;`}
  ${(props) => props.mBottom && `margin-bottom: ${props.mBottom}px;`}
  ${(props) => props.mLeft && `margin-left: ${props.mLeft}px;`}
  background-color: ${(props) => props.disabled ? COLOR.GRAY6 : COLOR.SUB3};
  align-items: center;
  justify-content: center;
`;

const SubColorButtonText = styled.Text`
  ${(props) => textSizeSelector(props.large, props.medium, props.tiny, props.double)}
  color: ${(props) => props.disabled ? COLOR.GRAY2 : COLOR.MAIN};
`;