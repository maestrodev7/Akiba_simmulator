import { Route, RouterModule } from "@angular/router";

import { FirstStep } from "./components/first-step/first-step";
import { FourthStep } from "./components/fourth-step/fourth-step";
import { SecondStep } from "./components/second-step/second-step";
import { ThirdStep } from "./components/third-step/third-step";
import { FifthStep } from "./components/fifth-step/fifth-step";
import { SixthStep } from "./components/sixth-step/sixth-step";
import { SimulatorForm } from "./simulator-form";

const routes: Route[] = [
    {
        path: "",
        component: SimulatorForm,
        children: [
            {
                path: "first-step",
                component: FirstStep,
            },
            {
                path: "",
                redirectTo: "first-step",
                pathMatch: "full"
            },
            {
                path: "second-step",
                component: SecondStep
            },
            {
                path: "third-step",
                component: ThirdStep
            },
            {
                path: "fourth-step",
                component: FourthStep
            },
            {
                path: "fifth-step",
                component: FifthStep,
            },
            {
                path: "sixth-step",
                component: SixthStep,
            },
        ]
    },
]

export const SimulatorRoutes = RouterModule.forChild(routes);