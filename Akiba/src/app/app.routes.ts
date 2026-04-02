import { Routes } from '@angular/router';
import { HomeLayout } from './shared/layout/home-layout/home-layout';

export const routes: Routes = [
    {
        path: "",
        component: HomeLayout,
        children: [
            {
                path: "",
                loadComponent: () => import('./features/home/home').then(m => m.Home),
                pathMatch: 'full'
            },
            {
                path: "votre-projet",
                loadChildren: () => import('./features/simulator-form/simulator.module').then(m => m.SimulatorModule)
            }
        ]
    },
    {
        path: "**",
        redirectTo: "",
        pathMatch: "full"
    },
];
