import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

interface Ipay {
  live: string;
  oid: string;
  inv: string;
  ttl: string;
  tel: string;
  eml: string;
  vid: string;
  curr: string;
  p1: string;
  p2: string;
  p3: string;
  p4: string;
  cbk: string;
  cst: string;
  crl: string;
  hsh: string;
}

@Injectable()
export class PaymentService {
  private paymentUrl = 'https://payments.ipayafrica.com/v3/ke';
  private hashidUrl = 'https://ipayafrica.com/hashid';
  private vendor = 'demo';
  private secretKey = 'demoCHANGED';

  constructor(private http: HttpClient) { }

  /* Retrieve hash */
  public getHash(dataStr: string) {
    const payload = `vendor=${this.vendor}&data=${dataStr}&key=${this.secretKey}`;

    console.log(`Hash payload is "${payload}"`);
    return this.http.post(this.hashidUrl, payload, { responseType: 'text' })
      .pipe(
        retry(3),
        catchError(this.handleError)
      ).toPromise();
  }

  /* Actual payment */
  public makePayment(data: Ipay) {
    const payload = `live=${data.live}&oid=${data.oid}&inv=${data.inv}&ttl=${data.ttl}&tel=${data.tel}&eml=${data.eml}&vid=${data.vid}&curr=${data.curr}&p1=${data.p1}&p2=${data.p2}&p3=${data.p3}&p4=${data.p4}&cbk=${data.cbk}&cst=${data.cst}&crl=${data.crl}&hsh=${data.hsh}`;

    console.log(payload);
    return this.http.post(this.paymentUrl, payload, { responseType: 'text'})
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  /* Error handler */
    private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error}`);
      console.log(error);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

}