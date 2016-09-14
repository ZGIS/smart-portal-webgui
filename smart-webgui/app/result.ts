export class Result {
  title: string;
}

export interface IGeoFeature {
  properties: IGeoFeatureProperties;
}

export interface IGeoFeatureProperties {
  fileIdentifier: string;
  title: string;
  abstrakt: string;
}
