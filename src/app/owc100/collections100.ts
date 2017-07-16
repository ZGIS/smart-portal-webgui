export class OwcContext {
  type: any;
  id: string;
  geometry: any;
  lang: string;
  title: string;
  subtitle?: string;
  updated?: any;
  generator?: OwcCreatorApplication;
  display?: OwcCreatorDisplay;
  rights: string;
  authors: OwcAuthor[];
  creator?: string;
  publisher?: string;
  categories: OwcCategory[];
  links: OwcLink[];
  features: OwcResource[];
}

export class OwcResource {
  id: string;
  geometry: any;
  lang: string;
  title: string;
  subtitle?: string;
  updated?: any;
  generator?: string;
  rights: string;
  authors: OwcAuthor[];
  creator?: string;
  publisher?: string;
  categories: OwcCategory[];
  links: OwcLink[];
  offerings: OwcOffering[];
  content?: OwcContent;
}

export class OwcAuthor {
  uuid?: string;
  name: string;
  email: string;
  uri: string;
}

export class OwcCategory {
  uuid?: string;
  scheme: string;
  term: string;
  label: string;
}

export class OwcLink {
  uuid?: string;
  rel: string;
  type: string;
  length: number;
  href: string;
  title: string;
}

export class OwcOffering {
  uuid?: string;
  code: string;
  operations: OwcOperation[];
  contents: OwcContent[];
  styles: OwcStyleSet[];
}

export class OwcOperation {
  uuid?: string;
  code: string;
  method: string;
  type: string;
  href: string;
  request?: OwcContent;
  result?: OwcContent;
}

export class OwcCreatorApplication {
  uuid?: string;
  title: string;
  version: string;
  uri?: string;
}

export class OwcCreatorDisplay {
  uuid?: string;
  pixelHeight: number;
  pixelWidth: number;
  mmPerPixel?: number;
}

export class OwcStyleSet {
  uuid?: string;
  title: string;
  subtitle: string;
  content?: OwcContent;
}

export class OwcContent {
  uuid?: string;
  type?: string;
  content?: string;
}
