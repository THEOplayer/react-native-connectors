export interface BitmovinAnalyticsConfig extends BitmovinCustomData {
  licenseKey: string;
  adTrackingDisabled?: boolean;
  randomizeUserId?: boolean;
  backendUrl?: string;
  cdnProvider?: string;
  customUserId?: string;
  sourceMetadata?: BitmovinSourceMetadata;
  cookiesEnabled?: boolean;
  cookiesDomain?: string;
  cookiesMaxAge?: number;
}

export interface BitmovinSourceMetadata {
  title?: string;
  videoId?: string;
  cdnProvider?: string;
  path?: string;
  isLive?: boolean;
}

export interface BitmovinCustomData {
  customData1?: string;
  customData2?: string;
  customData3?: string;
  customData4?: string;
  customData5?: string;
  customData6?: string;
  customData7?: string;
  customData8?: string;
  customData9?: string;
  customData10?: string;
  customData11?: string;
  customData12?: string;
  customData13?: string;
  customData14?: string;
  customData15?: string;
  customData16?: string;
  customData17?: string;
  customData18?: string;
  customData19?: string;
  customData20?: string;
  customData21?: string;
  customData22?: string;
  customData23?: string;
  customData24?: string;
  customData25?: string;
  customData26?: string;
  customData27?: string;
  customData28?: string;
  customData29?: string;
  customData30?: string;
  customData31?: string;
  customData32?: string;
  customData33?: string;
  customData34?: string;
  customData35?: string;
  customData36?: string;
  customData37?: string;
  customData38?: string;
  customData39?: string;
  customData40?: string;
  customData41?: string;
  customData42?: string;
  customData43?: string;
  customData44?: string;
  customData45?: string;
  customData46?: string;
  customData47?: string;
  customData48?: string;
  customData49?: string;
  customData50?: string;
}
