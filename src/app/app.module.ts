import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PlayerPage } from './presentation/pages/player.page';
import { SearchPage } from './presentation/pages/search.page';
import { PlayerComponent } from './presentation/components/player.component';
import { PlaylistComponent } from './presentation/components/playlist.component';
import { SearchComponent } from './presentation/components/search.component';
import { LayoutComponent } from './presentation/components/layout.component';

const routes: Routes = [
  { path: '', redirectTo: 'player', pathMatch: 'full' },
  { path: 'player', component: PlayerPage },
  { path: 'buscar', component: SearchPage }
];

@NgModule({
  declarations: [
    AppComponent,
    PlayerPage,
    SearchPage,
    PlayerComponent,
    PlaylistComponent,
    SearchComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
