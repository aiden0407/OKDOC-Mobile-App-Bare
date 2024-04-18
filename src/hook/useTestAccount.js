export default function useTestAccount(email) {
  const testAccountList = [
    // 에이든 계정
    "okdoc@okdoc.app",
    "aiden@insunginfo.co.kr",
    "cailyent0407@gmail.com",
    // 로건 계정
    "logan@insunginfo.co.kr",
    // 레오 계정
    "reo.l@insunginfo.co.kr",
    // 무브 계정
    "move@insunginfo.co.kr",
  ];

  return testAccountList.includes(email);
}
