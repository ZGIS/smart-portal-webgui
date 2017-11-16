import { SafeUrl } from '@angular/platform-browser';

export interface SparqlResult {
  head: SparqlHeadVars;
  results: SparqlHeadResults;
}

export interface SparqlHeadVars {
  vars: string[];
}

export interface SparqlHeadResults {
  bindings: SparqlBinding[];
}

export interface SparqlBinding {}

// for skos:Collections (to get members of the collection with IRI id and label)
export interface IriLabelBinding extends SparqlBinding {
  iri: BindingTypeValue;
  label: BindingTypeValue;
}

// for skos:Concept (the actual terms with its attribute names and the value)
export interface AttributeLabelBinding extends SparqlBinding {
  att: BindingTypeValue;
  val: BindingTypeValue;
}

export interface BindingTypeValue {
  type: string;
  value: string;
  typeAsSafeUrl?: SafeUrl;
  valueAsSafeUrl?: SafeUrl;
}
