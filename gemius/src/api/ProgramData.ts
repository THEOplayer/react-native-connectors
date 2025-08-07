export enum ProgramType {
  AUDIO = 0,
  VIDEO = 1,
}

export class ProgramData {
  name?: string;
  duration?: number;
  transmission?: string;
  quality?: string;
  resolution?: string;
  volume?: number;
  externalPremiereDate?: string;
  premiereDate?: string;
  series?: string;
  programType?: ProgramType;
  typology?: string;
  programGenre?: number;
  programPartialName?: string;
  programProducer?: string;
  programThematicCategory?: string;
  programSeason?: string;
  transmissionChannel?: string;
  transmissionStartTime?: string;
  transmissionType?: number;
  [key: string | number | ProgramType]: string | number;
}
