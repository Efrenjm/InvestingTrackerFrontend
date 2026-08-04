export enum Visibility {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC'
}

export interface WalletSummary {
  id: string;
  name: string;
  description?: string;
  roles?: any[];
}

export interface Wallet {
  id: string;
  name: string;
  description?: string;
  visibility: Visibility;
  createdBy?: string;
  roles?: Record<string, any>;
  accounts?: string[];
  configuration?: any;
}

export interface CreateWalletRequest {
  name: string;
  description?: string;
  visibility?: Visibility;
}

export interface UpdateWalletRequest {
  name: string;
  description?: string;
  visibility?: Visibility;
}

export interface AddMemberRequest {
  memberId: string;
  roleName: string;
}
