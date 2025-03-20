export class User {
  status: string;
  message: string;
  name: string;
  email: string;
  accountNumber: string;
  balance: number;
  transactionCount: number;
  phone?: string;
  address?: string;
}

export const initialUserState = {
  accountNumber: null,
  name: null,
  email: null,
  balance: 0,
  transactionCount: 0,
  phone: null,
  address: null,
  status: null,
  message: null,
  isAuthenticated: false,
};
