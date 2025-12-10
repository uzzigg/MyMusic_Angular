import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Playlist } from '../../core/domain/entities/playlist';
import { PlaybackService } from '../../core/services/playback.service';
import { Song } from '../../core/domain/entities/song';

@Component({
  standalone: false,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  playlist: Playlist;
  isSearchActive = false;

  constructor(
    private playback: PlaybackService,
    private router: Router
  ) {

    this.isSearchActive = this.router.url.includes('buscar');
    

    const createSong = (title: string, artist: string): Song => {
      const song = new Song();
      song.title = title;
      song.artist = artist;
      song.album = "Aquel Que Había Muerto";
      return song;
    };


    const vicoSongs: Song[] = [
      createSong("Aquel que había muerto", "Vico C, Funky & 7th Poet"),
      createSong("Calla", "Vico C & Funky"),
      createSong("Quieren", "Vico C"),
      createSong("Donde comienzan las guerras", "Vico C"),
      createSong("Careta", "Vico C & Funky")
    ];


    this.playlist = new Playlist().staticFromArray(vicoSongs.map(s => ({
        title: s.title,
        artist: s.artist,
        album: s.album
    })));
    
    this.playlist.songs = vicoSongs;
    


    this.playback.setPlaylist(this.playlist.songs);


    const songToStart = createSong("Explosión", "Vico C");
    if(songToStart) this.playback.setCurrent(songToStart);


    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isSearchActive = event.urlAfterRedirects.includes('buscar');
        console.log('isSearchActive:', this.isSearchActive, 'URL:', event.urlAfterRedirects);
      }
    });
  }
}