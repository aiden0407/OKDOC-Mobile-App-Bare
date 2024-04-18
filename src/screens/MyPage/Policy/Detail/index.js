//Components
import { SafeArea } from 'components/Layout';
import { WebView } from 'react-native-webview';

export default function PolicyDetailScreen({ route }) {

  const contentsText = route.params?.content;

  return (
    <SafeArea>
      <WebView
        source={{ html: contentsText }}
        originWhitelist={['*']}
        scalesPageToFit
        onError={() => {
          navigation.goBack();
        }}
      />
    </SafeArea>
  );
}