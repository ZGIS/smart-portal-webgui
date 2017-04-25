export class Result {
  title: string;
}

export interface IGeoFeatureCollection {
  type: any;
  crs: any;
  count: number;
  countMatched: number;
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
  lineageStmt: string;
  linkage: string[];
  origin: string;
}

/**
 * Generic Error that is returned by Ingester and Backend in case of Errors
 */
export interface IErrorResult {
  message: string;
  details: string;
}
