import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Playlist } from '../../core/domain/entities/playlist';
import { Song } from '../../core/domain/entities/song';
import { PlaybackService } from '../../core/services/playback.service';

@Component({
  standalone: false,
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  playlist: Playlist = new Playlist();
  selected?: Song;

  constructor(private router: Router, private playback: PlaybackService) {}

  ngOnInit(): void {
    this.playback.playlist$().subscribe(songs => {
      if (songs && songs.length > 0) {
        this.playlist = new Playlist();
        this.playlist.songs = songs;
      }
    });

    this.playback.current$().subscribe(s => {
      if (!s) return;
      const found = this.playlist.songs?.find(
        p => p.title === s.title && p.artist === s.artist
      );
      if (found) this.selected = found;
    });
  }

  selectSong(s: Song): void {
    this.selected = s;
    this.playback.setCurrent(s);
  }

  goToSearch(): void {
    this.router.navigate(['/buscar']);
  }
}