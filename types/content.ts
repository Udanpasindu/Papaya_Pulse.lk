export interface FeatureItem {
  id: string;
  title: string;
  short: string;
  desc: string;
  image: string;
  accent: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface HomeContentDTO {
  title: string;
  description: string;
  features: FeatureItem[];
  stats: StatItem[];
  heroImage: string;
  gallery: string[];
}

export interface MethodologyItem {
  phase: string;
  desc: string;
}

export interface DomainContentDTO {
  literature: string[];
  researchGap: string[];
  problem: string;
  proposedSolution: string;
  researchApproach: string;
  systemArchitecture: string;
  objectives: string[];
  methodology: MethodologyItem[];
  technologies: string[];
}

export interface MilestoneDTO {
  _id?: string;
  title: string;
  date: string;
  description: string;
  marks: number;
  weight?: string;
  status?: "completed" | "in-progress" | "upcoming";
}

export interface DocumentDTO {
  _id?: string;
  title: string;
  fileUrl: string;
  mimeType?: string;
  category: string;
  size?: string;
  date?: string;
}

export interface PresentationDTO {
  _id?: string;
  title: string;
  fileUrl: string;
  type: string;
  date?: string;
  slides?: number;
}

export interface TeamMemberDTO {
  _id?: string;
  name: string;
  role: string;
  image: string;
  email: string;
  linkedin?: string;
  github?: string;
}

export interface ContactMessageDTO {
  _id?: string;
  name: string;
  email: string;
  message: string;
}
