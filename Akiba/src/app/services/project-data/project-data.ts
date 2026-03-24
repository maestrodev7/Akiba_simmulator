import { Injectable } from '@angular/core';
import { projectData } from '../../interfaces/project-interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectData {
 
  private readonly SESSION_KEY = 'sd_session_data'; 
  private data: projectData = this.loadInitialData();

  setProjectData(data: projectData) {
    this.data = { ...this.data, ...data };
    // On enregistre dans la session de l'onglet
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(this.data));
  }

  getProjectData(): projectData {
    return this.data;
  }

  clearDataRegistration(): void {
    this.data = {} as projectData;
    localStorage.removeItem(this.SESSION_KEY);
  }

  private loadInitialData(): projectData {
    const saved = sessionStorage.getItem(this.SESSION_KEY);
    return saved ? JSON.parse(saved) : ({} as projectData);
  }
}
