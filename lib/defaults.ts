import type {
  DomainContentDTO,
  HomeContentDTO,
  MilestoneDTO,
  DocumentDTO,
  PresentationDTO,
  TeamMemberDTO,
} from "@/types/content";

export const DEFAULT_HOME: HomeContentDTO = {
  title: "PapayaPulse",
  description:
    "PapayaPulse is an AI-powered research framework that combines computer vision, machine learning, and agronomy to revolutionize papaya cultivation - from quality grading and disease diagnosis to growth forecasting and market price prediction.",
  heroImage: "/assets/hero-papaya.jpg",
  gallery: [
    "/assets/hero-papaya.jpg",
    "/assets/module-quality.jpg",
    "/assets/module-growth.jpg",
    "/assets/module-disease.jpg",
  ],
  stats: [
    { value: "98%", label: "Grading Accuracy" },
    { value: "12k+", label: "Image Samples" },
    { value: "4", label: "Core Modules" },
    { value: "24/7", label: "Field Monitoring" },
  ],
  features: [
    {
      id: "quality",
      title: "Quality Grading",
      short: "AI Vision",
      desc: "Computer vision models grade harvested papayas by ripeness, size, surface quality and export class.",
      image: "/assets/module-quality.jpg",
      accent: "from-emerald-400/30 to-emerald-500/5",
    },
    {
      id: "growth",
      title: "Growth & Harvest Prediction",
      short: "ML Models",
      desc: "Time-series and environmental ML models forecast plant growth stages and optimal harvest windows.",
      image: "/assets/module-growth.jpg",
      accent: "from-lime-400/30 to-lime-500/5",
    },
    {
      id: "disease",
      title: "Disease Detection",
      short: "Deep Learning",
      desc: "CNN-based detection of common papaya diseases with severity scoring and treatment recommendations.",
      image: "/assets/module-disease.jpg",
      accent: "from-red-400/30 to-amber-500/5",
    },
    {
      id: "market",
      title: "Market Price Prediction",
      short: "Forecasting",
      desc: "Hybrid forecasting model combining historical prices, weather and supply data to project market value.",
      image: "/assets/module-market.jpg",
      accent: "from-yellow-400/30 to-yellow-500/5",
    },
  ],
};

export const DEFAULT_DOMAIN: DomainContentDTO = {
  literature: [
    "Reviewed 40+ peer-reviewed papers on agricultural AI, with focus on tropical fruit cultivation.",
    "Surveyed CNN architectures (ResNet, EfficientNet) used in fruit grading research.",
    "Analyzed prior work on plant disease detection using transfer learning.",
    "Studied LSTM and Prophet models for crop yield and price forecasting.",
  ],
  researchGap: [
    "Existing studies treat quality, disease, growth and price as isolated problems.",
    "Few works specifically target papaya - most focus on apple, tomato or grape.",
    "No unified mobile-first framework integrates all four modules for smallholder farmers.",
    "Limited region-specific datasets for South Asian papaya cultivars.",
  ],
  problem:
    "How can an integrated AI framework empower papaya farmers with real-time quality grading, disease detection, growth forecasting and market price prediction through a single accessible platform?",
  proposedSolution:
    "PapayaPulse combines vision-based grading, disease detection, predictive analytics and farmer-friendly guidance into one research platform with explainable results and mobile-first access.",
  researchApproach:
    "The project uses a mixed-method approach that combines field surveys, dataset collection, model training, and iterative validation with the target users and supervisors.",
  systemArchitecture:
    "Images and field data flow through preprocessing and AI inference services before being surfaced in a research dashboard that supports analysis, documentation and decision making.",
  objectives: [
    "Develop a high-accuracy CNN model for visual papaya quality grading.",
    "Build a robust disease detection system covering at least 6 common papaya diseases.",
    "Design a growth prediction model using environmental and image-based features.",
    "Implement a market price forecasting model using historical and macroeconomic indicators.",
    "Integrate all modules into a unified, mobile-first platform for farmers.",
  ],
  methodology: [
    { phase: "Data Collection", desc: "Field imagery, sensor logs and market price data gathered across 6 farms." },
    { phase: "Pre-processing", desc: "Image augmentation, normalization, missing-value handling and feature engineering." },
    { phase: "Model Training", desc: "Transfer learning on EfficientNet for vision tasks, LSTM for time-series." },
    { phase: "Evaluation", desc: "Cross-validation, F1, RMSE and farmer-in-the-loop usability testing." },
    { phase: "Deployment", desc: "Edge inference on mobile + cloud APIs for heavier prediction workloads." },
  ],
  technologies: [
    "Python",
    "TensorFlow",
    "PyTorch",
    "OpenCV",
    "FastAPI",
    "React",
    "TypeScript",
    "PostgreSQL",
    "Docker",
    "AWS",
    "Edge TPU",
    "Prophet",
  ],
};

export const DEFAULT_MILESTONES: MilestoneDTO[] = [
  {
    title: "Project Proposal",
    date: "2025-02-12",
    description: "Initial project scope, problem statement, and proposed AI-driven framework defended to the panel.",
    marks: 12,
    weight: "12%",
    status: "completed",
  },
  {
    title: "Progress Presentation 1",
    date: "2025-05-20",
    description: "Demonstrated baseline quality grading model and dataset collection methodology.",
    marks: 14,
    weight: "15%",
    status: "completed",
  },
  {
    title: "Progress Presentation 2",
    date: "2025-09-08",
    description: "Integrated disease detection, growth prediction modules and end-to-end framework prototype.",
    marks: 18,
    weight: "20%",
    status: "in-progress",
  },
  {
    title: "Final Assessment",
    date: "2025-12-15",
    description: "Final implementation evaluation including all four modules and full system documentation.",
    marks: 0,
    weight: "30%",
    status: "upcoming",
  },
  {
    title: "Viva",
    date: "2026-01-20",
    description: "Final oral examination and live system demonstration to the evaluation panel.",
    marks: 0,
    weight: "23%",
    status: "upcoming",
  },
];

export const DEFAULT_DOCUMENTS: DocumentDTO[] = [
  { title: "Project Charter", category: "Charter", fileUrl: "", size: "1.2 MB", date: "2025-01-30" },
  { title: "Proposal Document", category: "Proposal", fileUrl: "", size: "3.8 MB", date: "2025-02-12" },
  { title: "Progress Report 1", category: "Progress", fileUrl: "", size: "2.4 MB", date: "2025-05-20" },
  { title: "Progress Report 2", category: "Progress", fileUrl: "", size: "3.1 MB", date: "2025-09-08" },
  { title: "Final Thesis Draft", category: "Final", fileUrl: "", size: "8.6 MB", date: "2025-12-01" },
  { title: "Dilshan - Individual Report", category: "Member Report", fileUrl: "", size: "2.1 MB" },
  { title: "Sanduni - Individual Report", category: "Member Report", fileUrl: "", size: "2.0 MB" },
  { title: "Kavindu - Individual Report", category: "Member Report", fileUrl: "", size: "2.3 MB" },
  { title: "Nimesha - Individual Report", category: "Member Report", fileUrl: "", size: "2.2 MB" },
];

export const DEFAULT_PRESENTATIONS: PresentationDTO[] = [
  { title: "Project Proposal", type: "Proposal", date: "2025-02-12", fileUrl: "", slides: 24 },
  { title: "Progress Presentation 1", type: "Progress", date: "2025-05-20", fileUrl: "", slides: 32 },
  { title: "Progress Presentation 2", type: "Progress", date: "2025-09-08", fileUrl: "", slides: 38 },
  { title: "Final Presentation", type: "Final", date: "2025-12-15", fileUrl: "", slides: 48 },
];

export const DEFAULT_TEAM: TeamMemberDTO[] = [
  { name: "Dilshan Perera", role: "Quality Grading Lead", email: "dilshan@papayapulse.lk", image: "/assets/team-1.jpg" },
  { name: "Sanduni Fernando", role: "Growth Prediction Lead", email: "sanduni@papayapulse.lk", image: "/assets/team-2.jpg" },
  { name: "Kavindu Jayasekara", role: "Disease Detection Lead", email: "kavindu@papayapulse.lk", image: "/assets/team-3.jpg" },
  { name: "Nimesha Silva", role: "Market Forecasting Lead", email: "nimesha@papayapulse.lk", image: "/assets/team-4.jpg" },
  { name: "Dr. Ranjith Bandara", role: "Principal Supervisor", email: "r.bandara@university.edu", image: "/assets/supervisor-1.jpg" },
  { name: "Dr. Anushka Wijesinghe", role: "Co-Supervisor", email: "a.wije@university.edu", image: "/assets/supervisor-2.jpg" },
];
