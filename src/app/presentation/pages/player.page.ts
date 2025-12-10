import { Component } from '@angular/core';
import { Song } from '../../core/domain/entities/song';
import { SpotifyService } from '../../infrastructure/adapters/spotify-api.adapter';
import { PlaybackService } from '../../core/services/playback.service';

@Component({
  standalone: false,
  selector: 'app-player-page',
  template: `
    <!-- El reproductor está en LayoutComponent, esta página solo maneja la lógica -->
  `,
  styles: []
})
export class PlayerPage {
  selectedSong: Song | null = null;

  constructor(private spotify: SpotifyService, private playback: PlaybackService) {
    // Suscribirse a cambios de canción
    this.playback.current$().subscribe(song => {
      if(song) {
        this.selectedSong = song;
        this.fetchDetails(song);
      }
    });
  }

  onSelect(song: Song) {
    this.selectedSong = song;
    this.fetchDetails(song);
  }

  fetchDetails(song: Song) {
    // Llama al servicio para completar información desde Spotify
    this.spotify.getTrackByNameArtist(song.title, song.artist).subscribe({
      next: data => {
        // mapear a entidad Song (simplificado)
        if(data && data.tracks && data.tracks.items && data.tracks.items.length) {
          const t = data.tracks.items[0];
          this.selectedSong!.title = t.name;
          this.selectedSong!.artist = t.artists.map((a:any)=>a.name).join(', ');
          this.selectedSong!.album = t.album.name;
          this.selectedSong!.albumImage = t.album.images?.[0]?.url || '';
          this.selectedSong!.spotifyTrackId = t.id;
        }
      },
      error: err => console.error('Error fetching track', err)
    });
  }
}