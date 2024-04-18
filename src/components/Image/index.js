//Styled Components
import styled from 'styled-components/native';

export const Image = styled.Image`
  ${(props) => props.mTop && `margin-top: ${props.mTop}px;`}
  ${(props) => props.mRight && `margin-right: ${props.mRight}px;`}
  ${(props) => props.mBottom && `margin-bottom: ${props.mBottom}px;`}
  ${(props) => props.mLeft && `margin-left: ${props.mLeft}px;`}
  width: ${(props) => `${props.width ?? 0}px`};
  height: ${(props) => `${props.height ?? 0}px`};
  ${(props) => props.circle && `border-radius: 100px`}
`;