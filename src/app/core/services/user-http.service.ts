import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/auth.models';
import { ProfileUpdateRequest } from '../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/user';

  getProfile(): Observable<User> {
    return this.http.get<User>(this.baseUrl);
  }

  updateProfile(data: ProfileUpdateRequest): Observable<User> {
    return this.http.put<User>(this.baseUrl, data);
  }

  deleteProfile(): Observable<void> {
    return this.http.delete<void>(this.baseUrl);
  }
}
