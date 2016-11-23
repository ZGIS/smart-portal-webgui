export class GeoMetadata {
  fileIdentifier: string;
  title: string;              // gmd_identificationInfo_MD_DataIdentification_CI_Citation_gmd_title
  abstrakt: string;           // gmd_identificationInfo_MD_DataIdentification_abstract
  keywords: string[];         // TODO SR MD_Metadata path?
  // TODO SR create a "allowed values" enum in the backend and push that to frontend
  topicCategoryCode: string;  // gmd_identificationInfo_MD_DataIdentification_TopicCategoryCode
  hierarchyLevelName: string; // gmd_hierarchyLevelName

  // TODO SR is string helpful here? Number that means "1:x"?
  scale: string;     // gmd_identificationInfo_MD_DataIdentification_MD_Resolution_scaleDenominator
  extent: GeoExtent;
  citation: GeoCitation;

  lineageStatement: string;   // gmd_dataQualityInfo_LI_Lineage_statement
  responsibleParty: GeoContact; // gmd_Contact_CI_ResponsibleParty
  distribution: GeoDistribution;
}

export class GeoExtent {
  description: string;      // gmd_identificationInfo_MD_DataIdentification_extent_Description
  referenceSystem: string;  // gmd_referenceSystemInfo
  mapExtentCoordinates: number[]; // bbox coordinates

  temporalExtent: string;   // gmd_identificationInfo_MD_DataIdentification_extent_temporalElement
}

export class GeoCitation {
  ciDate: string;           // gmd_identificationInfo_MD_DataIdentification_CI_Citation_CI_Date
  ciDateType: string;  // gmd_identificationInfo_MD_DataIdentification_CI_Citation_CI_Date_dateType

}

export class GeoContact {
  individualName: string;   // gmd_Contact_CI_ResponsibleParty_CI_individualName
  telephone: string;        // gmd_Contact_CI_ResponsibleParty_CI_Contact_ci_telephone
  email: string;            // gmd_Contact_CI_ResponsibleParty_CI_Contact_ci_email
  pointOfContact: string;   // gmd_Contact_CI_ResponsibleParty_ci_pointOfContact
  orgName: string;          // gmd_Contact_CI_ResponsibleParty_ci_organisationName
  orgWebLinkage: string;    // gmd_Contact_CI_ResponsibleParty_CI_Contact_ci_onlineLinkage
}

export class GeoDistribution {
  license: string;

}

export class InsertResponse {
  status: string;
  message: string;
}
