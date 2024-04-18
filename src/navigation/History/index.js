//Navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SymptomDetailCheckScreen from 'screens/History/Telemedicine/SymptomDetailCheck';
import TelemedicineDetailScreen from 'screens/History/Telemedicine/TelemedicineDetail';
import TelemedicineOpinionScreen from 'screens/History/Telemedicine/TelemedicineOpinion';

//Components
import NavigationBackArrow from 'components/NavigationBackArrow';

const Stack = createNativeStackNavigator();

export default function HistoryInnerStackNavigation({ navigation }) {

  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{ headerLargeTitleShadowVisible: false }}>
        <Stack.Screen
          name="SymptomDetailCheck"
          component={SymptomDetailCheckScreen}
          options={{
            title: '상담 전 확인사항',
            headerLeft: () => <NavigationBackArrow action={() => navigation.goBack()} />,
          }}
        />
        <Stack.Screen
          name="TelemedicineDetail"
          component={TelemedicineDetailScreen}
          options={{
            title: '상담 내역',
            headerLeft: () => <NavigationBackArrow action={() => navigation.goBack()} />,
          }}
        />
        <Stack.Screen
          name="TelemedicineOpinion"
          component={TelemedicineOpinionScreen}
          options={{
            title: '전자 소견서',
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}