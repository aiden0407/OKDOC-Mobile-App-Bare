//React
import { useEffect, useContext } from 'react';
import { ApiContext } from 'context/ApiContext';
import { useIsFocused } from '@react-navigation/native';

//Components
import { SafeArea, ContainerCenter } from 'components/Layout';
import NeedLogin from 'components/NeedLogin';

export default function NeedLoginScreen({ navigation, route }) {

  const { state: { accountData } } = useContext(ApiContext);
  const isFocused = useIsFocused();

  if (isFocused) {
    if (accountData.loginToken) {
      navigation.goBack();
    }
  }

  useEffect(() => {
    navigation.setOptions({
      title: route.params?.headerTitle ?? '로그인'
    });
  }, [navigation]);

  return (
    <SafeArea>
      <ContainerCenter>
        <NeedLogin 
          mTop={-80}
          action={() => navigation.navigate('LoginStackNavigation')} 
        />
      </ContainerCenter>
    </SafeArea>
  );
}