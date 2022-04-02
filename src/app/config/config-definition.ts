export interface Config {
  aws: {
    authenticationFlowType: string
    userPoolId: string;
    userPoolWebClientId: string;
  },
  baseApiUrl: string
}
