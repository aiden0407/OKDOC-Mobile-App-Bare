//React
import { useState, useEffect, useContext } from 'react';
import { ApiContext } from 'context/ApiContext';
import { AppContext } from 'context/AppContext';
import useAlarmUpdate from 'hook/useAlarmUpdate';
import styled from 'styled-components/native';

//Components
import { COLOR } from 'constants/design';
import { StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeArea, ScrollView, Container, ContainerCenter, Row, DividingLine, Box } from 'components/Layout';
import { Text } from 'components/Text';
import { Image } from 'components/Image';
import NeedLogin from 'components/NeedLogin';

//Assets
import letterIcon from 'assets/icons/mypage-letter.png';

export default function AlarmScreen({ navigation }) {

  const { refreshAlarm } = useAlarmUpdate();
  const { state: { accountData, alarmData } } = useContext(ApiContext);
  const { state: { alarmDataLoading } } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    refreshAlarm();
  };

  useEffect(() => {
    if(alarmDataLoading){
      if(!refreshing){
        setIsLoading(true);
      }
    } else {
      setRefreshing(false);
      setIsLoading(false);
    }
  }, [alarmDataLoading]);

  function handleLogin() {
    navigation.navigate('LoginStackNavigation');
  }

  if (isLoading) {
    return (
      <LoadingBackground>
        <ActivityIndicator size="large" color="#5500CC" />
      </LoadingBackground>
    )
  }

  return (
    <SafeArea>
      {
        accountData.loginToken
          ? (<>
            {alarmData.length
              ? <Container backgroundColor={COLOR.GRAY6} paddingTop={2}>
                <ScrollView
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLOR.MAIN} />
                  }
                >
                  {alarmData?.map((item, index) => {                    
                    if(item?.new){
                      return (
                        <AlarmCard key={`alarmData_${index}`}>
                          <BulletPoint />
                          <Text T6 color={COLOR.GRAY1}>{item.title}</Text>
                          <Text T6 mTop={2}>{item.message}</Text>
                          <Text T7 color={COLOR.GRAY2} mTop={12}>{item.time}</Text>
                        </AlarmCard>
                      )
                    } else {
                      return (
                        <AlarmCard key={`alarmData_${index}`}>
                          <Text T6 color={COLOR.GRAY1}>{item.title}</Text>
                          <Text T6 mTop={2}>{item.message}</Text>
                          <Text T7 color={COLOR.GRAY2} mTop={12}>{item.time}</Text>
                        </AlarmCard>
                      )
                    }
                  })}
                </ScrollView>
              </Container>

              : <AlarmEmptyContainer backgroundColor={COLOR.GRAY6} paddingHorizontal={20}>
                <AlarmEmptyBox>
                  <Image source={letterIcon} width={70} height={74} />
                  <Text T3 bold mTop={24}>알림함이 비어있습니다</Text>
                  <Text T6 medium center color={COLOR.GRAY1} mTop={12}>예약하신 상담과 관련된 안내 사항을{'\n'} 알림으로 보내드립니다</Text>
                </AlarmEmptyBox>
              </AlarmEmptyContainer>
            }
          </>)

          : <ContainerCenter backgroundColor={COLOR.GRAY6} paddingHorizontal={20}>
            <NeedLogin mTop={-40} action={() => handleLogin()} />
          </ContainerCenter>
      }
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const LoadingBackground = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${COLOR.GRAY6};
`;

const AlarmEmptyContainer = styled(Container)`
  justify-content: center;
  align-items: center;
`;

const AlarmEmptyBox = styled.View`
  width: 100%;
  padding: 40px 20px;
  border-radius: 10px;
  background-color: #FFFFFF;
  align-items: center;
`;

const AlarmCard = styled.View`
  position: relative;
  width: 100%;
  padding: 14px 14px 14px 28px;
  background-color: #FFFFFF;
  border-bottom-width: 1px;
  border-bottom-color: ${COLOR.GRAY3};
`;

const BulletPoint = styled.View`
  position: absolute;
  top: 20px;
  left: 10px;
  width: 8px;
  height: 8px;
  border-radius: 50px;
  background-color: ${COLOR.MAIN};
`;