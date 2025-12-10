import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { from, Observable, of, switchMap, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SpotifyService {
  private token: string | null = null;
  private tokenExpiry = 0;

  constructor(private http: HttpClient){}


  private fetchToken(): Observable<any>{
    if(this.token && Date.now() < this.tokenExpiry) return of({access_token: this.token});
    const url = 'https://accounts.spotify.com/api/token';
    const body = new HttpParams({ fromObject: { grant_type: 'client_credentials' } });
    const creds = btoa(`${environment.spotify.clientId}:${environment.spotify.clientSecret}`);
    const headers = new HttpHeaders({
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post(url, body.toString(), { headers }).pipe(map((res:any)=>{
      this.token = res.access_token;
      this.tokenExpiry = Date.now() + (res.expires_in || 3600) * 1000;
      return res;
    }));
  }

  private authHeaders(){
    return new HttpHeaders({ Authorization: `Bearer ${this.token}` });
  }

  search(q: string, type: string = 'track'): Observable<any>{
    return this.fetchToken().pipe(
      switchMap(()=> this.http.get('https://api.spotify.com/v1/search', {
        headers: this.authHeaders(),
        params: new HttpParams({ fromObject: { q, type, limit: '20' } })
      }))
    );
  }


  getTrackByNameArtist(name: string, artist: string){
    const q = `${name} ${artist}`;
    return this.search(q, 'track');
  }

  getAlbumTracks(albumId: string, limit: number = 50){
    return this.fetchToken().pipe(
      switchMap(()=> this.http.get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
        headers: this.authHeaders(),
        params: new HttpParams({ fromObject: { limit: String(limit) } })
      }))
    );
  }

  getArtistTopTracks(artistId: string, country: string = 'US'){
    return this.fetchToken().pipe(
      switchMap(()=> this.http.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks`, {
        headers: this.authHeaders(),
        params: new HttpParams({ fromObject: { country } })
      }))
    );
  }

}
