import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AddMemberRequest, CreateWalletRequest, UpdateWalletRequest, Wallet, WalletSummary } from '../models/wallet.models';

@Injectable({
  providedIn: 'root'
})
export class WalletHttpService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/wallet';

  getMyWallets(): Observable<WalletSummary[]> {
    return this.http.get<WalletSummary[]>(this.baseUrl);
  }

  getPublicWallets(): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(`${this.baseUrl}/public`);
  }

  getWallet(walletId: string): Observable<Wallet> {
    return this.http.get<Wallet>(`${this.baseUrl}/${walletId}`);
  }

  createWallet(request: CreateWalletRequest): Observable<Wallet> {
    return this.http.post<Wallet>(this.baseUrl, request);
  }

  updateWallet(walletId: string, request: UpdateWalletRequest): Observable<Wallet> {
    return this.http.put<Wallet>(`${this.baseUrl}/${walletId}`, request);
  }

  deleteWallet(walletId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${walletId}`);
  }

  addMember(walletId: string, request: AddMemberRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${walletId}/members`, request);
  }

  removeMember(walletId: string, memberId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${walletId}/members/${memberId}`);
  }
}
