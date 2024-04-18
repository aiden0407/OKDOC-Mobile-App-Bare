//Navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NeedPaymentScreen from 'screens/Home/NeedPayment';
import NeedPaymentDetailScreen from 'screens/Home/NeedPayment/Detail';
import PaymentScreen from 'screens/Home/NeedPayment/Payment';

const Stack = createNativeStackNavigator();

export default function NeedPaymentNavigation({ navigation }) {

  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{ headerLargeTitleShadowVisible: false, gestureEnabled: false }}>
        <Stack.Screen
          name="NeedPayment"
          component={NeedPaymentScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="NeedPaymentDetail"
          component={NeedPaymentDetailScreen}
          options={{
            title: '상담 내역',
            headerBackVisible: false
          }}
        />
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{ 
            title: '',
            headerShown: false,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}