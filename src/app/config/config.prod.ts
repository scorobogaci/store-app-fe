import {Config} from "./config-definition";

export const CONFIG_PROD: Config = {
  aws: {
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    userPoolId: 'us-east-1_E3uZir1cn',
    userPoolWebClientId: '61cqmeaf94s4ihn1usuuktv9pc',
  },
  baseApiUrl: 'https://6037ctx970.execute-api.us-east-1.amazonaws.com/prod'
};
