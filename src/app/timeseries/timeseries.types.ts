export class Timeseries {
  sosUrl: string;
  offering?: string;
  procedure: string;
  observedProperty: string;
  featureOfInterest: string;

  fromDate?: Date;
  toDate?: Date;

  uom: string;
  timeseriesName: string;
  responseFormat?: string;
  data?: any;
}

export class SosServiceMetadata {
  abstrakt?: string;
  fees?: string;
  accessConstraints?: string;
  providerName?: string;
  providerSite?: string;
  serviceContactName?: string;
  serviceContactEmail?: string;
}

export class SosCapabilities {
  sosUrl: string;
  title: string;

  offerings: string[];
  procedures: string[];
  observedProperties: string[];
  featuresOfInterest: string[];
  responseFormats?: string[];

  serviceMetadata?: SosServiceMetadata;
}
