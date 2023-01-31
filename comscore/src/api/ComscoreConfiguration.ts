export enum ComscoreUserConsent {
  denied = "0",
  granted = "1",
  unknown = "-1"
}

export interface ComscoreConfiguration {
  publisherId: string;
  applicationName: string;
  userConsent: ComscoreUserConsent;
  debug?: boolean;
}



