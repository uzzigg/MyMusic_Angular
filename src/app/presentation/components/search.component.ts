import { Component, Output, EventEmitter } from '@angular/core';
import { SpotifyService } from '../../infrastructure/adapters/spotify-api.adapter';
import { Song } from '../../core/domain/entities/song';
import { PlaybackService } from '../../core/services/playback.service';

@Component({
  standalone: false,
  selector: 'app-search',
  template: `
    <div>
      <div class="search-bar" style="display:flex;gap:0.5rem;align-items:center;">
        <input [(ngModel)]="q" 
               (keydown.enter)="buscar()"
               placeholder="Buscar artista, álbum o canción..." 
               style="flex:1;padding:10px;border-radius:8px;border:1px solid rgba(0,0,0,0.08)"/>
        <button (click)="buscar()" class="search-button" title="Buscar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
      </div>

      <div class="search-results" style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:1rem;">

        <section *ngIf="tracks?.length">
          <h3 style="margin:0 0 0.5rem 0;">Canciones</h3>
          <div style="display:flex;flex-direction:column;gap:0.5rem;max-height:60vh;overflow:auto;padding-right:0.25rem;">
            <div *ngFor="let t of tracks" class="card-result" (click)="selectTrack(t)" [class.selected]="isSelected(t)" style="display:flex;gap:0.75rem;align-items:center;padding:0.5rem;border-radius:8px;cursor:pointer;border:1px solid transparent;">
              <img [src]="t.album?.images?.[0]?.url || placeholder" [alt]="t.name" style="width:50px;height:50px;border-radius:8px;object-fit:cover;flex-shrink:0;"/>
              <div>
                <div style="font-weight:600">{{ t.name }}</div>
                <div style="font-size:12px;color:#6b6f7a;">{{ formatArtists(t.artists) }} • {{ t.album?.name }}</div>
              </div>
            </div>
          </div>
        </section>

        <section *ngIf="albums?.length">
          <h3 style="margin:0 0 0.5rem 0;">Álbumes</h3>
          <div style="display:flex;flex-direction:column;gap:0.5rem;max-height:60vh;overflow:auto;padding-right:0.25rem;">
            <div *ngFor="let a of albums" class="card-result" (click)="selectAlbumItem(a)" style="display:flex;gap:0.75rem;align-items:center;padding:0.5rem;border-radius:8px;cursor:pointer;border:1px solid transparent;">
              <img [src]="a.images?.[0]?.url || placeholder" [alt]="a.name" style="width:50px;height:50px;border-radius:8px;object-fit:cover;flex-shrink:0;"/>
              <div>
                <div style="font-weight:600">{{ a.name }}</div>
                <div style="font-size:12px;color:#6b6f7a;">{{ formatArtists(a.artists) }}</div>
              </div>
            </div>
          </div>
        </section>

        <section *ngIf="artists?.length">
          <h3 style="margin:0 0 0.5rem 0;">Artistas</h3>
          <div style="display:flex;flex-direction:column;gap:0.5rem;max-height:60vh;overflow:auto;padding-right:0.25rem;">
            <div *ngFor="let ar of artists" class="card-result" (click)="selectArtistItem(ar)" style="display:flex;gap:0.75rem;align-items:center;padding:0.5rem;border-radius:8px;cursor:pointer;border:1px solid transparent;">
              <img [src]="ar.images?.[0]?.url || placeholder" [alt]="ar.name" style="width:50px;height:50px;border-radius:50%;object-fit:cover;flex-shrink:0;"/>
              <div>
                <div style="font-weight:600">{{ ar.name }}</div>
                <div style="font-size:12px;color:#6b6f7a;">Artista • {{ ar.followers?.total ? (ar.followers.total | number) : '' }}</div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  `
})
export class SearchComponent{
  q = '';
  tracks: any[] = [];
  albums: any[] = [];
  artists: any[] = [];

  placeholder = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='100%25' height='100%25' fill='%23E5E7EB'/><text x='50%25' y='50%25' dy='.35em' text-anchor='middle' font-family='Poppins, Arial' font-size='12' fill='%236b7280'>Album</text></svg>`;
  @Output() selectSong = new EventEmitter<Song>();
  @Output() selectAlbum = new EventEmitter<any>();
  @Output() selectArtist = new EventEmitter<any>();
  selectedSong?: Song | null = null;

  constructor(private spotify: SpotifyService, private playback: PlaybackService){}

  ngOnInit(): void{
    this.playback.current$().subscribe(s => this.selectedSong = s);
  }

  formatArtists(artists: any[] | undefined) {
    if (!artists || !artists.length) return '';
    return artists.map(a => a.name).join(', ');
  }

  buscar(){
    if(!this.q) return;

    this.spotify.search(this.q, 'track,album,artist').subscribe({
      next: (res:any) => {
        this.tracks = res.tracks?.items || [];
        this.albums = res.albums?.items || [];
        this.artists = res.artists?.items || [];
      },
      error: (err:any) => {
        console.error(err);
        this.tracks = [];
        this.albums = [];
        this.artists = [];
      }
    });
  }

  selectTrack(r:any){
    const song = new Song();
    song.title = r.name;
    song.artist = (r.artists || []).map((a:any)=>a.name).join(', ');
    song.album = r.album?.name;
    song.albumImage = r.album?.images?.[0]?.url;
    song.albumId = r.album?.id;
    song.spotifyTrackId = r.id;
    this.selectSong.emit(song);
    this.playback.setCurrent(song);
  }

  selectAlbumItem(a:any){
    this.selectAlbum.emit(a);
  }

  selectArtistItem(ar:any){
    this.selectArtist.emit(ar);
  }

  isSelected(r:any){
    if(!this.selectedSong) return false;
    const artists = (r.artists || []).map((a:any)=>a.name).join(', ');
    return r.name === this.selectedSong.title && artists === this.selectedSong.artist;
  }
}
