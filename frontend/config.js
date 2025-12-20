window.PORTFOLIO_CONFIG = {
  apiBaseUrl: "/api",
  site: {
    title: "Portfolio",
    description: "Portfolio website",
  },
  branding: {
    logoText: "Swapnanil Ghosh’s Tech Den",
    footerText: "Creating amazing web experiences with passion and dedication.",
    copyrightYear: new Date().getFullYear(),
  },
  hero: {
    name: "Swapnanil Ghosh",
    role: "Full Stack Developer & Aspiring ML Engineer",
    tagline: "Passionate about creating beautiful and functional web experiences",
  },
  contact: {
    email: "sg.swapnanil72@gmail.com",
    phone: "+91 9674734908",
    location: "Kolkata, West Bengal",
  },
  social: {
    github: "https://github.com/5wapnanil",
    linkedin: "https://www.linkedin.com/in/swapnanil-ghosh-289b46327",
    twitter: "https://x.com/SgSwapnanil",
    instagram: "#",
    facebook: "#",
  },
  projects: [
    {
      title: "Surplus Food Donation platform",
      description:
        "A full-stack Website built with React and Node.js. Features include user authentication, product management, Donation page, and payment integration.",
      iconClass: "fas fa-laptop-code",
      tech: ["React", "Node.js", "MongoDB"],
      githubUrl: "https://github.com/5wapnanil/SmartSarplusFood",
      liveUrl: "https://sankha166.github.io/SmartSarplusFood/",
    },  
    {
      title: "Indian Food Nutrition Predictor",
      description:
        "A machine learning web application that predicts nutrition values (calories, protein, carbs, fat) for Indian foods using a RandomForestRegressor model",
      iconClass: "fas fa-mobile-alt",
      tech: ["Python", "HTML", "CSS"],
      githubUrl: "https://github.com/5wapnanil/food-nutrition-predictionml",
      liveUrl: "#",
    },
    {
      title: "Simple Game UI",
      description:
        "A modern, futuristic game interface built with React and Vite, featuring stunning cyberpunk-inspired UI with glassmorphism effects, neon glows, and smooth animations.",
      iconClass: "fas fa-chart-line",
      tech: ["HTML", "CSS", "Javascript", "Gsap"],
      githubUrl: "https://github.com/5wapnanil/codeease-session-deployed-",
      liveUrl: "https://codeease-session-plum.vercel.app/",
    },
    {
      title: "Pratidwandhi – AI-Powered Sports Talent Platform",
      description:
        "AI-powered mobile and web platform to democratize sports talent assessment for every athlete in India — from metros to remote villages",
      iconClass: "fas fa-blog",
      tech: ["Python", "Yolov11", "ReactNative"],
      githubUrl: "https://github.com/Sumitsill/SIH-FINAL-WEB-BY-PRATIDWANDHI",
      liveUrl: "#",
    },
  ],
  effects: {
    fluidCursor: {
      enabled: true,
    },
    neonCursor: {
      enabled: true,
    },
  },
};

