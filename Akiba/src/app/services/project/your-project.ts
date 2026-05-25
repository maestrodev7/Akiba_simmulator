import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DepositResponse,
  ProjectRecapResponse,
  TransactionResponse,
} from '../../interfaces/project-interface';


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

  depositMobile(payload: any): Observable<DepositResponse> {
    return this.http.post<DepositResponse>(`${environment.apiUrl}/payments/deposit`, payload);
  }

  depositCard(payload: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/payments/deposit/card`, payload);
  }

  checkTransactionStatus(reference: string): Observable<TransactionResponse> {
    return this.http.get<TransactionResponse>(`${environment.apiUrl}/transactions/reference/${reference}`);
  }

  getAmount(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/payments/amount`);
  }

  getProjectRecap(produitId: string): Observable<ProjectRecapResponse> {
    return this.http.get<ProjectRecapResponse>(
      `${environment.apiUrl}/simulator/draft/${produitId}/recap`
    );
  }

  updateAmount(amountXaf: number): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/payments/amount`, { amount: amountXaf });
  }

  getCurrencies(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/currencies`);
  }
}