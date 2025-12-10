import { Song } from './song';

export class Playlist {
  name = 'Reproducción automática';
  songs: Song[] = [];

  staticFromArray(arr:any[]): Playlist {
    const p = new Playlist();
    p.songs = arr.map(a => {
      const s = new Song();
      s.title = a.title; s.artist = a.artist; s.album = a.album || '';
      return s;
    });
    return p;
  }

  // Playlist estática 
  staticPlaylist(): Playlist {
    const p = new Playlist();
    p.songs = [
      (():Song=>{const s=new Song();s.title='The Color Violet';s.artist='Tory Lanez';return s})(),
      (():Song=>{const s=new Song();s.title='Snooze';s.artist='SZA';return s})(),
      (():Song=>{const s=new Song();s.title='Frances Limon';s.artist='Los Enanitos Verdes';return s})(),
      (():Song=>{const s=new Song();s.title='Todo Y Nada';s.artist='Luis Miguel';return s})(),
      (():Song=>{const s=new Song();s.title='No digas nada';s.artist='LATIN MAFIA';return s})(),
    ];
    return p;
  }
}
