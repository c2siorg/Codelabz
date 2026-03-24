export interface UserProfile {
    handle?: string;
    displayName?: string;
    email?: string;
    country?: string;
    photoURL?: string;
    [key: string]: unknown;
}

export interface FirebaseAuth {
  uid?: string;
  email?: string;
  emailVerified?: boolean;
  isEmpty?: boolean;
  isLoaded?: boolean;
  [key: string]: unknown;
}

export interface OrgPermissions {
  [key: string]: boolean | string;
}

export interface OrgState {
  general: {
    permissions: OrgPermissions[];
  };
}

export interface FirebaseState {
  auth: FirebaseAuth;
  profile: UserProfile;
}

export interface RootState {
  firebase: FirebaseState;
  org: OrgState;
}

export interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}