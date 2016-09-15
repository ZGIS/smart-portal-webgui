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
  fileIdentifier: string;
  title: string;
  abstrakt: string;
}
