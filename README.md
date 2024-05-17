# OKDOC

[OKDOC](https://okdoc.app/)은 재외국민을 위한 대학병원 전문의 원격진료 서비스입니다.

[포트폴리오 바로가기](https://www.notion.so/aiden0407/OK-DOC-98512b4dc1af4fa180e26b2edada7e6a?pvs=4)

## OKDOC-Mobile-App

재외국민이 국내 대학병원 전문의에게 원격진료를 받을 수 있는 서비스를 제공하는 어플리케이션입니다. Expo-cli 기반 React Native 프로젝트에서 인앱결제 모듈([react-native-iap](https://react-native-iap.dooboolab.com/docs/get-started/))를 사용하기 위해 expo prebuild 명령어를 통해 bare workflow로 전환하였습니다.

## OKDOC-Mobile-App 실행 명령어

#### dependencies 다운로드 및 ios 외부 라이브러리 종속성 설치

```
yarn install
cd ios && pod install

// /ios에 main.jsbundle 파일 미존재 시
yarn react-native bundle --entry-file='index.js' --bundle-output='./ios/main.jsbundle' --dev=false --platform='ios' 
```

#### ios 및 android 실행

```
yarn ios
yarn android
```

#### android 프로덕션 app-release.aab 파일 빌드

```
cd android && ./gradlew bundleRelease
```
