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
