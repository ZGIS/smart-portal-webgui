import { SacGwhNotification } from '../notifications/notification.service';

export interface UserFile {
  uuid?: string;
  users_accountsubject?: string;
  originalfilename: string;
  linkreference: string;
  laststatustoken: string;
  laststatuschange: string; // possibly moment datetime something?
}

export interface UserMetaRecord {
  uuid?: string;
  users_accountsubject?: string;
  originaluuid: string;
  cswreference: string;
  laststatustoken: string;
  laststatuschange: string; // possibly moment datetime something?
}

export interface LocalBlobInfo {
  name: string;
  mediaLink: string;
  bucket: string;
  contentType: string;
  contentEncoding: string;
  size: number;
  md5: string;
  createTime: string; // possibly moment datetime something?
}

export interface UserFileResponse {
  status: string;
  linkreference: string;
  originalfilename: string;
  message?: string;
}

export class CswTransactionResponse implements SacGwhNotification {
  type: string;
  message: string;
}

export interface OwcContextsRightsMatrix {
  owcContextId: string;
  queryingUserAccountSubject: string;
  origOwnerAccountSubject: string;
  viaGroups?: string[];
  contextIntrinsicVisibility?: number;
  queryingUserAccessLevel?: number;
}

export const UserRightsLevel = {
  0 : 'ReadOnly',
  1 : 'Editing',
  2 : 'PowerUser',
  3 : 'OverLordAdminDeprecated'
};

export const UserRightsLevelIcon = {
  0 : 'fa fa-eye',
  1 : 'fa fa-edit',
  2 : 'fa fa-shield',
  3 : 'fa fa-lock'
};

export const ContextVisibility = {
  0 : 'private',
  1 : 'group-sharing',
  2 : 'public'
};

export const ContextVisibilityIcon = {
  0 : 'fa fa-street-view',
  1 : 'fa fa-group',
  2 : 'fa fa-globe'
};
