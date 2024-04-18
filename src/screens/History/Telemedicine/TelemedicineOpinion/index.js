//React
import { useEffect, useState } from 'react';
import styled from 'styled-components/native';

//Components
import { SafeArea, ContainerCenter } from 'components/Layout';
import { View, StyleSheet, Button, Platform, Text } from 'react-native';
import NavigationBackArrow from 'components/NavigationBackArrow';

//Expo Print
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

export default function TelemedicineOpinion({ navigation, route }) {

  const telemedicineData = route.params.telemedicineData;

  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      </head>
      <body style="text-align: center;">
        <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
          Hello Expo!
        </h1>
        <img
          src="https://d30j33t1r58ioz.cloudfront.net/static/guides/sdk.png"
          style="width: 90vw;" />
      </body>
    </html>
  `;

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <NavigationBackArrow action={() => navigation.navigate('TelemedicineDetail', { telemedicineData: telemedicineData })} />,
    });
  }, [navigation]);

  const [selectedPrinter, setSelectedPrinter] = useState();

  const print = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html,
      printerUrl: selectedPrinter?.url, // iOS only
    });
  };

  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html });
    console.log('File has been saved to:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  };

  return (
    <SafeArea>
      <ContainerCenter>
        {/* <Text T5 bold>전자 소견서 pdf</Text> */}
        <View>
          <Button title="Print" onPress={print} />
          <View />
          <Button title="Print to PDF file" onPress={printToFile} />
          {Platform.OS === 'ios' && (
            <>
              <View />
              <Button title="Select printer" onPress={selectPrinter} />
              <View />
              {selectedPrinter ? (
                <Text >{`Selected printer: ${selectedPrinter.name}`}</Text>
              ) : undefined}
            </>
          )}
        </View>
      </ContainerCenter>
    </SafeArea>
  );
}