import {Config} from "./config-definition";

export const CONFIG_PROD: Config = {
  aws: {
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    userPoolId: 'us-east-1_E3uZir1cn',
    userPoolWebClientId: '61cqmeaf94s4ihn1usuuktv9pc',
    identityPoolId:'us-east-1:b454a0fa-6b35-4a2f-a2f0-cc3e9f2cac13',
    region: 'us-east-1'
  },
  baseApiUrl: 'https://97z7vp1ds8.execute-api.us-east-1.amazonaws.com/prod'
};
