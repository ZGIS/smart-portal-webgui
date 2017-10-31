export interface UserGroup {
  uuid?: string;
  name: string;
  shortinfo?: string;
  laststatustoken: string;
  laststatuschange: string;
  hasUsersLevel?: UserGroupUsersLevel[];
  hasOwcContextsVisibility?: UserGroupContextsVisibility[];
}

export interface UserGroupUsersLevel {
  usergroups_uuid: string;
  users_accountsubject: string;
  userlevel: number;
}

export interface UserGroupContextsVisibility {
  usergroups_uuid: string;
  owc_context_id: string;
  visibility: number;
}

export interface UserSession {
  token: string;
  useragent?: string;
  email: string;
  laststatustoken: string;
  laststatuschange: string;
}

export interface UserLinkLogging {
  id?: number;
  timestamp: string;
  ipaddress?: string;
  useragent?: string;
  email?: string;
  link?: string;
  referer?: string;
}
