//Styled Components
import styled from 'styled-components/native';
import { TYPOGRAPHY } from 'constants/design';

function fontFamilySelector(bold, medium){
  if(bold) return 'font-family: Pretendard-Bold';    
  if(medium) return 'font-family: Pretendard-Medium';
  return 'font-family: Pretendard-Regular';
}

function fontTypeSelector(T1, T2, T3, T4, T5, T6, T7, T8){
  if(T1) return `font-size: ${TYPOGRAPHY.T1.SIZE}; line-height: ${TYPOGRAPHY.T1.LEADING};`
  if(T2) return `font-size: ${TYPOGRAPHY.T2.SIZE}; line-height: ${TYPOGRAPHY.T2.LEADING};`
  if(T3) return `font-size: ${TYPOGRAPHY.T3.SIZE}; line-height: ${TYPOGRAPHY.T3.LEADING};`
  if(T4) return `font-size: ${TYPOGRAPHY.T4.SIZE}; line-height: ${TYPOGRAPHY.T4.LEADING};`
  if(T5) return `font-size: ${TYPOGRAPHY.T5.SIZE}; line-height: ${TYPOGRAPHY.T5.LEADING};`
  if(T6) return `font-size: ${TYPOGRAPHY.T6.SIZE}; line-height: ${TYPOGRAPHY.T6.LEADING};`
  if(T7) return `font-size: ${TYPOGRAPHY.T7.SIZE}; line-height: ${TYPOGRAPHY.T7.LEADING};`
  if(T8) return `font-size: ${TYPOGRAPHY.T8.SIZE}; line-height: ${TYPOGRAPHY.T8.LEADING};`
}

export const Text = styled.Text`
  ${(props) => fontFamilySelector(props.bold, props.medium)}
  ${(props) => fontTypeSelector(props.T1, props.T2, props.T3, props.T4, props.T5, props.T6, props.T7, props.T8)}
  ${(props) => props.mTop && `margin-top: ${props.mTop}px;`}
  ${(props) => props.mRight && `margin-right: ${props.mRight}px;`}
  ${(props) => props.mBottom && `margin-bottom: ${props.mBottom}px;`}
  ${(props) => props.mLeft && `margin-left: ${props.mLeft}px;`}
  color: ${(props) => props.color ?? '#000000'};
  ${(props) => props.center && 'text-align: center'}
`;