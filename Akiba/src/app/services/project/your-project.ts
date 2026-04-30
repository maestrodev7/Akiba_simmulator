import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class YourProject {
  private http = inject(HttpClient);

  saveStepDraft(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/simulator/draft/save-step`, data);
  }

  saveStepTwoDraft(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/simulator/draft/save-step`, data);
  }

  getPieces(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/pieces`);
  }

  createPiece(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/pieces`, data);
  }

  depositMobile(payload: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/payments/deposit`, payload);
  }

  depositCard(payload: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/payments/deposit/card`, payload);
  }
}