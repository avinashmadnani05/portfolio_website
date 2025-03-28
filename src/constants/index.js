import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  starbucks,
  tesla,
  shopify,
  carrent,
  jobit,
  tripguide,
  threejs,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },

  {
    id: "interview-bot",
    title: "Interview Bot",
  }
 
];

const services = [
  {
    title: "Web Developer",
    icon: web,
  },
  {
    title: "React Native Developer",
    icon: mobile,
  },
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "Content Creator",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  
  {
    title: "Quantum Simulation",
    company_name: "IBM Qubit",
    icon: meta, // Replace with an appropriate icon if needed
    iconBg: "#E6DEDD",
    date: "Jan 2023 - Apr 2023",
    points: [
      "Developed a quantum physics simulation focused on black hole interactions.",
      "Utilized IBM Qubit for quantum state calculations and visualizations.",
      "Implemented quantum algorithms to analyze physical behaviors near black holes.",
      "Collaborated with researchers and developers to refine simulation accuracy.",
    ],
  },
  {
    title: "Course Connector",
    company_name: "Personal Project",
    icon: shopify, // Replace with an appropriate icon if needed
    iconBg: "#383E56",
    date: "Feb 2023 - Aug 2023",
    points: [
      "Built a MERN-stack web application for personalized course recommendations.",
      "Integrated Machine Learning and NLP (Named Entity Recognition) to analyze user preferences.",
      "Designed and deployed a recommendation system using MongoDB, Express, React, and Node.js.",
      "Optimized the user interface with responsive design and interactive elements.",
    ],
  },
  {
    title: "SIH-1654",
    company_name: "Smart India Hackathon",
    icon: tesla, // Replace with an appropriate icon if needed
    iconBg: "#E6DEDD",
    date: "Aug 2023 - Present",
    points: [
      "Developed a project as part of Smart India Hackathon 2023.",
      "Implemented a scalable solution using advanced algorithms and databases.",
      "Worked on real-world problem-solving and collaborated with a team for execution.",
      "Utilized cloud-based services and APIs for enhanced performance.",
    ],
  },
  {
    title: "SIH-1653",
    company_name: "Smart India Hackathon",
    icon: starbucks, // Replace with an appropriate icon if needed
    iconBg: "#383E56",
    date: "Aug 2023 - Present",
    points: [
      "Designed a technical prototype for Smart India Hackathon challenge.",
      "Incorporated data analytics and AI-based decision-making processes.",
      "Developed and tested different modules for system efficiency.",
      "Collaborated with industry mentors for guidance and improvement.",
    ],
  },
  {
    title: "GFG Student Chapter Website",
    company_name: "Geeks for Geeks",
    icon: figma, // Replace with an appropriate icon if needed
    iconBg: "#E6DEDD",
    date: "Sep 2023 - Oct 2023",
    points: [
      "Designed and developed a website for the Geeks for Geeks Student Chapter.",
      "Implemented event management and member registration functionalities.",
      "Used modern UI/UX practices with responsive web design.",
      "Integrated GitHub for version control and team collaboration.",
    ],
  },
  {
    title: "Personal Portfolio Website",
    company_name: "Personal Project",
    icon: jobit, // Replace with an appropriate icon if needed
    iconBg: "#383E56",
    date: "Oct 2023 - Nov 2023",
    points: [
      "Developed a personal portfolio website showcasing projects and skills.",
      "Utilized React.js, Tailwind CSS, and animations for an engaging experience.",
      "Integrated a contact form with backend services for inquiries.",
      "Optimized performance and SEO for better online visibility.",
    ],
  },
  {
    title: "3D Visuals Project",
    company_name: "Personal Project",
    icon: threejs, // Replace with an appropriate icon if needed
    iconBg: "#E6DEDD",
    date: "Dec 2023 - Present",
    points: [
      "Working on a project involving interactive 3D visualizations.",
      "Utilizing Three.js and WebGL for real-time rendering.",
      "Implementing physics-based interactions and custom shaders.",
      "Optimizing performance for smooth animations on web platforms.",
    ],
  },
  {
    title: "Machine Learning Research",
    company_name: "Personal Research",
    icon: mongodb, // Replace with an appropriate icon if needed
    iconBg: "#383E56",
    date: "Jan 2024 - Present",
    points: [
      "Exploring applications of machine learning in various domains.",
      "Developing and fine-tuning models for real-world data analysis.",
      "Experimenting with deep learning frameworks like TensorFlow and PyTorch.",
      "Publishing findings and collaborating with peers for research insights.",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  {
    name: "Quantum Simulation",
    description:
      "A quantum physics simulation focusing on black hole interactions, leveraging IBM Qubit for quantum state calculations and visualizations.",
    tags: [
      {
        name: "quantum-computing",
        color: "blue-text-gradient",
      },
      {
        name: "ibm-qubit",
        color: "green-text-gradient",
      },
      {
        name: "physics-simulation",
        color: "pink-text-gradient",
      },
    ],
    image: carrent,
    source_code_link: "https://quantum-simulation-nu.vercel.app/",
  },
  {
    name: "Course Connector",
    description:
      "A MERN-stack web application for personalized course recommendations, integrating Machine Learning and NLP for user preferences.",
    tags: [
      {
        name: "mern-stack",
        color: "blue-text-gradient",
      },
      {
        name: "machine-learning",
        color: "green-text-gradient",
      },
      {
        name: "nlp",
        color: "pink-text-gradient",
      },
    ],
    image: shopify,
    source_code_link: "https://courserecomender-avinashmadnani05s-projects.vercel.app/",
    

  },
  {
    name: "GFG Student Chapter Website",
    description:
      "A fully functional website developed for the Geeks for Geeks Student Chapter, integrating event management and member registration features.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "tailwindcss",
        color: "green-text-gradient",
      },
      {
        name: "firebase",
        color: "pink-text-gradient",
      },
    ],
    image: jobit,
    source_code_link: "https://gfg-ghrcemn.vercel.app/",
  },
];

export { services, technologies, experiences, testimonials, projects };
