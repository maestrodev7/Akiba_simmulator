import { Routes } from '@angular/router';
import { HomeLayout } from './shared/layout/home-layout/home-layout';

export const routes: Routes = [
    {
        path:"",
        component:HomeLayout,
        children:[
            { path:"",
                loadComponent:()=>import('./features/home/home').then(m=>m.Home),
                pathMatch: 'full'
             },
             {
                path:"votre-projet",
                loadComponent:()=>import('./features/simulator-form/simulator-form').then(m=>m.SimulatorForm)
             }
        ]
    },
    {
        path:"**",
        redirectTo:"",
        pathMatch:"full"
    },
];
