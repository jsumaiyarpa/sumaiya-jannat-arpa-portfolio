/**
 * Professional Skills & Capabilities Data Layer
 * 
 * Verified against:
 * 1. East West University CSE undergraduate transcript & coursework (OOP/Java, Architecture, SQA, DBMS, Algorithms).
 * 2. OSTAD UI/UX Design Career Track certificate & verified marks sheet (Research, Personas, Flows, Wireframing, Figma).
 * 3. OSTAD Software Quality Assurance (SQA) program & projects (Manual Testing, API Testing, Postman/Newman, Selenium WebDriver).
 * 4. Active GitHub repositories (CareShelf, CS423 SOLID Java, noor-e-verse React/TypeScript, portfolioBanao full-stack, sqa_automation_assessment).
 * 5. Official Resume (Sumaiya_Jannat_Arpa_Resume.pdf).
 * 
 * Note: Candidate skill 'Django' from prompt was evaluated and excluded as there are no documented Django projects or coursework.
 * 'Python' is retained based on academic coursework and existing portfolio documentation.
 */

export const skillCategories = [
  {
    id: 'uiux',
    title: 'UI/UX Design',
    blurb: 'User research, structured user flows, interactive prototyping, and design systems grounded in user needs.',
    skills: [
      'UX Research',
      'User Personas & Journey Mapping',
      'User Flows',
      'Wireframing & Prototyping',
      'Information Architecture',
      'Design Systems',
      'Responsive Interface Design',
      'Competitive Analysis',
      'Usability & Accessibility (WCAG)',
    ],
  },
  {
    id: 'development',
    title: 'Development',
    blurb: 'Frontend web applications, core object-oriented programming, and backend API integration.',
    skills: [
      'HTML5',
      'CSS3',
      'JavaScript (ES6+)',
      'React',
      'TypeScript',
      'Java',
      'Python',
      'Node.js & Express.js',
      'MongoDB',
      'REST APIs',
      'C / C++',
    ],
  },
  {
    id: 'sqa',
    title: 'Software Quality Assurance',
    blurb: 'Manual verification rigor, boundary analysis, Postman API testing, and Selenium browser automation.',
    skills: [
      'Manual Testing',
      'Test Case Design',
      'Software Testing Fundamentals',
      'API Testing (Postman & Newman)',
      'Boundary Value Analysis (BVA)',
      'Equivalence Partitioning',
      'Test Automation (Selenium WebDriver)',
      'Mocha Test Runner',
      'Bug Investigation & Defect Triage',
      'Automated Test Reporting',
    ],
  },
  {
    id: 'tools',
    title: 'Tools & Design Platforms',
    blurb: 'Core design software, productivity platforms, version control, and automated testing tools.',
    skills: [
      'Figma',
      'FigJam',
      'Canva Pro',
      'Git & GitHub',
      'Postman',
      'Newman CLI',
      'Selenium WebDriver',
      'VS Code',
    ],
  },
];
