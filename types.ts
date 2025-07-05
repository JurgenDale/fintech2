
export enum Role {
  Admin = 'Admin',
  Lender = 'Lender',
  Borrower = 'Borrower',
}

export enum LoanStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Disbursed = 'Disbursed',
  Paid = 'Paid',
  Overdue = 'Overdue',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Loan {
  id: string;
  borrowerId: string;
  borrowerName: string;
  lenderId?: string;
  amountRequested: number;
  amountApproved?: number;
  purpose: string;
  repaymentPeriod: number; // in months
  interestRate?: number; // annual percentage
  status: LoanStatus;
  applicationDate: string; // ISO string
  approvalDate?: string; // ISO string
  disbursementDate?: string; // ISO string
  repaymentSchedule?: RepaymentScheduleItem[];
}

export interface Repayment {
  id: string;
  loanId: string;
  amount: number;
  paymentDate: string; // ISO string
  recordedBy: string; // userId
}

export interface RepaymentScheduleItem {
  dueDate: string; // ISO string
  amountDue: number;
  status: 'Pending' | 'Paid' | 'Overdue';
}
