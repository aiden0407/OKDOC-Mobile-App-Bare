//React
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dataDogFrontendError } from "api/DataDog";

export default function useNetinfoUpdate() {
  const updateNetinfo = async function () {
    try {
      let options = {
        url: "https://ipapi.co/json/",
        method: "GET",
      };
      const response = await axios(options);
      await AsyncStorage.setItem(
        "@net_information",
        JSON.stringify({
          netInfo: response.data,
          geoip: {
            continent: {
              code: response.data.continent_code,
            },
            country: {
              name: response.data.country_name,
              iso_code: response.data.country_code,
            },
            subdivision: {
              name: response.data.region,
            },
            city: {
              name: response.data.city,
            },
          },
        })
      );
    } catch (error) {
      await AsyncStorage.setItem("@net_information", {});
      dataDogFrontendError(error);
    }
  };

  return { updateNetinfo };
}
