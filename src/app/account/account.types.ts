export interface UserJs {
  email: string;
  accountSubject: string;
  firstname: string;
  lastname: string;
  password?: string;
  laststatustoken?: string;
  laststatuschange?: string; // possibly moment datetime something?
}

export interface RegisterJs {
  email: string;
  accountSubject: string;
  firstname: string;
  lastname: string;
  password?: string;
}

export interface ProfileJs {
  email: string;
  firstname: string;
  lastname: string;
  password?: string;
}

export interface LoginCredentials {
  email?: string;
  password?: string;
}

export interface PasswordUpdateCredentials {
  passwordCurrent?: string;
  passwordNew?: string;
  passwordConfirm?: string;
}

export interface GAuthCredentials {
  authcode?: string;
  accesstype?: string;
}

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
