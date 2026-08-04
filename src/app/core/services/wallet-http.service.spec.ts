import { describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { WalletHttpService } from './wallet-http.service';
import { Visibility, Wallet, WalletSummary } from '../models/wallet.models';

beforeAll(() => {
  try {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  } catch {
    // already initialized
  }
});

describe('WalletHttpService', () => {
  let service: WalletHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        WalletHttpService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(WalletHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user wallets', () => {
    const mockSummaries: WalletSummary[] = [
      { id: 'w1', name: 'My Wallet', description: 'Desc' }
    ];

    service.getMyWallets().subscribe((wallets) => {
      expect(wallets.length).toBe(1);
      expect(wallets[0].name).toBe('My Wallet');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/wallet');
    expect(req.request.method).toBe('GET');
    req.flush(mockSummaries);
  });

  it('should create a wallet', () => {
    const mockWallet: Wallet = {
      id: 'w1',
      name: 'New Wallet',
      visibility: Visibility.PRIVATE
    };

    service.createWallet({ name: 'New Wallet', visibility: Visibility.PRIVATE }).subscribe((wallet) => {
      expect(wallet.id).toBe('w1');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/wallet');
    expect(req.request.method).toBe('POST');
    req.flush(mockWallet);
  });
});
