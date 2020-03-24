import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { InfosComponent } from './core/infos/infos.component';
import { WelcomeComponent } from './core/welcome/welcome.component';


const routes: Routes = [
    {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full'
    },
    {
        path: 'welcome',
        component: WelcomeComponent
    },
    {
        path: 'infos',
        component: InfosComponent
    },
    {
        path: 'france',
        loadChildren: () => import('./france/france.module').then(mod => mod.FranceModule)
    },
    {
        path: 'global',
        loadChildren: () => import('./global/global.module').then(mod => mod.GlobalModule)
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
