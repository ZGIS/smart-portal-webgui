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
  fileIdentifier: string;
  dateStamp?: string;
  title: string;
  abstrakt?: string;
  keywords?: string[];
  smartCategory?: string;
  topicCategories?: string[];
  contactName?: string;
  contactOrg?: string;
  contactEmail?: string;
  license?: string;
  lineageStmt?: string;
  linkage: ILinkageType[];
  hierarchyLevel?: string;
  origin: string;
  originUrl?: string;
  searchScore?: number;
}

export interface ILinkageType {
  linkage: string;
  protocol?: string;
  name?: string;
  description?: string;
  resourceType: string;
}
/**
 * Generic Error that is returned by Ingester and Backend in case of Errors
 */
export interface IErrorResult {
  message: string;
  details: string;
}
