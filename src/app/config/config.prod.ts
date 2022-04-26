import {Config} from "./config-definition";

export const CONFIG_PROD: Config = {
  aws: {
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    userPoolId: 'us-east-1_xIaH0zt96',
    userPoolWebClientId: '3sce1vehsrrp5va9i0u4qj43kb',
    identityPoolId:'us-east-1:b454a0fa-6b35-4a2f-a2f0-cc3e9f2cac13',
    region: 'us-east-1'
  },
  baseApiUrl: 'https://suj66fr391.execute-api.us-east-1.amazonaws.com/prod'
};
