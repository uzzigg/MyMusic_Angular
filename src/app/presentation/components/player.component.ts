import { Component, Input, OnInit } from '@angular/core';
import { Song } from '../../core/domain/entities/song';
import { PlaybackService } from '../../core/services/playback.service';

@Component({
  standalone: false,
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  song?: Song | null;
  defaultImg = 'https://via.placeholder.com/500x500.png?text=Album';
  isPlaying = false;

  constructor(private playback: PlaybackService) {
    this.playback.playing$().subscribe(p => this.isPlaying = p);
  }

  ngOnInit(): void {
    this.playback.current$().subscribe(s => {
      this.song = s;
    });
  }

  toggle() {
    this.playback.togglePlay();
  }

  next() {
    this.playback.next();
  }

  prev() {
    this.playback.prev();
  }
} 