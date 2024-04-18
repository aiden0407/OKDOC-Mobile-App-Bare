//Navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InquiryScreen from 'screens/MyPage/Inquiry';

//Components
import NavigationBackArrow from 'components/NavigationBackArrow';

const Stack = createNativeStackNavigator();

export default function InquiryNavigation({ navigation }) {

  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{ headerLargeTitleShadowVisible: false }}>
        <Stack.Screen
          name="Inquiry"
          component={InquiryScreen}
          options={{
            title: "문의하기",
            headerLeft: () => <NavigationBackArrow action={() => navigation.goBack()} />,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}