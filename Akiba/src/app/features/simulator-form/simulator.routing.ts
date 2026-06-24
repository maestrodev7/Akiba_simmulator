import { Route, RouterModule } from "@angular/router";
import { SimulatorForm } from "./simulator-form";

const routes: Route[] = [
    {
        path: "",
        component: SimulatorForm,
        children: [
            {
                path: "first-step",
                loadComponent: () => import('./components/first-step/first-step').then(m => m.FirstStep),
            },
            {
                path: "",
                redirectTo: "first-step",
                pathMatch: "full"
            },
            {
                path: "second-step",
                loadComponent: () => import('./components/second-step/second-step').then(m => m.SecondStep)
            },
            {
                path: "second-step-part-two",
                loadComponent: () => import('./components/second-step-part-two/second-step-part-two').then(m => m.SecondStepPartTwo)
            },
            {
                path: "third-step",
                loadComponent: () => import('./components/third-step/third-step').then(m => m.ThirdStep)
            },
            {
                path: "fourth-step",
                loadComponent: () => import('./components/fourth-step/fourth-step').then(m => m.FourthStep)
            },
            {
                path: "fifth-step",
                loadComponent: () => import('./components/fifth-step/fifth-step').then(m => m.FifthStep),
            },
            {
                path: "sixth-step",
                loadComponent: () => import('./components/sixth-step/sixth-step').then(m => m.SixthStep),
            },
            {
                path: "payment-step",
                loadComponent: () => import('./components/payment-step/payment-step').then(m => m.PaymentStep),
            },
        ]
    },
]

export const SimulatorRoutes = RouterModule.forChild(routes);
