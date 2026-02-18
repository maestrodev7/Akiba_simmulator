import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../components/footer/footer';
import { NavBar } from "../../components/nav-bar/nav-bar";

@Component({
  selector: 'app-home-layout',
  imports: [RouterOutlet, NavBar, Footer],
  templateUrl: './home-layout.html',
  styleUrl: './home-layout.css',
})
export class HomeLayout {

}
