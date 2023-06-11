import axios from 'axios';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
const elderlyApi = axios.create({
  baseURL: 'https://elderyresearch.cs.bgu.ac.il/api', // Set your base URL
});
elderlyApi.interceptors.request.use(
  async config => {
    const token = await GoogleSignin.getTokens();
    if (!config?.headers) {
      config.headers = {};
    }
    config.headers.AccessToken = token.accessToken;
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default elderlyApi;
