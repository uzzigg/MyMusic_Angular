import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Song } from '../domain/entities/song';

@Injectable({ providedIn: 'root' })
export class PlaybackService {
  private _current = new BehaviorSubject<Song | null>(null);
  private _playing = new BehaviorSubject<boolean>(false);

  private playlist: Song[] = [];
  private currentIndex = -1;
  private _playlistSubject: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);

  current$(): Observable<Song | null> {
    return this._current.asObservable();
  }

  playing$(): Observable<boolean> {
    return this._playing.asObservable();
  }

  setPlaylist(songs: Song[]){
    this.playlist = songs || [];
    if(this.playlist.length && this.currentIndex < 0){
      this.currentIndex = 0;
      this.setCurrent(this.playlist[0]);
    }
    this._playlistSubject.next(this.playlist);
  }

  getPlaylist(): Song[]{
    return this.playlist;
  }

  playlist$(): Observable<Song[]>{
    return this._playlistSubject.asObservable();
  }

  setCurrent(song: Song | null){
    if(song && this.playlist && this.playlist.length){
      const idx = this.playlist.findIndex(s => s.title === song.title && s.artist === song.artist);
      if(idx >= 0) this.currentIndex = idx;
    }
    this._current.next(song);
  }

  getCurrent(): Song | null {
    return this._current.getValue();
  }

  play(){
    this._playing.next(true);
  }

  pause(){
    this._playing.next(false);
  }

  togglePlay(){
    this._playing.next(!this._playing.getValue());
  }

  next(){
    if(!this.playlist || !this.playlist.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    this.setCurrent(this.playlist[this.currentIndex]);
    this.play();
  }

  prev(){
    if(!this.playlist || !this.playlist.length) return;
    this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    this.setCurrent(this.playlist[this.currentIndex]);
    this.play();
  }
}
