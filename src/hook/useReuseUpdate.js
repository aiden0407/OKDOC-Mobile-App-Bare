//React
import { useContext } from "react";
import { ApiContext } from "context/ApiContext";
// import * as Clipboard from 'expo-clipboard';

//Api
import { getIosReuseBidding, getAndroidReuseBidding } from "api/Iap";

export default function useReuseUpdate() {
  const {
    state: { accountData },
    dispatch,
  } = useContext(ApiContext);

  const updateReuse = async function () {
    let reuseTickets = 0;

    try {
      const iosReuseResponse = await getIosReuseBidding(accountData.loginToken);
      const iosTickets = iosReuseResponse.data.response.length;
      reuseTickets += iosTickets;
    } catch (error) {
      // reuse가 없는 경우 statusCode 404
    }

    try {
      const androidReuseResponse = await getAndroidReuseBidding(
        accountData.loginToken
      );
      const androidTickets = androidReuseResponse.data.response.length;
      reuseTickets += androidTickets;
    } catch (error) {
      // reuse가 없는 경우 statusCode 404
    }

    dispatch({
      type: "REUSE_COUNT",
      reuseTickets: reuseTickets,
    });
  };

  return { updateReuse };
}
