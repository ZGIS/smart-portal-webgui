export class Result {
  title: string;
}

export interface IGeoFeatureCollection {
  type: any;
  crs: any;
  features: IGeoFeature[];
}

export interface IGeoFeature {
  type: any;
  geometry: any;
  properties: IGeoFeatureProperties;
}

export interface IGeoFeatureProperties {
  // TODO SR put all exposed properties in here
  fileIdentifier: string;
  title: string;
  abstrakt: string;
  keywords: string[];
  linkage: string[];
  origin: string;
}
