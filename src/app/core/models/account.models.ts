export type AccountType = 'debit' | 'credit' | 'asset';

export interface AccountConfig {
  color?: string;
  icon?: string;
  visible?: boolean;
  image?: string;
  includedInNetSum?: boolean;
  group?: string;
}

export interface AccountSummary {
  id: string;
  name: string;
  description?: string;
  type: AccountType;
  available?: number;
  tags?: string[];
  accountConfig?: AccountConfig;
}

export interface BaseAccount extends AccountSummary {
  walletId: string;
  sharingWallets?: string[];
  rules?: string[];
}

export interface DebitAccount extends BaseAccount {
  type: 'debit';
  goal?: number;
}

export interface CreditAccount extends BaseAccount {
  type: 'credit';
  currentDebt?: number;
  creditLimit?: number;
}

export interface AssetAccount extends BaseAccount {
  type: 'asset';
  asset: string;
  currentPrice?: number;
  averageCost: number;
  goal?: number;
}

export type Account = DebitAccount | CreditAccount | AssetAccount;

export interface CreateAccountRequest {
  name: string;
  description?: string;
  type: AccountType;
  available?: number;
  tags?: string[];
  config?: AccountConfig;
  // Debit
  goal?: number;
  // Asset
  asset?: string;
  currentPrice?: number;
  averageCost?: number;
  // Credit
  currentDebt?: number;
  creditLimit?: number;
}

export interface MockTransaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense' | 'transfer';
  category: string;
}
