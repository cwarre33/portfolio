export interface Certification {
  name: string;
  issuer?: string;
}

export const certifications: Certification[] = [
  { name: 'AWS Academy Graduate — Cloud Foundations', issuer: 'AWS' },
  { name: 'Introduction to LangGraph', issuer: 'LangChain' },
  { name: 'Data and Programming Foundations for AI', issuer: 'Codecademy' },
  { name: 'Build a Website with HTML, CSS, and GitHub Pages', issuer: 'Codecademy' },
  { name: 'Learn Java', issuer: 'Codecademy' },
];

export const education = 'B.S. Computer Science — UNC Charlotte (Dec 2025)';
