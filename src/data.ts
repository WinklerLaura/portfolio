// All page content. Edit texts, projects and links here.
// Paths are relative to /public.

export interface Media { src: string; alt: string; video?: boolean; poster?: string }
export interface ProjectLink { label: string; href: string }
export interface Metric { value: string; label: string }
export interface Project {
  id: string; badge: string; meta: string; title: string; teaser: string;
  slides: Media[]; gallery: Media[];
  detail: { meta: string; paragraphs: string[]; points: string[]; metrics: Metric[]; tags: string[]; links: ProjectLink[] };
}
export interface Hotspot { fx: number; fy: number; target: string; label: string; ariaLabel: string }

export const profile = {
  firstName: "Laura",
  lastName: "Winkler",
  role: "Software Engineer · AI & Product",
  tagline: "Turning complex technical systems into products people actually use.",
  // Shown as: "<main> <when>" and "<place>" on a second line (on phones they flow together).
  status: { main: ["Currently on parental leave ·", "Open to new roles"], when: "from early 2027", place: "Vienna · Hybrid" },
  about: "I started in a wet lab, moved into computational neuroscience and machine learning, and spent over two years building the interface of an AI-powered fall detection system for care facilities. What I enjoy most is building prototypes, shaping look and feel, and making AI-driven products clear and usable.",
  linkedin: "https://www.linkedin.com/in/laura-winkler-dev",
  github: "https://github.com/WinklerLaura",
};

export const hero = {
  src: "/hero.jpg",
  alt: "A line of light runs from DNA through a cell, neurons and a brain into a floating dashboard of machine learning charts",
  /** Light thread traced in the image, as fractions of image width/height. */
  path: [[0, 0.48], [0.019, 0.459], [0.038, 0.449], [0.057, 0.445], [0.076, 0.436], [0.095, 0.436], [0.114, 0.445], [0.133, 0.449], [0.152, 0.466], [0.17, 0.479], [0.189, 0.502], [0.208, 0.522], [0.227, 0.541], [0.246, 0.557], [0.265, 0.573], [0.284, 0.584], [0.303, 0.591], [0.322, 0.597], [0.341, 0.606], [0.36, 0.619], [0.379, 0.632], [0.398, 0.652], [0.417, 0.666], [0.436, 0.675], [0.455, 0.677], [0.473, 0.673], [0.492, 0.659], [0.511, 0.637], [0.53, 0.611], [0.549, 0.588], [0.568, 0.573], [0.587, 0.569], [0.606, 0.577], [0.625, 0.595], [0.644, 0.612], [0.663, 0.618], [0.682, 0.622], [0.701, 0.623], [0.72, 0.607], [0.739, 0.58], [0.758, 0.565], [0.767, 0.562], [0.78, 0.562], [0.805, 0.567], [0.827, 0.573], [0.846, 0.577], [0.862, 0.573], [0.878, 0.566], [0.888, 0.557], [0.898, 0.543], [0.908, 0.528], [0.918, 0.514], [0.928, 0.504], [0.938, 0.498], [0.948, 0.493], [0.958, 0.489], [0.968, 0.486], [0.979, 0.484]] as [number, number][],
  hotspots: [
  {
    "fx": 0.095,
    "fy": 0.436,
    "target": "background",
    "label": "Molecular biology",
    "ariaLabel": "Molecular biology: go to background"
  },
  {
    "fx": 0.455,
    "fy": 0.677,
    "target": "background",
    "label": "Neuroscience",
    "ariaLabel": "Neuroscience: go to background"
  },
  {
    "fx": 0.663,
    "fy": 0.618,
    "target": "p-thesis",
    "label": "Machine learning",
    "ariaLabel": "Machine learning: go to the EEG project"
  },
  {
    "fx": 0.8,
    "fy": 0.566,
    "target": "projects",
    "label": "AI & Product",
    "ariaLabel": "AI and product: go to projects"
  }
] as Hotspot[],
};

export const projects: Project[] = [
  {
    "id": "p-cogvis",
    "badge": "Product & Frontend",
    "meta": "HealthTech · Feb 2023 – Jun 2025",
    "title": "cogvisAI: interfaces for safer care",
    "teaser": "Frontend for a fall detection system used in 200+ care facilities across Europe.",
    "slides": [
      {
        "src": "/tiles/cover-cogvis.jpg",
        "alt": "cogvisAI cover: a stylised analytics dashboard on a laptop"
      },
      {
        "src": "/tiles/cogvis-overview.jpg",
        "alt": "Illustrative mockup of a unit overview with one fall alarm"
      },
      {
        "src": "/tiles/cogvis-room.jpg",
        "alt": "Illustrative mockup of room settings"
      },
      {
        "src": "/tiles/cogvis-admin.jpg",
        "alt": "Illustrative mockup of an admin analytics dashboard"
      }
    ],
    "gallery": [
      {
        "src": "/tiles/cover-cogvis.jpg",
        "alt": "cogvisAI cover: a stylised analytics dashboard on a laptop"
      },
      {
        "src": "/tiles/cogvis-overview.jpg",
        "alt": "Illustrative mockup of a unit overview with one fall alarm"
      },
      {
        "src": "/tiles/cogvis-room.jpg",
        "alt": "Illustrative mockup of room settings"
      },
      {
        "src": "/tiles/cogvis-admin.jpg",
        "alt": "Illustrative mockup of an admin analytics dashboard"
      }
    ],
    "detail": {
      "meta": "HealthTech · Feb 2023 – Jun 2025",
      "paragraphs": [
        "Staff in care homes can’t be in every room at once. cogvisAI detects falls with depth sensors and alerts staff right away. It's used in more than 200 care facilities and hospitals across Europe. Together with designers and developers from the agency bitperfect, I designed and built the frontend, making complex sensor data and alarms clear enough for nursing staff to act on quickly."
      ],
      "points": [
        "Multilingual interface for nursing staff: choose a care unit, see current alarms at a glance, monitor rooms with active sensors and adjust settings per room",
        "Admin panel that lets support staff and administrators manage settings and run evaluations",
        "Dashboards on care metrics that help administrators and nursing staff make decisions based on real-time data"
      ],
      "metrics": [],
      "tags": [
        "React",
        "TypeScript",
        "REST API",
        "MUI",
        "Recharts",
        "i18next"
      ],
      "links": [
        {
          "label": "Explore the interface",
          "href": "https://bitperfect.at/portfolio/frontend-entwicklung-cogvis"
        },
        {
          "label": "cogvis.ai",
          "href": "https://cogvis.ai/"
        }
      ]
    }
  },
  {
    "id": "p-tedai",
    "badge": "LLM & Data pipeline",
    "meta": "TEDAI Hackathon · Oct 2024",
    "title": "AI against human trafficking",
    "teaser": "An LLM-based news monitor for an NGO fighting human trafficking.",
    "slides": [
      {
        "src": "/tiles/cover-tedai.jpg",
        "alt": "Cover: news articles flowing through an AI model and sorted into groups"
      },
      {
        "src": "/tiles/tedai-stage.jpg",
        "alt": "The TEDAI Vienna stage before the talks"
      },
      {
        "src": "/tiles/tedai-robot.mp4",
        "alt": "A robot dog walking down the stairs at TEDAI Vienna",
        "video": true,
        "poster": "/tiles/tedai-robot-poster.jpg"
      },
      {
        "src": "/tiles/tedai-laptop.jpg",
        "alt": "Team 3 sign on the hackathon laptop"
      },
      {
        "src": "/tiles/tedai-31.jpg",
        "alt": "Pipeline slide: Google Alerts, Python and OpenAI API to CSV"
      }
    ],
    "gallery": [
      {
        "src": "/tiles/cover-tedai.jpg",
        "alt": "Cover: news articles flowing through an AI model and sorted into groups"
      },
      {
        "src": "/tiles/tedai-stage.jpg",
        "alt": "The TEDAI Vienna stage before the talks"
      },
      {
        "src": "/tiles/tedai-laptop.jpg",
        "alt": "Team 3 sign on the hackathon laptop"
      },
      {
        "src": "/tiles/tedai-robot.mp4",
        "alt": "A robot dog walking down the stairs at TEDAI Vienna",
        "video": true,
        "poster": "/tiles/tedai-robot-poster.jpg"
      },
      {
        "src": "/tiles/tedai-1.jpg",
        "alt": "Title slide of the hackathon presentation"
      },
      {
        "src": "/tiles/tedai-31.jpg",
        "alt": "Pipeline slide: Google Alerts, Python and OpenAI API to CSV"
      },
      {
        "src": "/tiles/tedai-37.jpg",
        "alt": "The extraction prompt and script running"
      },
      {
        "src": "/tiles/tedai-91.jpg",
        "alt": "Impact slide of the presentation"
      }
    ],
    "detail": {
      "meta": "TEDAI Hackathon · Oct 2024",
      "paragraphs": [
        "NGOs fighting human trafficking track incidents by reading the news by hand, which is slow and easy to miss. At the TEDAI Hackathon, I was the technical lead in a team of three, alongside a designer and an advocate. Together with an NGO, we built a system that collects news automatically and uses an LLM to identify and sort relevant incidents."
      ],
      "points": [
        "Gmail API pipeline that collects and parses Google Alerts automatically",
        "Python extraction of relevant news articles",
        "OpenAI API to identify and categorise incidents"
      ],
      "metrics": [],
      "tags": [
        "Python",
        "Docker",
        "Gmail API",
        "OpenAI API"
      ],
      "links": [
        {
          "label": "Watch the presentation",
          "href": "/tedai-hackathon.mp4"
        }
      ]
    }
  },
  {
    "id": "p-thesis",
    "badge": "Deep learning",
    "meta": "Master's thesis · Oct 2021 – Mar 2022",
    "title": "Deep learning on neonatal EEG",
    "teaser": "A 1D CNN that classifies newborns' EEG responses to speech.",
    "slides": [
      {
        "src": "/tiles/cover-thesis.jpg",
        "alt": "Cover: an EEG wave flowing into a convolutional neural network"
      },
      {
        "src": "/tiles/thesis-eeg.jpg",
        "alt": "Schematic of single EEG trials and averaged responses for /da/ and /oa/"
      },
      {
        "src": "/tiles/thesis-arch.jpg",
        "alt": "Architecture of the 1D CNN"
      },
      {
        "src": "/tiles/thesis-results.jpg",
        "alt": "Confusion matrix and performance metrics"
      }
    ],
    "gallery": [
      {
        "src": "/tiles/cover-thesis.jpg",
        "alt": "Cover: an EEG wave flowing into a convolutional neural network"
      },
      {
        "src": "/tiles/thesis-eeg.jpg",
        "alt": "Schematic of single EEG trials and averaged responses for /da/ and /oa/"
      },
      {
        "src": "/tiles/thesis-arch.jpg",
        "alt": "Architecture of the 1D CNN"
      },
      {
        "src": "/tiles/thesis-results.jpg",
        "alt": "Confusion matrix and performance metrics"
      }
    ],
    "detail": {
      "meta": "Master's thesis · Oct 2021 – Mar 2022",
      "paragraphs": [
        "Dyslexia is usually diagnosed years after it starts, yet early signs may already show in how a newborn's brain responds to speech. For my Master's thesis, I built a 1D CNN that tells apart EEG responses to two speech sounds (/da/ and /oa/) in 86 newborns. I covered the full pipeline, from raw recordings and preprocessing to model design and evaluation."
      ],
      "points": [],
      "metrics": [
        {
          "value": "98.1%",
          "label": "accuracy"
        },
        {
          "value": "97.7%",
          "label": "precision"
        },
        {
          "value": "99.0%",
          "label": "recall"
        },
        {
          "value": "0.999",
          "label": "AUC"
        }
      ],
      "tags": [
        "Python",
        "TensorFlow",
        "Keras",
        "Google Colab"
      ],
      "links": [
        {
          "label": "Read the thesis (PDF)",
          "href": "/thesis.pdf"
        }
      ]
    }
  },
  {
    "id": "p-genes",
    "badge": "Bioinformatics",
    "meta": "Research project · Feb 2021",
    "title": "Gene networks behind epilepsy",
    "teaser": "Gene co-expression networks from 70,968 mouse brain cells.",
    "slides": [
      {
        "src": "/tiles/cover-genes.jpg",
        "alt": "Cover: two gene co-expression networks"
      },
      {
        "src": "/tiles/genes-overview.jpg",
        "alt": "Key numbers: 70,968 mouse brain cells, 27,998 genes, 653 epilepsy genes, split into inhibitory, shared and excitatory gene pairs"
      },
      {
        "src": "/tiles/genes-gaba.jpg",
        "alt": "Network of the top 100 correlated gene pairs in inhibitory cells"
      },
      {
        "src": "/tiles/genes-vglut.jpg",
        "alt": "Network of the top 100 correlated gene pairs in excitatory cells"
      }
    ],
    "gallery": [
      {
        "src": "/tiles/cover-genes.jpg",
        "alt": "Cover: two gene co-expression networks"
      },
      {
        "src": "/tiles/genes-overview.jpg",
        "alt": "Key numbers: 70,968 mouse brain cells, 27,998 genes, 653 epilepsy genes, split into inhibitory, shared and excitatory gene pairs"
      },
      {
        "src": "/tiles/genes-gaba.jpg",
        "alt": "Network of the top 100 correlated gene pairs in inhibitory cells"
      },
      {
        "src": "/tiles/genes-vglut.jpg",
        "alt": "Network of the top 100 correlated gene pairs in excitatory cells"
      }
    ],
    "detail": {
      "meta": "Research project · Joint Master Neuroscience · Feb 2021",
      "paragraphs": [
        "Epilepsy is thought to come from an imbalance between excitatory and inhibitory brain cells. In a single-cell RNA dataset of 70,968 mouse brain cells, I separated both cell types and built gene co-expression networks for each, to find epilepsy genes that act in only one of the two systems.",
        "Result: 10 of 39 epilepsy genes unique to the excitatory system and 3 of 29 unique to the inhibitory system rank among the top 100 gene pairs of their system. This points to gene modules worth testing in the lab."
      ],
      "points": [
        "Selected inhibitory (GABAergic) and excitatory (glutamatergic) neurons from a public whole-brain dataset with 27,998 genes",
        "Filtered, normalised and log-transformed the expression data and calculated Spearman correlations, using an existing R pipeline in Docker",
        "Paired 653 known epilepsy genes with their co-expressed genes in Python and split them into inhibitory-only, excitatory-only and shared pairs",
        "Visualised the top 100 gene pairs of each system as networks in Cytoscape"
      ],
      "metrics": [],
      "tags": [
        "Python",
        "R",
        "Docker",
        "Cytoscape",
        "scRNA-seq"
      ],
      "links": [
        {
          "label": "Read the report (PDF)",
          "href": "/research-project.pdf"
        }
      ]
    }
  }
];

export const background = [
  {
    "when": "Bachelor's · 2020",
    "title": "Molecular Biology",
    "where": "University of Vienna"
  },
  {
    "when": "Master's · 2022",
    "title": "Computational Neuroscience",
    "where": "Universities of Strasbourg & Freiburg"
  },
  {
    "when": "2023 – 2025",
    "title": "Frontend Developer & Research Engineer",
    "where": "CogVis, Vienna"
  }
];

export const skills = [
  {
    "title": "Frontend",
    "items": [
      "React",
      "TypeScript",
      "JavaScript",
      "MUI",
      "Recharts",
      "Tailwind CSS",
      "shadcn/ui"
    ]
  },
  {
    "title": "AI & ML",
    "items": [
      "Python",
      "TensorFlow",
      "Keras",
      "OpenAI API",
      "LLM integration"
    ]
  },
  {
    "title": "Data & Bioinformatics",
    "items": [
      "Pandas",
      "R",
      "Docker",
      "Cytoscape",
      "scRNA-seq",
      "EEG"
    ]
  },
  {
    "title": "Tools",
    "items": [
      "Linux",
      "Git",
      "JIRA",
      "Canva"
    ]
  }
];

export const facts = [
  {
    "title": "Wildlife & macro photography",
    "text": "I photograph animals: big ones from far away, tiny ones up close. Both are equally unimpressed by me."
  },
  {
    "title": "One Master's, three countries",
    "text": "I studied in Strasbourg and Freiburg and wrote my thesis in Barcelona. My Spanish got good enough to read almost anything, as long as there's no past tense involved."
  },
  {
    "title": "From the lab to the laptop",
    "text": "I've grown cells in a lab and trained neural networks on a laptop. Both need constant care and still do whatever they want."
  },
  {
    "title": "Closing the female health gap",
    "text": "Women's health is a topic close to my heart. Research and medicine still know far less about women's bodies than they should, and I'd love to help make that gap a little smaller."
  },
  {
    "title": "Women in Health IT",
    "text": "I'm a member of Women in Health IT, because I'd like to see more women building the tech that shapes healthcare."
  }
];
