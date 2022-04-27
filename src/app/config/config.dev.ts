import {Config} from "./config-definition";

export const CONFIG_DEV: Config = {
  aws: {
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    userPoolId: 'us-east-1_h20Jk81LT',
    userPoolWebClientId: '1v00kr47ftgn0mp2r8fnoroimg',
    identityPoolId: 'us-east-1:2e3d5282-0b30-4864-bc07-129b06762e6d',
    region: 'us-east-1'
  },
  baseApiUrl: 'https://suj66fr391.execute-api.us-east-1.amazonaws.com/prod'
};
