import projectsData from './projects.json';

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  stack: string[];
  image?: string;
}

export const projects = projectsData.projects as Project[];