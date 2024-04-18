//React
import { useContext } from "react";
import { ApiContext } from "context/ApiContext";
import { AppContext } from "context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dataDogFrontendError } from "api/DataDog";

//Api
import { getAlarmHistory } from "api/Alarm";

export default function useAlarmUpdate() {
  const {
    state: { accountData, profileData },
    dispatch: apiContextDispatch,
  } = useContext(ApiContext);
  const { dispatch: appContextDispatch } = useContext(AppContext);

  function formatTimeAgo(timestamp) {
    const now = new Date();
    const targetDate = new Date(timestamp);

    const timeDifference = now - targetDate;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      return "방금";
    } else if (minutes < 60) {
      return `${minutes}분 전`;
    } else if (hours < 24) {
      return `${hours}시간 전`;
    } else if (days < 7) {
      return `${days}일 전`;
    } else if (weeks < 4) {
      return `${weeks}주 전`;
    } else if (months < 12) {
      return `${months}개월 전`;
    } else {
      return `${years}년 전`;
    }
  }

  const refreshAlarm = () => {
    if (accountData.loginToken && profileData?.[0]?.id) {
      appContextDispatch({ type: "ALARM_DATA_UPDATING" });
    }
    updateAlarm();
  };

  const updateAlarm = async function () {
    let contextAlarmSet = [];
    let readAlarmIdList = [];

    try {
      const jsonValue = await AsyncStorage.getItem("@readAlarmIdList");
      if (jsonValue !== null) {
        readAlarmIdList = JSON.parse(jsonValue);
      }
    } catch (error) {
      dataDogFrontendError(error);
    }

    try {
      const response = await getAlarmHistory(
        accountData.loginToken,
        profileData?.[0]?.id
      );
      contextAlarmSet = response.data.response;
      contextAlarmSet.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });

      for (const obj of contextAlarmSet) {
        obj.message = obj.message.replace(/\[.*?\]/g, "").trim();
        obj.time = formatTimeAgo(obj.createdAt) ?? obj.createdAt;

        if (!readAlarmIdList.includes(obj.id)) {
          obj.new = true;
          readAlarmIdList.push(obj.id);
          try {
            await AsyncStorage.setItem(
              "@readAlarmIdList",
              JSON.stringify(readAlarmIdList)
            );
          } catch (error) {
            dataDogFrontendError(error);
          }
        }
      }

      apiContextDispatch({
        type: "ALARM_DATA_UPDATE",
        alarmData: contextAlarmSet,
      });
      setTimeout(() => {
        appContextDispatch({ type: "ALARM_DATA_UPDATED" });
      }, 1000);
    } catch (error) {
      appContextDispatch({ type: "ALARM_DATA_UPDATED" });
      dataDogFrontendError(error);
    }
  };

  return { refreshAlarm };
}
