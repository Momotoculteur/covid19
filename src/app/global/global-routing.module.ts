import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GlobalComponent } from './global.component';
import { MapComponent } from './map/map.component';


const routes: Routes = [
    {
        path: '',
        component: GlobalComponent,
        children: [
            {path: '', redirectTo: 'carte', pathMatch: 'full'},
            {path: 'carte', component: MapComponent}
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlobalRoutingModule { }
