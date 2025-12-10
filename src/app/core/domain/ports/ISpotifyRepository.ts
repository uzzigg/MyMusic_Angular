import { Observable } from 'rxjs';

export interface ISpotifyRepository {
  getAccessToken(): Observable<any>;
  search(q: string, type?: string): Observable<any>;
  getTrackById(id: string): Observable<any>;
  getArtistById(id: string): Observable<any>;
}
