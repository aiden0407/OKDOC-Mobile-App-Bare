//React
import styled from 'styled-components/native';

//Components
import { SafeArea } from 'components/Layout';

//Assets
import userNoticeImage from 'assets/images/user_notice.png';

export default function UserNoticeScreen({ route }) {

  return (
    <SafeArea>
      <Image source={userNoticeImage} />
    </SafeArea>
  );
}

export const Image = styled.Image`
  width: 100%;
  height: 80%;
`;