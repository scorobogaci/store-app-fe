import {Config} from "./config-definition";

export const CONFIG_PROD: Config = {
  aws: {
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    userPoolId: 'us-east-1_xIaH0zt96',
    userPoolWebClientId: '3sce1vehsrrp5va9i0u4qj43kb',
    identityPoolId:'us-east-1:71ba9d6e-0f7c-44a2-9ade-c010c384a309',
    region: 'us-east-1'
  },
  baseApiUrl: 'https://oep0gz3i94.execute-api.us-east-1.amazonaws.com/prod'
};
