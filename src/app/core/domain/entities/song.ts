export class Song {
  title = '';
  artist = '';
  album = '';
  albumImage = '';
  albumId?: string;
  spotifyTrackId?: string;

  // Método de dominio: devuelve texto resumen
  resumen(): string {
    return `${this.title} — ${this.artist} (${this.album})`;
  }
}
