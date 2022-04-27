import {Config} from "./config-definition";

export const CONFIG_PROD: Config = {
  aws: {
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    userPoolId: 'us-east-1_6UeKyfbcH',
    userPoolWebClientId: '17gatih448cqs5edbe82n3a12k',
    identityPoolId:'us-east-1:0505aaef-740d-4317-877f-e45e851a2f57',
    region: 'us-east-1'
  },
  baseApiUrl: 'https://oep0gz3i94.execute-api.us-east-1.amazonaws.com/prod'
};
