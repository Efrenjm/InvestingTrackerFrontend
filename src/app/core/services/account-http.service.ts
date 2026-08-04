import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Account, AccountSummary, CreateAccountRequest } from '../models/account.models';

@Injectable({
  providedIn: 'root'
})
export class AccountHttpService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/account';

  getWalletAccounts(walletId: string): Observable<AccountSummary[]> {
    return this.http.get<AccountSummary[]>(`${this.baseUrl}?walletId=${walletId}`);
  }

  getAllUserAccounts(): Observable<AccountSummary[]> {
    return this.http.get<AccountSummary[]>(this.baseUrl);
  }

  getAccount(accountId: string): Observable<Account> {
    return this.http.get<Account>(`${this.baseUrl}/${accountId}`);
  }

  createAccount(walletId: string, request: CreateAccountRequest): Observable<Account> {
    return this.http.post<Account>(`${this.baseUrl}?walletId=${walletId}`, request);
  }

  updateAccount(accountId: string, request: Partial<CreateAccountRequest>): Observable<Account> {
    return this.http.put<Account>(`${this.baseUrl}/${accountId}`, request);
  }

  deleteAccount(accountId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${accountId}`);
  }
}
