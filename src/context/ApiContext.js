import { createContext, useReducer } from "react";

//initial state
const initialState = {
  accountData: {
    loginToken: false,
    email: undefined,
  },
  profileData: [
    {
      id: undefined,
      name: undefined,
      relationship: undefined,
      birth: undefined,
      gender: undefined,
      height: undefined,
      weight: undefined,
      drinker: undefined,
      smoker: undefined,
      medicalHistory: undefined,
      medicalHistoryFamily: undefined,
      medication: undefined,
      allergicReaction: undefined,
      etcConsideration: undefined,
    },
  ],
  productList: [],
  bookableData: [],
  // bookableData 형식
  // [
  //   ['07/03', '월요일', [
  //     ['11:00', [
  //       {
  //         name: '이준범',
  //         image: 'https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=1200:*',
  //         hospital: '을지대병원',
  //         subject: '외과',
  //         medicalField: ['외과 수술', '13년차', '전문의'],
  //       },
  //       {
  //         name: '김형도',
  //         image: 'https://www.pinnaclecare.com/wp-content/uploads/2017/12/bigstock-African-young-doctor-portrait-28825394.jpg',
  //         hospital: '을지대병원',
  //         subject: '내과',
  //         medicalField: ['내과 수술', '20년차', '베테랑'],
  //       },
  //     ]],
  //     ['11:30', [
  //       {
  //         name: '이준범',
  //         image: 'https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=1200:*',
  //         hospital: '을지대병원',
  //         subject: '외과',
  //         medicalField: ['외과 수술', '13년차', '전문의'],
  //       },
  //       {
  //         name: '장윤희',
  //         image: 'https://media.istockphoto.com/id/1189304032/photo/doctor-holding-digital-tablet-at-meeting-room.jpg?s=612x612&w=0&k=20&c=RtQn8w_vhzGYbflSa1B5ea9Ji70O8wHpSgGBSh0anUg=',
  //         hospital: '을지대병원',
  //         subject: '산부인과',
  //         medicalField: ['5년차', '전문의'],
  //       },
  //       {
  //         name: '김형도',
  //         image: 'https://www.pinnaclecare.com/wp-content/uploads/2017/12/bigstock-African-young-doctor-portrait-28825394.jpg',
  //         hospital: '을지대병원',
  //         subject: '내과',
  //         medicalField: ['내과 수술', '20년차', '베테랑'],
  //       },
  //       {
  //         name: '해밍턴',
  //         image: 'https://cdn.houstonpublicmedia.org/wp-content/uploads/2015/09/22105535/Nuila.Ricardo.E.143882.Internal.Med_.jpg',
  //         hospital: '을지대병원',
  //         subject: '신경외과',
  //         medicalField: ['정신과 상담', '신경 수술', , '17년차', '베테랑'],
  //       },
  //     ]]
  //   ]],
  //   ['07/04', '화요일', [
  //     ['12:00', [
  //       {
  //         name: '해밍턴',
  //         image: 'https://cdn.houstonpublicmedia.org/wp-content/uploads/2015/09/22105535/Nuila.Ricardo.E.143882.Internal.Med_.jpg',
  //         hospital: '을지대병원',
  //         subject: '신경외과',
  //         medicalField: ['정신과 상담', '신경 수술', , '17년차', '베테랑'],
  //       },
  //       {
  //         name: '이준범',
  //         image: 'https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=1200:*',
  //         hospital: '을지대병원',
  //         subject: '외과',
  //         medicalField: ['외과 수술', '13년차', '전문의'],
  //       },
  //       {
  //         name: '김형도',
  //         image: 'https://www.pinnaclecare.com/wp-content/uploads/2017/12/bigstock-African-young-doctor-portrait-28825394.jpg',
  //         hospital: '을지대병원',
  //         subject: '내과',
  //         medicalField: ['내과 수술', '20년차', '베테랑'],
  //       },
  //     ]],
  //     ['18:00', [
  //       {
  //         name: '이준범',
  //         image: 'https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=1200:*',
  //         hospital: '을지대병원',
  //         subject: '외과',
  //         medicalField: ['외과 수술', '13년차', '전문의'],
  //       },
  //       {
  //         name: '장윤희',
  //         image: 'https://media.istockphoto.com/id/1189304032/photo/doctor-holding-digital-tablet-at-meeting-room.jpg?s=612x612&w=0&k=20&c=RtQn8w_vhzGYbflSa1B5ea9Ji70O8wHpSgGBSh0anUg=',
  //         hospital: '을지대병원',
  //         subject: '산부인과',
  //         medicalField: ['5년차', '전문의'],
  //       },
  //       {
  //         name: '김형도',
  //         image: 'https://www.pinnaclecare.com/wp-content/uploads/2017/12/bigstock-African-young-doctor-portrait-28825394.jpg',
  //         hospital: '을지대병원',
  //         subject: '내과',
  //         medicalField: ['내과 수술', '20년차', '베테랑'],
  //       },
  //       {
  //         name: '해밍턴',
  //         image: 'https://cdn.houstonpublicmedia.org/wp-content/uploads/2015/09/22105535/Nuila.Ricardo.E.143882.Internal.Med_.jpg',
  //         hospital: '을지대병원',
  //         subject: '신경외과',
  //         medicalField: ['정신과 상담', '신경 수술', , '17년차', '베테랑'],
  //       },
  //     ]],
  //     ['20:30', [
  //       {
  //         name: '해밍턴',
  //         image: 'https://cdn.houstonpublicmedia.org/wp-content/uploads/2015/09/22105535/Nuila.Ricardo.E.143882.Internal.Med_.jpg',
  //         hospital: '을지대병원',
  //         subject: '신경외과',
  //         medicalField: ['정신과 상담', '신경 수술', , '17년차', '베테랑'],
  //       },
  //       {
  //         name: '장윤희',
  //         image: 'https://media.istockphoto.com/id/1189304032/photo/doctor-holding-digital-tablet-at-meeting-room.jpg?s=612x612&w=0&k=20&c=RtQn8w_vhzGYbflSa1B5ea9Ji70O8wHpSgGBSh0anUg=',
  //         hospital: '을지대병원',
  //         subject: '산부인과',
  //         medicalField: ['5년차', '전문의'],
  //       },
  //     ]]
  //   ]],
  // ]
  historyData: {},
  // historyData 형식
  //  {
  //   underReservation: [
  //     {
  //       date: '2023.04.21',
  //       time: '오전 11:30',
  //       doctorInfo: {
  //         name: '장윤희',
  //         image: 'https://media.istockphoto.com/id/1189304032/photo/doctor-holding-digital-tablet-at-meeting-room.jpg?s=612x612&w=0&k=20&c=RtQn8w_vhzGYbflSa1B5ea9Ji70O8wHpSgGBSh0anUg=',
  //         hospital: '을지대병원',
  //         subject: '이비인후과',
  //         medicalField: ['5년차', '전문의'],
  //       },
  //       profileType: '본인',
  //       profileInfo: {
  //         name: '이준범'
  //       },
  //       symptom: '콧물이 계속 흘러요',
  //     },
  //   ],
  //   pastHistory: [
  //     {
  //       date: '2023.04.07',
  //       time: '오후 04:00',
  //       doctorInfo: {
  //         name: '김형도',
  //         image: 'https://www.pinnaclecare.com/wp-content/uploads/2017/12/bigstock-African-young-doctor-portrait-28825394.jpg',
  //         hospital: '을지대병원',
  //         subject: '내과',
  //         medicalField: ['내과 수술', '20년차', '베테랑'],
  //       },
  //       profileType: '자녀',
  //       profileInfo: {
  //         name: '이재인'
  //       },
  //       symptom: '열이 좀 있는 것 같고 소화가 잘 안된대요',
  //     },
  //     {
  //       date: '2023.04.06',
  //       time: '오전 10:40',
  //       doctorInfo: {
  //         name: '해밍턴',
  //         image: 'https://cdn.houstonpublicmedia.org/wp-content/uploads/2015/09/22105535/Nuila.Ricardo.E.143882.Internal.Med_.jpg',
  //         hospital: '을지대병원',
  //         subject: '신경외과',
  //         medicalField: ['정신과 상담', '신경 수술', , '17년차', '베테랑'],
  //       },
  //       profileType: '본인',
  //       profileInfo: {
  //         name: '이준범'
  //       },
  //       symptom: '기침이 자주 나요',
  //       opinion: 'pdf파일 링크',
  //     },
  //   ],
  // },
  alarmData: [],
  reuseTickets: 0,
  allQuestions: [],
  myQuestions: [],
};

//create context
const ApiContext = createContext({});

//create reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        accountData: {
          ...state.accountData,
          loginToken: action.loginToken,
          email: action.email,
        },
      };

    case "LOGOUT":
      return {
        ...state,
        accountData: {
          ...state.accountData,
          loginToken: undefined,
          email: undefined,
        },
        profileData: [
          {
            id: undefined,
            name: undefined,
            relationship: undefined,
            birth: undefined,
            gender: undefined,
            height: undefined,
            weight: undefined,
            drinker: undefined,
            smoker: undefined,
            medicalHistory: undefined,
            medicalHistoryFamily: undefined,
            medication: undefined,
            allergicReaction: undefined,
            etcConsideration: undefined,
          },
        ],
        historyData: {},
        alarmData: [],
      };

    case "PROFILE_CREATE_MAIN":
      return {
        ...state,
        profileData: [
          {
            id: action.id,
            name: action.name,
            relationship: action.relationship,
            birth: action.birth,
            gender: action.gender,
            height: undefined,
            weight: undefined,
            drinker: undefined,
            smoker: undefined,
            medicalHistory: undefined,
            medicalHistoryFamily: undefined,
            medication: undefined,
            allergicReaction: undefined,
            etcConsideration: undefined,
          },
        ],
      };

    case "PROFILE_UPDATE_MAIN":
      return {
        ...state,
        profileData: [
          {
            id: action.id,
            name: action.name,
            relationship: action.relationship,
            birth: action.birth,
            gender: action.gender,
            height: action?.height,
            weight: action?.weight,
            drinker: action?.drinker,
            smoker: action?.smoker,
            medicalHistory: action?.medicalHistory,
            medicalHistoryFamily: action?.medicalHistoryFamily,
            medication: action?.medication,
            allergicReaction: action?.allergicReaction,
            etcConsideration: action?.etcConsideration,
          },
        ],
      };

    case "PRODUCT_LIST_UPDATE":
      return {
        ...state,
        productList: action.productList,
      };

    case "BOOKABLE_DATA_UPDATE":
      return {
        ...state,
        bookableData: action.bookableData,
      };

    case "HISTORY_DATA_UPDATE":
      return {
        ...state,
        historyData: action.historyData,
      };

    case "ALARM_DATA_UPDATE":
      return {
        ...state,
        alarmData: action.alarmData,
      };

    case "REUSE_COUNT":
      return {
        ...state,
        reuseTickets: action.reuseTickets,
      };

    case "ALL_QUESTIONS":
      return {
        ...state,
        allQuestions: action.allQuestions,
      };

    case "MY_QUESTIONS":
      return {
        ...state,
        myQuestions: action.myQuestions,
      };

    default:
      return state;
  }
};

//create Provider component
const ApiProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  // console.log(`ApiContext: ${JSON.stringify(state.accountData)}`);
  // console.log(`ApiContext: ${JSON.stringify(state.profileData[0])}`);
  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export { ApiContext, ApiProvider };
