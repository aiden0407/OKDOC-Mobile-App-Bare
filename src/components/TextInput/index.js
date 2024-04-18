//Styled Components
import styled from 'styled-components/native';
import { COLOR, TYPOGRAPHY, INPUT_BOX } from 'constants/design'

export const LineInput = styled.TextInput`
  ${(props) => props.mTop && `margin-top: ${props.mTop}px;`}
  ${(props) => props.mRight && `margin-right: ${props.mRight}px;`}
  ${(props) => props.mBottom && `margin-bottom: ${props.mBottom}px;`}
  ${(props) => props.mLeft && `margin-left: ${props.mLeft}px;`}
  width: 100%;
  padding-bottom: 8px;
  border-bottom-width: 1.5px;
  border-color: ${COLOR.GRAY3};
  font-family: 'Pretendard-Regular';
  font-size: ${TYPOGRAPHY.T5.SIZE};
  color: ${(props) => props.editable===false ? COLOR.GRAY0 : '#000000' };
`;

export const BorderInput = styled.TextInput`
  ${(props) => props.mTop && `margin-top: ${props.mTop}px;`}
  ${(props) => props.mRight && `margin-right: ${props.mRight}px;`}
  ${(props) => props.mBottom && `margin-bottom: ${props.mBottom}px;`}
  ${(props) => props.mLeft && `margin-left: ${props.mLeft}px;`}
  width: 100%;
  height: 56px;
  padding: 16px;
  border-width: 1.5px;
  border-color: ${COLOR.GRAY3};
  border-radius: 5px;
  font-family: 'Pretendard-Regular';
  font-size: ${TYPOGRAPHY.T5.SIZE};
`;

function inputBoxBackgroundOptionSelector(large, medium){
  if(large) return `padding: ${INPUT_BOX.LARGE.BACKGROUND_PADDING};`
  if(medium) return `padding: ${INPUT_BOX.MEDIUM.BACKGROUND_PADDING};`
  return `padding: ${INPUT_BOX.DEFAULT.BACKGROUND_PADDING};`
}

function inputBoxTextInputOptionSelector(large, medium){
  if(large) return `padding: ${INPUT_BOX.LARGE.TEXT_INPUT_PADDING}; height: ${INPUT_BOX.LARGE.TEXT_INPUT_HEIGHT};`
  if(medium) return `padding: ${INPUT_BOX.MEDIUM.TEXT_INPUT_PADDING}; height: ${INPUT_BOX.MEDIUM.TEXT_INPUT_HEIGHT};`
  return `height: ${INPUT_BOX.DEFAULT.TEXT_INPUT_HEIGHT};`
}

export function BoxInput({ ...props }) {
  return (
    <TextInputBackground
      mTop={props.mTop}
      editable={props.editable}
      large={props.large}
      medium={props.medium}
    >
      <TextInput {...props} multiline={props.medium || props.large} textAlignVertical="top" ref={props?.propsRef} />
    </TextInputBackground>
  );
}

export const TextInputBackground = styled.View`
  ${(props) => props.mTop && `margin-top: ${props.mTop}px;`}
  ${(props) => props.mRight && `margin-right: ${props.mRight}px;`}
  ${(props) => props.mBottom && `margin-bottom: ${props.mBottom}px;`}
  ${(props) => props.mLeft && `margin-left: ${props.mLeft}px;`}
  ${(props) => inputBoxBackgroundOptionSelector(props.large, props.medium)}
  width: 100%;
  background-color: ${(props) => props.editable===false ? COLOR.GRAY4 : COLOR.GRAY6 };
  border-radius: 5px;
`;

export const TextInput = styled.TextInput`
  ${(props) => inputBoxTextInputOptionSelector(props.large, props.medium)}
  width: 100%;
  font-family: 'Pretendard-Regular';
  font-size: ${TYPOGRAPHY.T6.SIZE};
  color: ${(props) => props.editable===false ? '#333333' : '#000000' };
`;