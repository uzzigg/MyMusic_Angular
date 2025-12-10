import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifyService } from '../../infrastructure/adapters/spotify-api.adapter';
import { Playlist } from '../../core/domain/entities/playlist';
import { Song } from '../../core/domain/entities/song';
import { PlaybackService } from '../../core/services/playback.service';

@Component({
  standalone: false,
  selector: 'app-search-page',
  template: `
    <div style="flex:1;padding:20px 36px;">
      <app-search (selectSong)="onSelect($event)" (selectAlbum)="onSelectAlbum($event)" (selectArtist)="onSelectArtist($event)"></app-search>
    </div>
  `
})
export class SearchPage{
  playlist = new Playlist().staticPlaylist();
  constructor(private spotify: SpotifyService, private playback: PlaybackService, private router: Router){}

  onSelect(song: Song){

    if(song.albumId){
      this.spotify.getAlbumTracks(song.albumId, 50).subscribe({
        next: (res:any) => {
          const items = res.items || [];
          const tracks = items.map((t:any) => {
            const s = new Song();
            s.title = t.name;
            s.artist = (t.artists || []).map((a:any)=>a.name).join(', ');
            s.album = t.album?.name || song.album || '';
            s.albumImage = t.album?.images?.[0]?.url || song.albumImage || '';
            s.spotifyTrackId = t.id;
            return s;
          });
 
          this.playback.setPlaylist(tracks);

          const found = tracks.find((tr: Song) => tr.title === song.title && tr.artist === song.artist);
          const toPlay = found || tracks[0] || song;
          this.playback.setCurrent(toPlay);
          this.playback.play();
  
          this.router.navigate(['/player']);
        },
        error: err => {
          console.error('Error obteniendo pistas del álbum', err);

          this.playback.setCurrent(song);
          this.playback.play();
          this.router.navigate(['/player']);
        }
      });
    } else {

      this.playback.setCurrent(song);
      this.playback.play();
      this.router.navigate(['/player']);
    }
  }

  onSelectAlbum(album: any){
    if(!album || !album.id) return;
    this.spotify.getAlbumTracks(album.id, 50).subscribe({
      next: (res:any) => {
        const items = res.items || [];
        const tracks = items.map((t:any) => {
          const s = new Song();
          s.title = t.name;
          s.artist = (t.artists || []).map((a:any)=>a.name).join(', ');
          s.album = album.name || '';
          s.albumImage = album.images?.[0]?.url || '';
          s.spotifyTrackId = t.id;
          return s;
        });
        this.playback.setPlaylist(tracks);
        const toPlay = tracks[0] || null;
        if(toPlay) this.playback.setCurrent(toPlay);
        this.playback.play();
        this.router.navigate(['/player']);
      },
      error: err => {
        console.error('Error obteniendo pistas del álbum', err);
        this.playback.setCurrent(new Song());
        this.playback.play();
        this.router.navigate(['/player']);
      }
    });
  }

  onSelectArtist(artist: any){
    if(!artist || !artist.id) return;

    this.spotify.getArtistTopTracks(artist.id, 'US').subscribe({
      next: (res:any) => {
        const items = res.tracks || [];
        const tracks = items.map((t:any) => {
          const s = new Song();
          s.title = t.name;
          s.artist = (t.artists || []).map((a:any)=>a.name).join(', ');
          s.album = t.album?.name || '';
          s.albumImage = t.album?.images?.[0]?.url || '';
          s.spotifyTrackId = t.id;
          return s;
        });
        this.playback.setPlaylist(tracks);
        const toPlay = tracks[0] || null;
        if(toPlay) this.playback.setCurrent(toPlay);
        this.playback.play();
        this.router.navigate(['/player']);
      },
      error: err => {
        console.error('Error obteniendo top tracks del artista', err);
        this.playback.setCurrent(new Song());
        this.playback.play();
        this.router.navigate(['/player']);
      }
    });
  }
}
