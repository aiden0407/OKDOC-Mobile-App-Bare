//React
import { useContext } from 'react';
import { AppContext } from 'context/AppContext';

//Navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SNSLoginScreen from 'screens/Login/SNSLogin.js';
import LocalLoginScreen from 'screens/Login/LocalLogin.js';
import FindEmailPasswordScreen from 'screens/Login/FindEmailPassword';
import RegisterPolicyScreen from 'screens/Login/Register/RegisterPolicy';
import RegisterPolicyDetailScreen from 'screens/Login/Register/RegisterPolicy/Detail';
import EmailPasswordScreen from 'screens/Login/Register/EmailPassword';
import AppleEmailScreen from 'screens/Login/Register/AppleEmail';
// import PassportPassCertifiactionScreen from 'screens/Login/Register/PassportPassCertifiaction';
// import PassportInformationScreen from 'screens/Login/Register/PassportInformation';
// import PassInformationScreen from 'screens/Login/Register/PassInformation';
import BirthInformationScreen from 'screens/Login/Register/BirthInformation';
import DuplicatedProfileScreen from 'screens/Login/Register/DuplicatedProfile';
import RegisterCompleteScreen from 'screens/Login/Register/RegisterComplete';

//Components
import NavigationBackArrow from 'components/NavigationBackArrow';

const Stack = createNativeStackNavigator();

export default function LoginStackNavigation({ navigation }) {

  const { state: { registerStatus } } = useContext(AppContext);

  function handleRegisterPolicyBack() {
    if(registerStatus.route === 'LOCAL_REGISTER'){
      navigation.navigate('LocalLogin');
    } else {
      navigation.navigate('Login');
    }
  }

  function handlePassportPassCertifiactionBack() {
    if(registerStatus.route === 'APPLE_EMAIL_EXISTENT' || registerStatus.route === 'GOOGLE_REGISTER'){
      navigation.navigate('RegisterPolicy');
    }
    if(registerStatus.route === 'APPLE_EMAIL_UNDEFINED'){
      navigation.navigate('AppleEmail');
    }
    if(registerStatus.route === 'LOCAL_REGISTER'){
      navigation.navigate('EmailPassword');
    }
  }

  return (
    <Stack.Navigator initialRouteName="Login" >
      <Stack.Group screenOptions={{ headerLargeTitleShadowVisible: false }}>
        <Stack.Screen
          name="Login"
          component={SNSLoginScreen}
          options={{
            title: '로그인',
            headerLeft: () => <NavigationBackArrow action={()=>navigation.goBack()} />,
          }}
        />
        <Stack.Screen
          name="LocalLogin"
          component={LocalLoginScreen}
          options={{
            title: '로그인',
            headerLeft: () => <NavigationBackArrow action={()=>navigation.navigate('Login')} />,
          }}
        />
        <Stack.Screen
          name="FindEmailPassword"
          component={FindEmailPasswordScreen}
          options={{
            title: '이메일 / 비밀번호 찾기 문의',
            headerLeft: () => <NavigationBackArrow action={()=>navigation.navigate('Login')} />,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="RegisterPolicy"
          component={RegisterPolicyScreen}
          options={{
            title: '회원가입',
            headerLeft: () => <NavigationBackArrow action={()=>handleRegisterPolicyBack()} />,
          }}
        />
        <Stack.Screen
          name="RegisterPolicyDetail"
          component={RegisterPolicyDetailScreen}
          options={{
            title: '회원가입',
            headerLeft: () => <NavigationBackArrow action={()=>navigation.navigate('RegisterPolicy')} />,
          }}
        />
        <Stack.Screen
          name="EmailPassword"
          component={EmailPasswordScreen}
          options={{
            title: '회원가입',
            headerLeft: () => <NavigationBackArrow action={()=>navigation.navigate('RegisterPolicy')} />,
          }}
        />
        <Stack.Screen
          name="AppleEmail"
          component={AppleEmailScreen}
          options={{
            title: '회원가입',
            headerLeft: () => <NavigationBackArrow action={()=>navigation.navigate('RegisterPolicy')} />,
          }}
        />
        {/* <Stack.Screen
          name="PassportPassCertifiaction"
          component={PassportPassCertifiactionScreen}
          options={{
            title: '회원가입',
            headerLeft: () => <NavigationBackArrow action={()=>handlePassportPassCertifiactionBack()} />,
          }}
        /> */}
        {/* <Stack.Screen
          name="PassportInformation"
          component={PassportInformationScreen}
          options={{
            title: '회원가입',
            headerLeft: () => <NavigationBackArrow action={()=>handlePassportPassCertifiactionBack()} />,
          }}
        /> */}
        {/* <Stack.Screen
          name="PassInformation"
          component={PassInformationScreen}
          options={{
            title: '회원가입',
            headerLeft: () => <NavigationBackArrow action={()=>navigation.navigate('PassportPassCertifiaction')} />,
          }}
        /> */}
        <Stack.Screen
          name="BirthInformation"
          component={BirthInformationScreen}
          options={{
            title: '회원가입',
            headerLeft: () => <NavigationBackArrow action={()=>handlePassportPassCertifiactionBack()} />,
          }}
        />
        <Stack.Screen
          name="DuplicatedProfile"
          component={DuplicatedProfileScreen}
          options={{
            headerShown: false,
            gestureEnabled: false
          }}
        />
        <Stack.Screen
          name="RegisterComplete"
          component={RegisterCompleteScreen}
          options={{
            headerShown: false,
            gestureEnabled: false
          }}
        />
      </Stack.Group>

      

    </Stack.Navigator>
  );
}