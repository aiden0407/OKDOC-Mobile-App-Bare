//Navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NeedLoginScreen from 'screens/Login/NeedLogin';

//Components
import NavigationBackArrow from 'components/NavigationBackArrow';

const Stack = createNativeStackNavigator();

export default function NeedLoginNavigation({ navigation }) {

  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{ headerLargeTitleShadowVisible: false }}>
        <Stack.Screen
          name="NeedLogin"
          component={NeedLoginScreen}
          options={{
            headerLeft: () => <NavigationBackArrow action={() => navigation.goBack()} />,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}