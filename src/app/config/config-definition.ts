export interface Config {
  aws: {
    authenticationFlowType: string
    userPoolId: string;
    userPoolWebClientId: string;
    identityPoolId: string;
    region: string;
  },
  baseApiUrl: string
}
