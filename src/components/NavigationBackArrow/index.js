//Core Components
import * as Device from 'expo-device';
import styled from 'styled-components/native';

//Components
import { Ionicons } from '@expo/vector-icons';

export default function NavigationBackArrow({ action }) {

  return (
    <TouchableIcon onPress={action}>
      <Ionicons name="chevron-back" size={26} />
    </TouchableIcon>
  );
}

const TouchableIcon = styled.TouchableOpacity`
  padding-top: ${Device.osName === 'Android' ? '2px' : '0px'};
`;