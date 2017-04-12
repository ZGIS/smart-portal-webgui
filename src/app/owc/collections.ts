export interface IOwcDocument {
  type: any;
  id: string;
  geometry: any;
  properties: IOwcDocumentProperties;
  features: IOwcEntry[];
}

export interface IOwcDocumentProperties {
  lang: string;
  title: string;
  subtitle?: string;
  updated?: any;
  generator?: string;
  rights: string;
  authors: IOwcAuthor[];
  contributors: IOwcAuthor[];
  creator?: string;
  publisher?: string;
  categories: IOwcCategory[];
  links: IOwcLink[];
}

export interface IOwcEntry {
  type: any;
  id: string;
  geometry: any;
  properties: IOwcEntryProperties;
}

export interface IOwcEntryProperties {
  lang: string;
  title: string;
  subtitle?: string;
  updated?: any;
  generator?: string;
  rights: string;
  authors: IOwcAuthor[];
  contributors: IOwcAuthor[];
  creator?: string;
  publisher?: string;
  categories: IOwcCategory[];
  links: IOwcLink[];
  offerings: IOwcOffering[];
  content?: any; // content and subtitle, not sure about the current data model
}

export interface IOwcAuthor {
  name: string;
  email: string;
  uri: string;
}

export interface IOwcCategory {
  scheme: string;
  term: string;
  label: string;
}

export interface IOwcLink {
  rel: string;
  type: string;
  href: string;
  title: string;
}

export interface IOwcOffering {
  code: string;
  operations: IOwcOperation[];
  contents: any[];
}

export interface IOwcOperation {
  code: string;
  method: string;
  type: string;
  href: string;
  request?: IOwcPostRequestConfig;
  result?: IOwcRequestResult;
}

export interface IOwcPostRequestConfig {
  type: string;
  request: string;
}

export interface IOwcRequestResult {
  type: string;
  response: string;
}
