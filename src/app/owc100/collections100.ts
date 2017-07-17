export interface OwcContext {
  id: string;
  bbox: any;
  properties: OwcContextProperties;
  links: OwcContextLinks;
  features?: OwcResource[];
}

export interface OwcContextProperties {
  lang: string;
  title: string;
  subtitle?: string;
  updated: string;
  authors?: OwcAuthor[];
  publisher?: string;
  generator?: OwcCreatorApplication;
  display?: OwcCreatorDisplay;
  rights?: string;
  date?: string;
  categories?: OwcCategory[];
}

export interface OwcContextLinks {
  profiles: OwcLink[];
  via?: OwcLink[];
}

export interface OwcResource {
  id: string;
  properties: OwcResourceProperties;
}

export interface OwcResourceProperties {
  title: string;
  abstract?: string;
  updated: string;
  authors?: OwcAuthor[];
  publisher?: string;
  rights?: string;
  geometry?: any;
  date?: string,
  links?: OwcResourceLinks;
  offerings?: OwcOffering[];
  categories?: OwcCategory[];
  active?: boolean;
  minscaledenominator?: number;
  maxscaledenominator?: number;
  folder?: string;
}

export interface OwcResourceLinks {
  alternates?: OwcLink[];
  previews?: OwcLink[];
  date?: OwcLink[];
  via?: OwcLink[];
}

export interface OwcAuthor {
  name?: string;
  email?: string;
  uri?: string;
  uuid?: string;
}

export interface OwcCategory {
  term: string;
  scheme?: string;
  label?: string;
  uuid?: string;
}

export interface OwcLink {
  href: string;
  type?: string;
  lang?: string;
  title?: string;
  length?: number;
  rel?: string;
  uuid?: string;
}

export interface OwcOffering {
  code: string;
  operations: OwcOperation[];
  contents: OwcContent[];
  styles: OwcStyleSet[];
  uuid?: string;
}

export interface OwcOperation {
  code: string;
  method: string;
  type?: string;
  href: string;
  request?: OwcContent;
  result?: OwcContent;
  uuid?: string;
}

export interface OwcCreatorApplication {
  title?: string;
  uri?: string;
  version?: string;
  uuid?: string;
}

export interface OwcCreatorDisplay {
  pixelWidth?: number;
  pixelHeight?: number;
  mmPerPixel?: number;
  uuid?: string;
}

export interface OwcStyleSet {
  name: string;
  title: string;
  abstract?: string;
  default?: boolean;
  legendURL?: string;
  content?: OwcContent;
  uuid?: string;
}

export interface OwcContent {
  type: string;
  href?: string;
  title?: string;
  content?: string;
  uuid?: string;
}
