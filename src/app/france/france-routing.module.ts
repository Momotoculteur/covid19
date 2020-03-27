import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FranceComponent } from './france.component';
import { MapComponent } from './map/map.component';
import { GraphiqueComponent } from './graphique/graphique.component';


const routes: Routes = [
  {
    path: '',
    component: FranceComponent,
    children: [
      {path: '', redirectTo: 'graphique', pathMatch: 'full'},
      {path: 'carte', component: MapComponent},
      {path: 'graphique', component: GraphiqueComponent}
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FranceRoutingModule { }
