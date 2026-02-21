export interface Project {
  title: string;
  description: string;
  url: string;
  liveUrl?: string;
  tags: string[];
  highlight?: boolean;
}

export const projects: Project[] = [
  {
    title: 'SofaScope',
    description: 'AI-powered visual search for the world\'s largest furniture store. CLIP embeddings and FAISS vector search in a Dockerized microservices architecture — optimized search latency by 95% (15s → <500ms).',
    url: 'https://github.com/cwarre33',
    liveUrl: 'https://sofascope.furniturelandsouth.com',
    tags: ['Python', 'FastAPI', 'CLIP', 'FAISS', 'Docker'],
    highlight: true,
  },
  {
    title: 'SEC Breach Dashboard',
    description: 'Full-stack app that visualizes real-time cybersecurity breach filings (SEC 8-K Item 1.05) and provides AI-powered summaries for analysis.',
    url: 'https://github.com/cwarre33/BreachDashboard',
    tags: ['JavaScript', 'CSS', 'AI Summaries'],
    highlight: true,
  },
  {
    title: 'AutoTrader',
    description: 'AI-powered paper trading bot: scans high-volume stocks, analyzes with RSI and LLM news sentiment, and executes paper trades.',
    url: 'https://github.com/cwarre33/AutoTrader',
    tags: ['Python', 'Docker', 'LLM'],
    highlight: true,
  },
  {
    title: 'AutomationAgent',
    description: 'Lightweight framework for automating short-form content generation, editing, and posting with a Streamlit dashboard and agent-based workflows.',
    url: 'https://github.com/cwarre33/AutomationAgent',
    tags: ['Python', 'Streamlit', 'Agents'],
  },
  {
    title: 'FInVision',
    description: 'Financial data visualization and analysis project.',
    url: 'https://github.com/cwarre33/FInVision',
    tags: ['Python'],
  },
  {
    title: 'Dining Review API',
    description: 'RESTful API built with Spring and Spring Data JPA for submitting and querying restaurant dining reviews.',
    url: 'https://github.com/cwarre33/DiningReviewApplication',
    tags: ['Java', 'Spring', 'JPA'],
  },
  {
    title: 'React Weather App',
    description: 'Weather dashboard built with React for learning full-stack and modern web technologies.',
    url: 'https://github.com/cwarre33/React-Weather-App',
    liveUrl: 'https://cwarre33.github.io/React-Weather-App/',
    tags: ['React', 'JavaScript'],
  },
  {
    title: 'EDA-NASDAQ',
    description: 'Stock market analysis with pandas, matplotlib, and seaborn on historical NASDAQ data (1962–2024).',
    url: 'https://github.com/cwarre33/EDA-NASDAQ',
    tags: ['Python', 'pandas', 'Jupyter'],
  },
];
