import heroImg from "@/assets/hero-papaya.jpg";
import qualityImg from "@/assets/module-quality.jpg";
import growthImg from "@/assets/module-growth.jpg";
import diseaseImg from "@/assets/module-disease.jpg";
import marketImg from "@/assets/module-market.jpg";
import team1 from "@/assets/team-1.jpg";
import team2 from "@/assets/team-2.jpg";
import team3 from "@/assets/team-3.jpg";
import team4 from "@/assets/team-4.jpg";
import sup1 from "@/assets/supervisor-1.jpg";
import sup2 from "@/assets/supervisor-2.jpg";

export const SITE = {
  name: "PapayaPulse",
  tagline: "Smart Farming Framework for Data-driven Papaya Cultivation",
  abstract:
    "PapayaPulse is an AI-powered research framework that combines computer vision, machine learning, and agronomy to revolutionize papaya cultivation — from quality grading and disease diagnosis to growth forecasting and market price prediction.",
  hero: heroImg,
};

export const MODULES = [
  {
    id: "quality",
    title: "Quality Grading",
    short: "AI Vision",
    desc: "Computer vision models grade harvested papayas by ripeness, size, surface quality and export class.",
    image: qualityImg,
    accent: "from-emerald-400/30 to-emerald-500/5",
  },
  {
    id: "growth",
    title: "Growth & Harvest Prediction",
    short: "ML Models",
    desc: "Time-series and environmental ML models forecast plant growth stages and optimal harvest windows.",
    image: growthImg,
    accent: "from-lime-400/30 to-lime-500/5",
  },
  {
    id: "disease",
    title: "Disease Detection",
    short: "Deep Learning",
    desc: "CNN-based detection of common papaya diseases with severity scoring and treatment recommendations.",
    image: diseaseImg,
    accent: "from-red-400/30 to-amber-500/5",
  },
  {
    id: "market",
    title: "Market Price Prediction",
    short: "Forecasting",
    desc: "Hybrid forecasting model combining historical prices, weather and supply data to project market value.",
    image: marketImg,
    accent: "from-yellow-400/30 to-yellow-500/5",
  },
];

export const STATS = [
  { value: "98%", label: "Grading Accuracy" },
  { value: "12k+", label: "Image Samples" },
  { value: "4", label: "Core Modules" },
  { value: "24/7", label: "Field Monitoring" },
];

export const TEAM = [
  { name: "Dilshan Perera", role: "Quality Grading Lead", email: "dilshan@papayapulse.lk", image: team1 },
  { name: "Sanduni Fernando", role: "Growth Prediction Lead", email: "sanduni@papayapulse.lk", image: team2 },
  { name: "Kavindu Jayasekara", role: "Disease Detection Lead", email: "kavindu@papayapulse.lk", image: team3 },
  { name: "Nimesha Silva", role: "Market Forecasting Lead", email: "nimesha@papayapulse.lk", image: team4 },
];

export const SUPERVISORS = [
  { name: "Dr. Ranjith Bandara", role: "Principal Supervisor", email: "r.bandara@university.edu", image: sup1 },
  { name: "Dr. Anushka Wijesinghe", role: "Co-Supervisor", email: "a.wije@university.edu", image: sup2 },
];

export const MILESTONES = [
  {
    id: "proposal",
    title: "Project Proposal",
    date: "2025-02-12",
    description: "Initial project scope, problem statement, and proposed AI-driven framework defended to the panel.",
    marks: 12,
    weight: "12%",
    status: "completed",
  },
  {
    id: "pp1",
    title: "Progress Presentation 1",
    date: "2025-05-20",
    description: "Demonstrated baseline quality grading model and dataset collection methodology.",
    marks: 14,
    weight: "15%",
    status: "completed",
  },
  {
    id: "pp2",
    title: "Progress Presentation 2",
    date: "2025-09-08",
    description: "Integrated disease detection, growth prediction modules and end-to-end framework prototype.",
    marks: 18,
    weight: "20%",
    status: "in-progress",
  },
  {
    id: "final",
    title: "Final Assessment",
    date: "2025-12-15",
    description: "Final implementation evaluation including all four modules and full system documentation.",
    marks: 0,
    weight: "30%",
    status: "upcoming",
  },
  {
    id: "viva",
    title: "Viva",
    date: "2026-01-20",
    description: "Final oral examination and live system demonstration to the evaluation panel.",
    marks: 0,
    weight: "23%",
    status: "upcoming",
  },
];

export const DOMAIN = {
  literature: [
    "Reviewed 40+ peer-reviewed papers on agricultural AI, with focus on tropical fruit cultivation.",
    "Surveyed CNN architectures (ResNet, EfficientNet) used in fruit grading research.",
    "Analyzed prior work on plant disease detection using transfer learning.",
    "Studied LSTM and Prophet models for crop yield and price forecasting.",
  ],
  gap: [
    "Existing studies treat quality, disease, growth and price as isolated problems.",
    "Few works specifically target papaya — most focus on apple, tomato or grape.",
    "No unified mobile-first framework integrates all four modules for smallholder farmers.",
    "Limited region-specific datasets for South Asian papaya cultivars.",
  ],
  problem:
    "How can an integrated AI framework empower papaya farmers with real-time quality grading, disease detection, growth forecasting and market price prediction through a single accessible platform?",
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
    "Python", "TensorFlow", "PyTorch", "OpenCV", "FastAPI", "React", "TypeScript",
    "PostgreSQL", "Docker", "AWS", "Edge TPU", "Prophet",
  ],
};

export const DOCUMENTS = {
  charter: [{ name: "Project Charter", size: "1.2 MB", date: "2025-01-30" }],
  proposal: [{ name: "Proposal Document", size: "3.8 MB", date: "2025-02-12" }],
  progress: [
    { name: "Progress Report 1", size: "2.4 MB", date: "2025-05-20" },
    { name: "Progress Report 2", size: "3.1 MB", date: "2025-09-08" },
  ],
  final: [{ name: "Final Thesis Draft", size: "8.6 MB", date: "2025-12-01" }],
  members: [
    { name: "Dilshan — Individual Report", size: "2.1 MB", member: "Dilshan Perera" },
    { name: "Sanduni — Individual Report", size: "2.0 MB", member: "Sanduni Fernando" },
    { name: "Kavindu — Individual Report", size: "2.3 MB", member: "Kavindu Jayasekara" },
    { name: "Nimesha — Individual Report", size: "2.2 MB", member: "Nimesha Silva" },
  ],
};

export const PRESENTATIONS = [
  { id: "proposal", title: "Project Proposal", date: "2025-02-12", slides: 24 },
  { id: "pp1", title: "Progress Presentation 1", date: "2025-05-20", slides: 32 },
  { id: "pp2", title: "Progress Presentation 2", date: "2025-09-08", slides: 38 },
  { id: "final", title: "Final Presentation", date: "2025-12-15", slides: 48 },
];
