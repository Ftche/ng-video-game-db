import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import {APIResponse, Game} from '../models';
import {environment} from '../../environments/environment.prod';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getGamelist(ordering: string, search?: string): Observable<APIResponse<Game>> {
    let params = new HttpParams().set('ordering', ordering);

    if (search){
      params = new HttpParams().set('ordering', ordering).set('search', search);
    }
    return this.http.get<APIResponse<Game>>(`${environment.BASE_URL}/games`,
      {
        params,
      });
  }

  getGameDetails(id: string): Observable<Game> {
    const gameInfoRequest = this.http.get(`${environment.BASE_URL}/games/${id}`);
    const gameTrailersRequest = this.http.get(
      `${environment.BASE_URL}/games/${id}/movies`
    );
    const gameScreenshotsRequest = this.http.get(
      `${environment.BASE_URL}/games/${id}/screenshots`
    );

    return forkJoin({
      gameInfoRequest,
      gameScreenshotsRequest,
      gameTrailersRequest,
    }).pipe(
      map((resp: any) => {
        return {
          ...resp['gameInfoRequest'],
          screenshots: resp['gameScreenshotsRequest']?.results,
          trailers: resp['gameTrailersRequest']?.results,
        };
      })
    );
  }
}
