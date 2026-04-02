import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { projectData } from '../../interfaces/project-interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectData {
  private platformId = inject(PLATFORM_ID);
  private readonly SESSION_KEY = 'sd_session_data';
  private data: projectData = this.loadInitialData();

  setProjectData(data: projectData) {
    this.data = { ...this.data, ...data };
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(this.data));
    }
  }

  getProjectData(): projectData {
    return this.data;
  }

  clearDataRegistration(): void {
    this.data = {} as projectData;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.SESSION_KEY);
    }
  }

  private loadInitialData(): projectData {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.SESSION_KEY);
      console.log("saved storage", saved);
      return saved ? JSON.parse(saved) : ({} as projectData);
    }
    return {} as projectData;
  }
}
