import { Injectable } from '@angular/core';

export interface UserProfile {
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  password?: string;
}

export function createProfile(profileConf: UserProfile): {
  email: string,
  username: string,
  firstname: string,
  lastname: string,
  password?: string } {

  let profileObj = {
    email: profileConf.email,
    username: profileConf.username,
    firstname: profileConf.firstname,
    lastname: profileConf.lastname,
    password: '***'
  };

  if (profileConf.password) {
    profileObj.password = profileConf.password;
  }

  return profileObj;
}

@Injectable()
export class AccountService {

  profileNoPass = createProfile({
    email: 'alex@example.com',
    username: 'alex',
    firstname: 'Alex',
    lastname: 'K'
  });
  // loginTest = {'username': 'alex', 'password': 'testpass123'};
  guestProfile = createProfile({
    email: 'alex@example.com',
    username: 'akmoch',
    firstname: 'Alex',
    lastname: 'K',
    password: 'testpass123'
  });

  private loggedInState = false;

  getProfile(): UserProfile {
    return this.profileNoPass;
  };

  getUsername(): string {
    return this.profileNoPass.username;
  };

  authenticate(credentials: any) {
    this.loggedInState = true;
  }

  isLoggedIn(): boolean {
    return this.loggedInState;
  };

  logout() {
    this.loggedInState = false;
  }
  constructor() {
  };

}
