-- ============================================================================
-- SCRIPT: 02_turso_seed.sql (AUTHENTIC SOURCE-ALIGNED VERSION)
-- Project: Arpa Portfolio Admin Panel
-- Engine: Turso (libSQL / SQLite)
-- Total Records: Exactly 116 records (108 core content + 8 gallery items)
-- Sourced directly from src/data/*.js and src/pages.jsx with zero invented data.
-- All operations use ON CONFLICT DO NOTHING for safe rerun idempotence.
-- ============================================================================

PRAGMA foreign_keys = ON;

-- ============================================================================
-- 01. SITE SETTINGS (1 ROW)
-- Source: src/data/site.js
-- ============================================================================
INSERT INTO site_settings (
  id, site_name, short_name, monogram, eyebrow, headline, intro,
  institution, department, major, admission, location, coordinates,
  email, portrait_url, resume_url, resume_filename, resume_updated_at, nav_items, is_published
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Sumaiya Jannat Arpa',
  'Arpa',
  'SJA.',
  'SOFTWARE ENGINEERING × UI/UX × SQA',
  'Building useful digital experiences through code, design, and quality.',
  'I''m a Computer Science and Engineering student (Software Engineering major) at East West University, combining analytical engineering, user-centered design, and software testing.',
  'East West University',
  'Department of Computer Science and Engineering',
  'Software Engineering Major',
  'Fall 2022',
  'Dhaka, Bangladesh',
  '23.7687° N, 90.4258° E',
  'jannat.sumaiyarpa@gmail.com',
  '/images/portrait.jpg',
  '/resume/Sumaiya_Jannat_Arpa_Resume.pdf',
  'Sumaiya_Jannat_Arpa_Resume.pdf',
  'October 2024',
  '[{"to":"#about","label":"About"},{"to":"#skills","label":"Skills"},{"to":"#projects","label":"Projects"},{"to":"#reviews","label":"Reviews"},{"to":"#contact","label":"Contact"}]',
  1
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 02. PROFILE & ABOUT (1 ROW)
-- Source: src/data/about.js
-- ============================================================================
INSERT INTO profile_about (
  id, heading, subheading, bio_paragraphs, disciplines, personal_interests, is_published
)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Building useful digital experiences through code, design, and quality.',
  'A multidisciplinary CSE undergraduate combining analytical engineering, human-centered UI/UX design, and software testing rigor.',
  '["I am an undergraduate student in Computer Science and Engineering with a major in Software Engineering at East West University, Dhaka, Bangladesh (Admission: Fall 2022).","Rather than treating engineering, design, and testing as disconnected fields, I explore how they reinforce one another. My journey started with a strong interest in visual arts, typography, and poster design—which naturally expanded into user-centered digital product design and research.","Through the Ostad UI/UX Design Career Track, I developed a structured design process covering user interviews, persona creation, user journey mapping, wireframing, and design systems in Figma. Collaborating on team case studies like OneCitizen taught me to design interfaces grounded in real user needs.","In parallel, I build web applications using React, JavaScript, and full-stack tools (Node.js, Express, MongoDB). To ensure what I build is resilient and dependable, I am currently studying Software Quality Assurance (SQA) through Ostad—practicing manual test case formulation, boundary value analysis, Postman API testing, and Selenium automation.","On campus, I serve as Head of Sub-Executives & Volunteers at the EWU English Conversation Club (EWUECC), where I progressed from Volunteer to Sub-Executive (Arts & Crafts). I also previously maintained a personal art page called Arty-techture-art and a creative coding channel called Cody.techture, which laid the foundation for my passion for blending code with visual expression."]',
  '[{"title":"Software Engineering","code":"SYS // 01","description":"Building responsive web applications with clean component hierarchy, RESTful API consumption, and dependable state management.","skills":["React & JavaScript","HTML5/CSS3 Architecture","Node.js & MongoDB","REST APIs","Git Version Control"],"focus":["React & JavaScript","HTML5/CSS3 Architecture","Node.js & MongoDB","REST APIs","Git Version Control"]},{"title":"UI/UX Design & Research","code":"HCI // 02","description":"Conducting qualitative user research, mapping user flows, and translating user needs into build-ready design systems and interactive prototypes in Figma.","skills":["User Interviews & Surveys","Journey Maps & Personas","Wireframing & Prototyping","Design Systems (Figma)","Accessibility (WCAG)"],"focus":["User Interviews & Surveys","Journey Maps & Personas","Wireframing & Prototyping","Design Systems (Figma)","Accessibility (WCAG)"]},{"title":"Software Quality Assurance","code":"SQA // 03","description":"Applying disciplined testing methodologies to catch defects early, verify API contracts, validate boundary inputs, and deliver dependable software releases.","skills":["Test Scenarios & Test Cases","API Testing (Postman)","Boundary Value Analysis","Selenium WebDriver","Bug Investigation & Reports"],"focus":["Test Scenarios & Test Cases","API Testing (Postman)","Boundary Value Analysis","Selenium WebDriver","Bug Investigation & Reports"]},{"title":"Visual Communication","code":"VIS // 04","description":"Crafting high-impact promotional posters, digital campaign assets, and stage banners that communicate messages clearly and engage audiences.","skills":["Canva Pro & Typography","Event Poster Design","Bilingual Layout Grids","Print & Digital Formatting","Creative Storytelling"],"focus":["Canva Pro & Typography","Event Poster Design","Bilingual Layout Grids","Print & Digital Formatting","Creative Storytelling"]}]',
  '[{"label":"Creative Technology","desc":"Exploring how code, interactivity, and visual design merge into meaningful digital experiences."},{"label":"Human-Centered Design","desc":"Understanding cognitive user flows, accessibility, and intuitive interface patterns."},{"label":"Software Quality & Reliability","desc":"Ensuring systems perform dependably through structured testing and verification."},{"label":"Community & Leadership","desc":"Mentoring volunteers, coordinating campus initiatives, and fostering collaborative team environments."}]',
  1
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 03. EDUCATION (3 ROWS)
-- Source: src/data/about.js (about.education)
-- ============================================================================
INSERT INTO education (
  id, institution, degree, major, dates, status, location, gpa, stage_tag, details, highlights, coursework, sort_order, is_published
)
VALUES
(
  '00000000-0000-0000-0000-000000000003',
  'East West University',
  'Bachelor of Science in Computer Science and Engineering (B.Sc. in CSE)',
  'Major in Software Engineering',
  'Fall 2022 — Present',
  'Currently Studying',
  'Aftabnagar, Dhaka, Bangladesh',
  '3.48 / 4.00',
  'UNDERGRADUATE // B.SC.',
  'Focusing on core software engineering, algorithms, database systems, object-oriented architecture, web development, and software testing.',
  '["100% Merit Scholarship Awardee","CGPA: 3.48 / 4.00","Dhaka, Bangladesh"]',
  '["Data Structures & Algorithms","Object-Oriented Programming (Java / OOP)","Software Engineering & System Analysis","Software Architecture (CSE423)","Database Management Systems (DBMS)","Web Technology & Internet Applications","Software Quality Assurance & Testing (CSE430)","Operating Systems","Computer Networks"]',
  1,
  1
),
(
  '00000000-0000-0000-0000-000000000004',
  'Ideal School and College',
  'Higher Secondary Certificate (HSC)',
  'Science Group',
  '2021',
  'Completed',
  'Motijheel, Dhaka, Bangladesh',
  '5.00 / 5.00',
  'HIGHER SECONDARY // HSC',
  'Completed higher secondary education in science with strong foundations in mathematics and analytical problem-solving.',
  '["GPA: 5.00 / 5.00","Motijheel, Dhaka"]',
  '[]',
  2,
  1
),
(
  '00000000-0000-0000-0000-000000000005',
  'Ideal School and College',
  'Secondary School Certificate (SSC)',
  'Science Group',
  '2019',
  'Completed',
  'Motijheel, Dhaka, Bangladesh',
  '5.00 / 5.00',
  'SECONDARY // SSC',
  'Completed secondary education with high academic achievement across core science disciplines.',
  '["GPA: 5.00 / 5.00","Motijheel, Dhaka"]',
  '[]',
  3,
  1
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 04. EXPERIENCE & ROLES (4 ORGANIZATIONS, 6 ROLES)
-- Source: src/data/experience.js
-- ============================================================================
INSERT INTO experience (id, org, full_name, location, org_type, is_current, logo_url, sort_order, is_published)
VALUES
(
  '00000000-0000-0000-0000-000000000011',
  'EWU English Conversation Club (EWUECC)',
  'East West University English Conversation Club',
  'East West University, Dhaka',
  'University Academic & Leadership Club',
  1,
  NULL,
  1,
  1
),
(
  '00000000-0000-0000-0000-000000000012',
  'AHOBAN Foundation',
  'AHOBAN Foundation',
  'Dhaka, Bangladesh',
  'Non-Profit Community & Youth Initiative',
  0,
  NULL,
  2,
  1
),
(
  '00000000-0000-0000-0000-000000000013',
  'Campus Crew — Banglay IELTS & English Olympiad',
  'Campus Crew Banglay IELTS & English Olympiad',
  'Bangladesh',
  'National Educational & Language Competition',
  0,
  NULL,
  3,
  1
),
(
  '00000000-0000-0000-0000-000000000014',
  'ISTARC',
  'Ideal Science and Technology Aiming Research Center',
  'Dhaka, Bangladesh',
  'Science & Technology Research Club',
  0,
  NULL,
  4,
  1
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO experience_roles (id, experience_id, title, dates, description, highlights, sort_order)
VALUES
(
  '00000000-0000-0000-0000-000000000021',
  '00000000-0000-0000-0000-000000000011',
  'Head of Sub-Executives & Volunteers',
  '2024 — Present',
  'Promoted to lead and mentor the club sub-executive committee and volunteer teams across all major campus dialogue sessions, workshops, and competitions.',
  '["Directing and coordinating a team of volunteers for semester orientations and competitive speaking events.","Overseeing event day execution, attendee registration, and stage management logistics.","Bridging communications between the club executive panel, faculty advisors, and general student members."]',
  1
),
(
  '00000000-0000-0000-0000-000000000022',
  '00000000-0000-0000-0000-000000000011',
  'Sub-Executive, Arts & Crafts',
  '2023 — 2024',
  'Spearheaded visual design, promotional poster creation, and physical creative installations for club events across the East West University campus.',
  '["Conceptualized and designed promotional Canva posters, digital banners, and stage backdrops for flagship workshops.","Coordinated physical branding and creative installations across campus bulletin spaces.","Assisted in social media campaign planning to increase active student attendance."]',
  2
),
(
  '00000000-0000-0000-0000-000000000023',
  '00000000-0000-0000-0000-000000000011',
  'Volunteer',
  '2022 — 2023',
  'Actively contributed to event operations, student registrations, and on-ground logistics for weekly conversation sessions.',
  '["Assisted participants during club interactive language workshops.","Contributed to promotional material distribution and attendee onboarding."]',
  3
),
(
  '00000000-0000-0000-0000-000000000024',
  '00000000-0000-0000-0000-000000000012',
  'Campus Coordinator',
  '2023 — 2024',
  'Coordinated student volunteer participation, awareness campaigns, and community welfare initiatives across campus.',
  '["Facilitated student volunteer mobilization for humanitarian and educational outreach projects.","Designed campaign promotional graphics and informational social media visuals.","Coordinated logistics and resource collection drives in collaboration with partner organizations."]',
  1
),
(
  '00000000-0000-0000-0000-000000000025',
  '00000000-0000-0000-0000-000000000013',
  'Campus Ambassador & Event Coordinator',
  'College Years (2020 — 2021)',
  'Represented the nationwide English Olympiad initiative on campus, driving student awareness, participation, and registration logistics.',
  '["Managed campus-wide outreach for nationwide competitive rounds.","Facilitated participant registration, query resolution, and schedule communication.","Coordinated informational material dissemination and event day briefings."]',
  1
),
(
  '00000000-0000-0000-0000-000000000026',
  '00000000-0000-0000-0000-000000000014',
  'Campus Event Coordinator',
  '2019 — 2021',
  'Coordinated student participation, science fair exhibitions, and technology workshop sessions.',
  '["Contributed to organizing school-level science festivals, robotics showcases, and quiz competitions.","Assisted guest speakers and facilitated workshop scheduling for scientific presentations.","Coordinated team communications and participant logistical support."]',
  1
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 05. SKILL CATEGORIES (4 ROWS) & SKILLS (38 ROWS)
-- Source: src/data/skills.js
-- ============================================================================
INSERT INTO skill_categories (id, title, blurb, sort_order, is_published)
VALUES
(
  'uiux',
  'UI/UX Design',
  'User research, structured user flows, interactive prototyping, and design systems grounded in user needs.',
  1,
  1
),
(
  'development',
  'Development',
  'Frontend web applications, core object-oriented programming, and backend API integration.',
  2,
  1
),
(
  'sqa',
  'Software Quality Assurance',
  'Manual verification rigor, boundary analysis, Postman API testing, and Selenium browser automation.',
  3,
  1
),
(
  'tools',
  'Tools & Design Platforms',
  'Core design software, productivity platforms, version control, and automated testing tools.',
  4,
  1
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO skills (id, category_id, name, sort_order, is_published)
VALUES
('00000000-0000-0000-0000-000000000101', 'uiux', 'UX Research', 1, 1),
('00000000-0000-0000-0000-000000000102', 'uiux', 'User Personas & Journey Mapping', 2, 1),
('00000000-0000-0000-0000-000000000103', 'uiux', 'User Flows', 3, 1),
('00000000-0000-0000-0000-000000000104', 'uiux', 'Wireframing & Prototyping', 4, 1),
('00000000-0000-0000-0000-000000000105', 'uiux', 'Information Architecture', 5, 1),
('00000000-0000-0000-0000-000000000106', 'uiux', 'Design Systems', 6, 1),
('00000000-0000-0000-0000-000000000107', 'uiux', 'Responsive Interface Design', 7, 1),
('00000000-0000-0000-0000-000000000108', 'uiux', 'Competitive Analysis', 8, 1),
('00000000-0000-0000-0000-000000000109', 'uiux', 'Usability & Accessibility (WCAG)', 9, 1),
('00000000-0000-0000-0000-000000000110', 'development', 'HTML5', 1, 1),
('00000000-0000-0000-0000-000000000111', 'development', 'CSS3', 2, 1),
('00000000-0000-0000-0000-000000000112', 'development', 'JavaScript (ES6+)', 3, 1),
('00000000-0000-0000-0000-000000000113', 'development', 'React', 4, 1),
('00000000-0000-0000-0000-000000000114', 'development', 'TypeScript', 5, 1),
('00000000-0000-0000-0000-000000000115', 'development', 'Java', 6, 1),
('00000000-0000-0000-0000-000000000116', 'development', 'Python', 7, 1),
('00000000-0000-0000-0000-000000000117', 'development', 'Node.js & Express.js', 8, 1),
('00000000-0000-0000-0000-000000000118', 'development', 'MongoDB', 9, 1),
('00000000-0000-0000-0000-000000000119', 'development', 'REST APIs', 10, 1),
('00000000-0000-0000-0000-000000000120', 'development', 'C / C++', 11, 1),
('00000000-0000-0000-0000-000000000121', 'sqa', 'Manual Testing', 1, 1),
('00000000-0000-0000-0000-000000000122', 'sqa', 'Test Case Design', 2, 1),
('00000000-0000-0000-0000-000000000123', 'sqa', 'Software Testing Fundamentals', 3, 1),
('00000000-0000-0000-0000-000000000124', 'sqa', 'API Testing (Postman & Newman)', 4, 1),
('00000000-0000-0000-0000-000000000125', 'sqa', 'Boundary Value Analysis (BVA)', 5, 1),
('00000000-0000-0000-0000-000000000126', 'sqa', 'Equivalence Partitioning', 6, 1),
('00000000-0000-0000-0000-000000000127', 'sqa', 'Test Automation (Selenium WebDriver)', 7, 1),
('00000000-0000-0000-0000-000000000128', 'sqa', 'Mocha Test Runner', 8, 1),
('00000000-0000-0000-0000-000000000129', 'sqa', 'Bug Investigation & Defect Triage', 9, 1),
('00000000-0000-0000-0000-000000000130', 'sqa', 'Automated Test Reporting', 10, 1),
('00000000-0000-0000-0000-000000000131', 'tools', 'Figma', 1, 1),
('00000000-0000-0000-0000-000000000132', 'tools', 'FigJam', 2, 1),
('00000000-0000-0000-0000-000000000133', 'tools', 'Canva Pro', 3, 1),
('00000000-0000-0000-0000-000000000134', 'tools', 'Git & GitHub', 4, 1),
('00000000-0000-0000-0000-000000000135', 'tools', 'Postman', 5, 1),
('00000000-0000-0000-0000-000000000136', 'tools', 'Newman CLI', 6, 1),
('00000000-0000-0000-0000-000000000137', 'tools', 'Selenium WebDriver', 7, 1),
('00000000-0000-0000-0000-000000000138', 'tools', 'VS Code', 8, 1)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 06. PROJECT CATEGORIES (4 ROWS)
-- Source: src/data/projects.js (categories)
-- ============================================================================
INSERT INTO project_categories (id, code, label, tag, blurb, sort_order, is_published)
VALUES
(
  'software',
  '01',
  'Website Projects',
  'FULL-STACK // WEB',
  'Full-stack web applications and software systems built with React, Node.js, Express, and clean architecture.',
  1,
  1
),
(
  'uiux',
  '02',
  'UI/UX Projects',
  'PRODUCT // DESIGN',
  'Research-led digital product concepts, interactive Figma prototypes, user personas, and design systems.',
  2,
  1
),
(
  'graphic',
  '03',
  'Canva Designs',
  'VISUAL // CANVA',
  'Dedicated visual designs, promotional event posters, and digital campaign collateral for campus initiatives.',
  3,
  1
),
(
  'sqa',
  '04',
  'SQA & Others',
  'TESTING // AUTOMATION',
  'Automated testing suites, API testing via Postman/Newman, Selenium browser regression, and defect reports.',
  4,
  1
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 07. PROJECTS (ALL 20 AUTHENTIC PROJECTS FROM src/data/projects.js)
-- ============================================================================
INSERT INTO projects (
  slug, title, order_num, category_id, featured, layout_span, status, summary,
  cover, cover_alt, aspect_ratio, role, timeline, tools, link, repo, sections, evidence, sort_order, is_published
)
VALUES
(
  'arpa-portfolio',
  'Personal Portfolio Website - Sumaiya Jannat Arpa',
  '01',
  'software',
  1,
  'wide',
  'Live Portfolio',
  'My personal portfolio showcasing my software engineering background, UI/UX design work, projects, and experience.',
  '/images/projects/website/arpa-portfolio.png',
  'Personal Portfolio Website - Sumaiya Jannat Arpa preview',
  '16/10',
  'Full-Stack Developer & UI/UX Designer',
  '2024 — 2026',
  '["React","Vite","Vanilla CSS","JavaScript","Responsive Web Design"]',
  'https://arpa-portfolio.vercel.app/',
  'https://github.com/jsumaiyarpa/sumaiya-jannat-arpa-portfolio',
  '{"overview":"My personal portfolio built to exhibit my technical engineering foundations, user-centered product case studies, quality assurance experience, and leadership accomplishments.","problem":"Technical portfolios often suffer from visual genericness or poor responsiveness on diverse viewports. I engineered an art-directed editorial dark navy portfolio with custom 3D deck interactions and accessible modals.","features":"Interactive 4-card category deck; direct category project modals; live GitHub REST API integration; art-directed dark/light mode; responsive ascending staircase experience timeline; downloadable verified resume.","architecture":"Modern React SPA built with Vite for sub-second hot module replacement, paired with decoupled data schemas and zero-dependency Vanilla CSS for total aesthetic control.","stack":"React 18, Vite, Vanilla CSS, JavaScript (ES6+), GitHub API.","implementation":"Engineered modular component architectures, fluid typography using CSS clamp(), and robust accessibility features including keyboard navigation and focus management.","testing":"Rigorous cross-browser verification across modern rendering engines and responsive breakpoint validation from 320px mobile to 4K displays.","challenges":"Achieving silky-smooth 3D card deck transitions without sacrificing subpixel text sharpness. Solved by replacing heavy blur filters with high-opacity translucent gradients and clean 2D translates.","futureImprovements":"Integrating automated headless CMS updates and live project metrics analytics."}',
  '[{"src":"/images/projects/website/arpa-portfolio.png","alt":"Personal Portfolio Website Overview","caption":"Editorial Dark Navy Portfolio Overview and Interactive Category Deck","ratio":"16/10"}]',
  1,
  1
),
(
  'portfolio-banao',
  'PortfolioBanao - A Portfolio Generator Website | Full-stack',
  '02',
  'software',
  1,
  'wide',
  'Prototype / Working Application',
  'A full-stack web application designed to help students and developers build, customize, and publish personal portfolio websites easily.',
  '/images/projects/website/portfoliobanao.png',
  'PortfolioBanao application interface and dashboard preview',
  '16/10',
  'Full-Stack Developer (Personal Project)',
  '2024',
  '["JavaScript (ES6+)","React","Node.js","Express","MongoDB","CSS3","REST APIs"]',
  'https://portfolio-banao.vercel.app/',
  'https://github.com/jsumaiyarpa/portfolioBanao',
  '{"overview":"PortfolioBanao was born out of a common challenge among university peers: the difficulty of assembling a structured, recruiter-ready portfolio without getting lost in boilerplate frontend configuration.","problem":"Undergraduate students often lack the time or design system foundation to build responsive web portfolios from scratch, leading to missed internship deadlines.","features":"Dynamic portfolio section generation; live layout previews; customizable themes; structured project entry forms; responsive layout optimization for mobile and desktop.","architecture":"Client-server architecture with React handling the stateful user dashboard and a Node.js/Express REST API managing persistent data storage in MongoDB.","stack":"React, Node.js, Express, MongoDB, JavaScript ES6+, Git & GitHub.","implementation":"Engineered modular form components with input validation, client-side route handling, and an asynchronous data-fetching pipeline.","testing":"Manual verification of CRUD workflows, responsive breakpoint stress-testing, and API endpoint verification using Postman.","challenges":"Managing nested form states for variable-length project lists. Solved by implementing atomic state reducers and controlled component lifecycles.","futureImprovements":"Implementing OAuth authentication, custom domain export options, and automated PDF resume synchronization."}',
  '[{"src":"/images/projects/website/portfoliobanao.png","alt":"PortfolioBanao Dashboard Preview","caption":"User dashboard: Project creation and metadata configuration view","ratio":"16/10"}]',
  2,
  1
),
(
  'care-shelf',
  'CareShelf - Community Sharing Platform | Frontend-ongoing',
  '03',
  'software',
  1,
  'compact',
  'Completed Web Project',
  'A community-based web platform for donating, browsing, requesting, and sharing reusable books and everyday items for free.',
  '/images/projects/website/careshelf-site.png',
  'CareShelf web platform homepage and item catalog',
  '16/10',
  'Frontend Developer',
  '2024 — 2025',
  '["HTML5","CSS3","JavaScript","Responsive Grid","UI Component Design"]',
  NULL,
  'https://github.com/jsumaiyarpa/CareShelf',
  '{"overview":"CareShelf is a social-impact initiative designed to reduce student waste and foster resource sharing across university campuses by connecting item donors with peers in need.","problem":"Every academic term, students discard textbooks, stationery, and equipment while incoming students struggle to afford the same materials.","features":"Category-based item browsing; donation submission forms; request workflows; responsive card grid; clean semantic markup.","architecture":"Lightweight client-side application utilizing semantic HTML5, modern CSS custom properties, and modular JavaScript for event-driven DOM updates.","stack":"HTML5, CSS3, JavaScript, Git & GitHub.","implementation":"Built a responsive layout grid adhering to 8pt spatial constraints and optimized touch targets for smartphone screens.","testing":"Tested across modern desktop and mobile browsers to verify fluid image scaling and keyboard form accessibility.","challenges":"Structuring clean CSS without heavy third-party framework overhead. Achieved through a systematic BEM class naming structure and CSS custom properties.","futureImprovements":"Integrating user authentication and direct chat messaging between donor and recipient."}',
  '[{"src":"/images/projects/website/careshelf-site.png","alt":"CareShelf Platform Interface","caption":"Item directory: Search and categorization for community item sharing","ratio":"16/10"}]',
  3,
  1
),
(
  'noor-e-verse',
  'Noor-e-verse - Islamic Learning Web App | Frontend-ongoing',
  '04',
  'software',
  1,
  'compact',
  'In Active Development',
  'A peaceful, distraction-free Islamic learning and daily practice web app for exploring authentic duas, building reflective habits, and nurturing spiritual growth.',
  '/images/projects/website/noor-e-verse-site.png',
  'Noor-e-verse interface design preview',
  '16/10',
  'Frontend & Systems Developer',
  '2024 — Present',
  '["TypeScript","React","Vite","State Management","Modular CSS"]',
  NULL,
  'https://github.com/jsumaiyarpa/noor-e-verse',
  '{"overview":"Noor-e-verse is a personal engineering initiative focusing on tranquil, serene user experience design combined with robust TypeScript typing and offline-first capabilities.","problem":"Many contemporary religious utility applications are cluttered with intrusive advertisements, loud notifications, and convoluted navigation.","features":"Curated dua library with Arabic script, phonetics, and translations; personal habit reflection tracker; audio playback integration; bookmarking system.","architecture":"Modern React application built with TypeScript and Vite, leveraging custom hooks for local persistence and state synchronization.","stack":"TypeScript, React 18, Vite, LocalStorage API, Git.","implementation":"Authored strongly typed interfaces for scripture metadata, prayer time calculation utilities, and accessible audio player controllers.","testing":"Component verification with strict TypeScript compilation checks and manual UI regression audits.","challenges":"Rendering complex right-to-left (RTL) Arabic typography alongside left-to-right (LTR) English translations cleanly on narrow mobile viewports.","futureImprovements":"Adding offline service worker caching and customizable daily reminder schedules."}',
  '[{"src":"/images/projects/website/noor-e-verse-site.png","alt":"Noor-e-verse Application Preview","caption":"Typography hierarchy: Clear dual-script layout with translation metadata","ratio":"16/10"}]',
  4,
  1
),
(
  'attend-ai',
  'AttendAi - A Smart Attendance System | Frontend-ongoing',
  '05',
  'software',
  1,
  'compact',
  'Frontend In Development',
  'A smart attendance tracking web app for managing attendance records by scanning QR codes.',
  '/images/projects/website/attendai-site.png',
  'AttendAi smart QR attendance tracking system preview',
  '16/10',
  'Frontend Developer',
  '2025',
  '["React","JavaScript","QR Code Scanning","CSS3","UI Design"]',
  NULL,
  NULL,
  '{"overview":"AttendAi streamlines classroom and corporate attendance monitoring through rapid QR-code verification, instantaneous student check-in, and automated records management.","problem":"Traditional manual roll calls consume valuable session time and are susceptible to proxy entries and clerical errors.","features":"Dynamic session QR code generator; instant camera QR scanner; real-time attendance dashboard; automated attendance percentage computation; exportable CSV reports.","architecture":"Client-side React architecture integrating HTML5 camera stream access and browser-based QR decoding.","stack":"React, JavaScript, HTML5 Canvas/Video API, Modular CSS, Git.","implementation":"Crafted low-latency video feed scanning controllers with clear visual targeting indicators and immediate audio/haptic feedback on successful scans.","testing":"Tested against low-light conditions, varying camera angles, and mobile browser compatibility.","challenges":"Handling fast QR detection across diverse smartphone camera resolutions without browser lag.","futureImprovements":"Adding facial verification cross-referencing and geolocation boundary fencing."}',
  '[{"src":"/images/projects/website/attendai-site.png","alt":"AttendAi Dashboard Preview","caption":"Smart Attendance Dashboard and QR code scanner module","ratio":"16/10"}]',
  5,
  1
),
(
  'onecitizen-super-app',
  'OneCitizen | Government Super-App Concept',
  '06',
  'uiux',
  1,
  'wide',
  'Case Study Complete',
  'A comprehensive government super-app concept bringing 14 Bangladeshi public services into one mobile platform, featuring clear Bangla guidance and end-to-end application tracking.',
  '/images/projects/uiux/onecitizen.png',
  'OneCitizen mobile application onboarding, home screen, and service tracking',
  '16/10',
  'UI/UX Researcher & Product Designer (Team Project, Ostad Career Track)',
  '2024',
  '["Figma","FigJam","UX Research","User Surveys","User Personas","Wireframing","Prototyping"]',
  'https://www.behance.net/gallery/253588415/OneCitizen-Government-Super-App',
  NULL,
  '{"challenge":"Citizens in Bangladesh frequently face severe friction when accessing civil services due to fragmented governmental websites, conflicting documentation requirements, and zero centralized status visibility.","research":"Our team surveyed 50 citizens and conducted in-depth qualitative interviews with 5 participants of varying digital literacy levels to map real pain points in navigating existing government portals.","findings":"Key user anxieties stemmed from opaque review stages, fear of rejection due to missing paperwork, and difficult language barriers. 82% of respondents requested a single dashboard with live application status tracking and localized Bangla prompts.","personas":"Developed user archetypes representing both tech-savvy young adults applying for academic passports and older rural citizens navigating pension services.","journeyMaps":"Mapped the application lifecycle from document upload through verification and dispatch, reducing drop-off touchpoints by introducing real-time document validation checklist alerts.","userFlows":"Engineered streamlined user flows for user authentication, service discovery, national ID integration, and progress milestones.","wireframes":"Crafted low and mid-fidelity wireframes in Figma, testing navigational hierarchy and button accessibility before applying visual styling.","iterations":"Increased primary button heights to 52px for comfortable thumb navigation and refined Bangla font legibility across small display viewports.","finalScreens":"Produced high-fidelity screens covering 14 government services, interactive status timelines, digital document vaults, and biometric login.","prototype":"Connected comprehensive Figma prototypes with animated transitions demonstrating user onboarding, form submission, and tracking.","individualContribution":"As a key team researcher and designer, I conducted user interview analyses, mapped the user onboarding and application status tracking flows, designed core form input states, and contributed to the component design system."}',
  '[{"src":"/images/projects/uiux/onecitizen.png","alt":"OneCitizen Public Service Directory & Mobile Dashboard","caption":"High-fidelity mobile screens: 14 public services and live application status timeline","ratio":"16/10"}]',
  6,
  1
),
(
  'medilink-ehealth',
  'MediLink | e-Health Card Concept',
  '07',
  'uiux',
  1,
  'compact',
  'Research & Concept Design',
  'A centralized digital healthcare card concept designed to streamline patient medical histories, prescription archives, and emergency clinical access.',
  '/images/projects/uiux/medilink.png',
  'MediLink patient dashboard and digital medical card preview',
  '16/10',
  'Lead UI/UX Designer & Researcher',
  '2024',
  '["Figma","UX Research","Information Architecture","User Testing","WCAG AAA"]',
  'https://www.behance.net/gallery/251213865/MediLink',
  NULL,
  '{"challenge":"In Bangladesh, medical records remain largely decentralized on physical paper prescriptions that are frequently misplaced, leading to dangerous diagnostic oversights in emergency hospital visits.","research":"Interviewed patients and reviewed emergency intake procedures to understand critical clinical data requirements under time-sensitive constraints.","findings":"Emergency medical staff require immediate access to blood group, allergy data, and current prescriptions, whereas patients need a calm, reassuring interface for routine scheduling.","personas":"Defined primary personas: The Chronic Patient managing multi-doctor consultations, and the Emergency First Responder needing instant medical flag readouts.","journeyMaps":"Architected the emergency scan sequence allowing first responders to access life-saving medical alerts via NFC/QR scan in under 3 seconds.","userFlows":"Streamlined doctor appointment booking, prescription refills, and medical history export workflows.","wireframes":"Drafted clean spatial layouts prioritizing readable data blocks and high-contrast alert indicators.","iterations":"Replaced dense medical jargon with intuitive visual icons and tested high-contrast color pairings for clinical environments.","finalScreens":"Designed responsive mobile interfaces featuring a digital e-Health card, categorized medical timeline, and encrypted records vault.","prototype":"Interactive Figma prototype demonstrating rapid emergency record display and doctor appointment scheduling.","individualContribution":"Sole designer responsible for end-to-end UX research, wireframing, high-fidelity UI design, and interactive prototype execution."}',
  '[{"src":"/images/projects/uiux/medilink.png","alt":"e-Health Card & Patient Emergency Summary","caption":"Primary screen: Quick-glance digital health card with emergency medical tags","ratio":"16/10"}]',
  7,
  1
),
(
  'resumexi-builder',
  'ResumeXi | Smart CV Builder Interface',
  '08',
  'uiux',
  0,
  'compact',
  'Design Exploration',
  'A streamlined web interface concept designed to simplify resume generation through real-time section previews, structural guidance, and ATS formatting compliance.',
  '/images/projects/uiux/resumexi.png',
  'ResumeXi editor interface and split-pane layout',
  '16/10',
  'UI Designer',
  '2024',
  '["Figma","Design Systems","Editorial Layout","Form UX"]',
  'https://www.behance.net/gallery/251867575/ResumeXi',
  NULL,
  '{"challenge":"Early-career applicants frequently face formatting frustration in word processors, resulting in misaligned resumes that fail automated applicant tracking systems (ATS).","research":"Analyzed common resume rejection factors and surveyed graduating students regarding their primary pain points in drafting CVs.","findings":"Users require real-time visual feedback alongside smart suggestions for action verbs and clean typography standards.","wireframes":"Developed a dual-pane editor layout pairing structural form input on the left with a live document rendering on the right.","finalScreens":"High-fidelity design system featuring modular resume cards, font pairing pickers, and export configuration drawers.","individualContribution":"Designed the complete split-pane editor interface, typographic token system, and user interaction states in Figma."}',
  '[{"src":"/images/projects/uiux/resumexi.png","alt":"ResumeXi Split-Pane Editor","caption":"Editor interface: Side-by-side data entry and live ATS document rendering","ratio":"16/10"}]',
  8,
  1
),
(
  'hideme-vpn-concept',
  'hide.me VPN | Security & Privacy App Concept',
  '09',
  'uiux',
  0,
  'compact',
  'Concept & Visual Design',
  'A streamlined mobile VPN interface concept engineered for seamless security onboarding, one-tap global server switching, kill-switch protection, and transparent latency metrics.',
  '/images/projects/uiux/hidemevpn.png',
  'Hide.me VPN mobile app interface showing server locations and connection status',
  '16/10',
  'UI/UX Designer',
  '2024',
  '["Figma","UI Design","Information Architecture","Prototyping","Security UX"]',
  'https://www.behance.net/gallery/255229615/hide-me-VPN-Hybrid-Design-System',
  NULL,
  '{"challenge":"Users frequently find privacy and VPN applications confusing or intimidating due to cryptic protocol acronyms, cluttered server lists, and ambiguous connection states.","research":"Benchmarked leading desktop and mobile privacy tools to pinpoint friction points during server selection, latency comparison, and kill-switch activation.","findings":"Identified that clear visual indicators for ping latency, geographic server proximity, and unambiguous protection badges significantly increase user confidence.","personas":"The Privacy-Conscious Student needing secure campus Wi-Fi browsing and rapid bypass for restricted academic research portals.","journeyMaps":"Mapped the connection workflow to enable rapid 1-tap protection directly from the home screen while providing expandable advanced protocol controls.","wireframes":"Created balanced mobile layouts featuring prominent connection toggle buttons, server cards, and latency metrics.","finalScreens":"Delivered sleek, high-contrast dark-mode mobile screens featuring real-time connection status, server speeds, and interactive configuration drawers.","individualContribution":"Designed the complete mobile interface, server browsing cards, connection state animations, and component design tokens in Figma."}',
  '[{"src":"/images/projects/uiux/hidemevpn.png","alt":"Hide.me VPN Mobile Connection & Server Selection","caption":"High-fidelity mobile UI: Connection status, global server picker, and protocol settings","ratio":"16/10"}]',
  9,
  1
),
(
  'finalert-finance',
  'FinAlert | Personal Finance & Budget Tracker',
  '10',
  'uiux',
  0,
  'compact',
  'Concept Prototype',
  'A mobile personal finance management concept addressing cognitive fatigue in student budget tracking through predictive spending alerts and visual expense categorization.',
  '/images/projects/uiux/finalert-uiux.png',
  'FinAlert mobile budgeting interface with expense analytics',
  '16/10',
  'Product Designer',
  '2024',
  '["Figma","Competitive Benchmarking","Data Visualization","Micro-Interactions"]',
  NULL,
  NULL,
  '{"challenge":"University students and young adults often abandon budgeting applications because manual transaction entry is tedious and financial graphs feel overly complex.","research":"Benchmarked 6 leading global and regional financial apps, identifying high cognitive drop-off during manual categorization.","findings":"Users prefer proactive budget alerts over retrospective guilt-inducing monthly summaries.","personas":"The University Student balancing semester tuition and daily living expenses on a fixed monthly allowance.","journeyMaps":"Reduced daily expense logging to a 2-tap gesture sequence directly from the application lockscreen widget.","userFlows":"Designed budget setup wizard, recurring payment detection, and savings goal milestones.","wireframes":"Created clear visual hierarchies balancing numerical account balances with visual progress bars.","iterations":"Simplified analytical charts into digestible category bars and added cheerful milestone micro-celebrations.","finalScreens":"Delivered sleek, friendly mobile interfaces incorporating soft dark/light themes and intuitive financial charts.","prototype":"Interactive prototype highlighting rapid transaction logging and real-time category budget updates.","individualContribution":"Researched competitive user friction points, drafted all wireframe iterations, and designed the high-fidelity UI kit."}',
  '[{"src":"/images/projects/uiux/finalert-uiux.png","alt":"FinAlert Dashboard & Expense Breakdown","caption":"Analytics view: Category breakdown and proactive weekly spending forecasts","ratio":"16/10"}]',
  10,
  1
),
(
  'design-pohela-baishakh',
  'Pohela Boishakh Cultural Celebration Poster',
  '11',
  'graphic',
  1,
  'compact',
  'Campus Poster',
  '',
  '/images/projects/designs/PohelaBaishakh_ECC.png',
  'Pohela Boishakh Cultural Celebration campus poster',
  '3/4',
  'Visual Designer',
  '2024',
  '["Canva Pro","Typography","Cultural Design"]',
  NULL,
  NULL,
  '{}',
  '[{"src":"/images/projects/designs/PohelaBaishakh_ECC.png","alt":"Pohela Boishakh Cultural Celebration Poster","caption":"Campus celebration poster for Pohela Baishakh cultural festivities","ratio":"3/4"}]',
  11,
  1
),
(
  'design-eid-ul-fitr',
  'Eid-ul-Fitr Festival Poster',
  '12',
  'graphic',
  1,
  'compact',
  'Campus Campaign',
  '',
  '/images/projects/designs/EidUlFitr_ECC.png',
  'Eid-ul-Fitr Festival Poster',
  '1/1',
  'Visual Designer',
  '2024',
  '["Canva Pro","Digital Art","Festival Branding"]',
  NULL,
  NULL,
  '{}',
  '[{"src":"/images/projects/designs/EidUlFitr_ECC.png","alt":"Eid-ul-Fitr Festival Poster","caption":"Digital club campaign graphic for Eid-Ul-Fitr","ratio":"1/1"}]',
  12,
  1
),
(
  'design-eid-ul-adha',
  'Eid-ul-Adha Festival Poster',
  '13',
  'graphic',
  1,
  'compact',
  'Campus Campaign',
  '',
  '/images/projects/designs/EidUlAdha_ECC.png',
  'Eid-ul-Adha Festival Poster',
  '1/1',
  'Visual Designer',
  '2024',
  '["Canva Pro","Social Media Design"]',
  NULL,
  NULL,
  '{}',
  '[{"src":"/images/projects/designs/EidUlAdha_ECC.png","alt":"Eid-ul-Adha Festival Poster","caption":"Social media announcement collateral for Eid-Ul-Adha","ratio":"1/1"}]',
  13,
  1
),
(
  'design-banglay-ielts-cover',
  'Banglay IELTS Campaign Banner',
  '14',
  'graphic',
  1,
  'compact',
  'Campaign Collateral',
  '',
  '/images/projects/designs/BanglayIELTS_cover.png',
  'Banglay IELTS Campaign Banner',
  '16/9',
  'Campus Crew / Visual Designer',
  '2025',
  '["Canva Pro","Digital Branding","Typography"]',
  NULL,
  NULL,
  '{}',
  '[{"src":"/images/projects/designs/BanglayIELTS_cover.png","alt":"Banglay IELTS Campaign Banner","caption":"Promotional cover banner designed for student outreach","ratio":"16/9"}]',
  14,
  1
),
(
  'design-banglay-ielts-offer',
  'Banglay IELTS Promotional Offer',
  '15',
  'graphic',
  0,
  'compact',
  'Promotional Poster',
  '',
  '/images/projects/designs/BanglayIELTS_offer.png',
  'Banglay IELTS Promotional Offer poster',
  '1/1',
  'Campus Crew / Visual Designer',
  '2025',
  '["Canva Pro","Promotional Layout","Social Graphics"]',
  NULL,
  NULL,
  '{}',
  '[{"src":"/images/projects/designs/BanglayIELTS_offer.png","alt":"Banglay IELTS Promotional Offer","caption":"Special discount offer campaign announcement","ratio":"1/1"}]',
  15,
  1
),
(
  'design-feb21-ecc',
  'International Mother Language Day (Feb 21)',
  '16',
  'graphic',
  1,
  'compact',
  'Campus Poster',
  '',
  '/images/projects/designs/Feb21_ECC.png',
  'International Mother Language Day commemorative poster',
  '3/4',
  'Head of Sub-Executives & Volunteers',
  '2024',
  '["Canva Pro","Cultural Poster","Print Ready"]',
  NULL,
  NULL,
  '{}',
  '[{"src":"/images/projects/designs/Feb21_ECC.png","alt":"International Mother Language Day Poster","caption":"Print-ready campus event poster for International Mother Language Day","ratio":"3/4"}]',
  16,
  1
),
(
  'design-eid-card',
  'Eid Mubarak Greeting Card',
  '17',
  'graphic',
  0,
  'compact',
  'Greeting Card',
  '',
  '/images/projects/designs/EidCard_ECC.png',
  'Festive Community Eid Greeting Card',
  '1/1',
  'Visual Designer',
  '2024',
  '["Canva Pro","Vector Art","Festive Greeting"]',
  NULL,
  NULL,
  '{}',
  '[{"src":"/images/projects/designs/EidCard_ECC.png","alt":"Festive Community Eid Greeting Card","caption":"Festive community greeting card collateral","ratio":"1/1"}]',
  17,
  1
),
(
  'design-ewu-banner',
  'East West University Promotional Banner',
  '18',
  'graphic',
  0,
  'compact',
  'Campus Visual',
  '',
  '/images/projects/designs/ewu_design.png',
  'East West University Campus Design visual',
  '16/9',
  'Visual Designer',
  '2024',
  '["Canva Pro","Campus Branding","Digital Poster"]',
  NULL,
  NULL,
  '{}',
  '[{"src":"/images/projects/designs/ewu_design.png","alt":"East West University Campus Design","caption":"Promotional visual collateral for East West University","ratio":"16/9"}]',
  18,
  1
),
(
  'sqa-automation-assessment',
  'sqa_automation_assessment',
  '19',
  'sqa',
  1,
  'wide',
  'Assessment Suite Complete',
  'Software QA Automation Assessment for OSTAD, covering UI automation with Selenium WebDriver and Mocha, API testing with Postman and Newman, and automated test reporting.',
  '',
  'sqa_automation_assessment GitHub repository preview',
  '16/10',
  'QA Engineer Trainee (Ostad SQA Program)',
  '2024',
  '["Selenium WebDriver","Mocha","Postman","Newman CLI","JavaScript","HTML Reports","Test Cases"]',
  NULL,
  'https://github.com/jsumaiyarpa/sqa_automation_assessment',
  '{"scope":"End-to-end quality assurance verification covering both RESTful API endpoints and critical user interface workflows on target web applications.","testScenarios":"Authored exhaustive positive, negative, and edge-case test scenarios for authentication, transaction validation, and session handling.","testCases":"Documented detailed test cases specifying preconditions, test data, manual steps, expected results, and actual assertion checkpoints.","apiRequests":"Built comprehensive Postman collections validating HTTP status codes, response time constraints (<500ms), and schema contracts.","assertions":"Automated Postman JavaScript tests verifying JSON response structure, session token extraction, and data consistency across sequential endpoints.","executionResults":"Executed automated regression runs via Newman CLI and generated HTML test summary reports documenting 100% test completion and passing assertions.","bugInvestigation":"Logged defect tickets detailing step-by-step reproduction instructions, payload dumps, and severity classifications.","testReports":"Generated Newman HTML reporter deliverables summarizing passed/failed assertion counts, latency trends, and endpoint coverage."}',
  '[]',
  19,
  1
),
(
  'cs423-solid-team3-query',
  'CS423-SOLID-TEAM3_QUERY',
  '20',
  'sqa',
  1,
  'compact',
  'Academic Assignment',
  'CSE423 Software Architecture Assignment.',
  '',
  'CS423-SOLID-TEAM3_QUERY GitHub repository preview',
  '16/10',
  'Team Contributor (East West University)',
  '2024',
  '["Java","SOLID Principles","Object-Oriented Design","Design Patterns","JUnit"]',
  NULL,
  'https://github.com/jsumaiyarpa/CS423-SOLID-TEAM3_QUERY',
  '{"scope":"Engineered for CSE423 at East West University demonstrating architectural decoupling, SOLID object-oriented principles, and query management in Java.","testScenarios":"Designed test scenarios evaluating query parsing, abstract factory handlers, and interface segregation.","testCases":"Wrote unit test cases verifying decoupled business rules and exception handling.","apiRequests":"Query interface mapping demonstrating polymorphic query processing.","assertions":"Automated unit test assertions for data access object isolation and boundary validation.","executionResults":"Clean passing test execution confirming adherence to SOLID principles.","bugInvestigation":"Refactored tightly-coupled queries into maintainable, polymorphic strategy interfaces.","testReports":"Generated structural verification documentation for academic evaluation."}',
  '[]',
  20,
  1
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 08. REVIEWS (ALL 4 VERBATIM REVIEWS)
-- Source: src/data/reviews.js
-- ============================================================================
INSERT INTO reviews (
  id, reviewer_name, author, image, quote, testimonial, sort_order, is_published
)
VALUES
(
  '00000000-0000-0000-0000-000000000031',
  'Rafid Hasan',
  'Rafid Hasan',
  '/images/reviews/rafid-hasan.jpeg',
  'Sumaiya is one of the most driven people I know. She has a real talent for jumping into projects, communicating clearly, and keeping a team’s energy up. Her dedication to leveling up her skills in software engineering and UI/UX design is incredibly impressive. She’s exactly the kind of positive, forward-thinking person you want on your team, and I know she''s going to do great things.',
  'Sumaiya is one of the most driven people I know. She has a real talent for jumping into projects, communicating clearly, and keeping a team’s energy up. Her dedication to leveling up her skills in software engineering and UI/UX design is incredibly impressive. She’s exactly the kind of positive, forward-thinking person you want on your team, and I know she''s going to do great things.',
  1,
  1
),
(
  '00000000-0000-0000-0000-000000000032',
  'Sumaya Rahman',
  'Sumaya Rahman',
  '/images/reviews/sumaya-rahman.jpeg',
  'She is a dedicated and enthusiastic individual with a strong willingness to learn and grow. Her involvement in academic projects, leadership, and teamwork reflects her commitment to personal and professional development. She has a positive attitude, good communication skills, and a genuine interest in improving her knowledge of software engineering and UI/UX design. I wish her all the best in her future endeavors and career.',
  'She is a dedicated and enthusiastic individual with a strong willingness to learn and grow. Her involvement in academic projects, leadership, and teamwork reflects her commitment to personal and professional development. She has a positive attitude, good communication skills, and a genuine interest in improving her knowledge of software engineering and UI/UX design. I wish her all the best in her future endeavors and career.',
  2,
  1
),
(
  '00000000-0000-0000-0000-000000000033',
  'Rawan',
  'Rawan',
  '/images/reviews/rawan-hasan.jpeg',
  'Sumaiya Jannat is one of my dedicated and hardworking friend. In her academic life she has been an outstanding student and also inspiring. She was involved in clubs co curriculum activities and such a multi talented girl. Now she is engaged in UI/Ux designing and focusing on her future career goal. Hope she will do her best!',
  'Sumaiya Jannat is one of my dedicated and hardworking friend. In her academic life she has been an outstanding student and also inspiring. She was involved in clubs co curriculum activities and such a multi talented girl. Now she is engaged in UI/Ux designing and focusing on her future career goal. Hope she will do her best!',
  3,
  1
),
(
  '00000000-0000-0000-0000-000000000034',
  'Mashiur Rahaman',
  'Mashiur Rahaman',
  '/images/reviews/mashiur-rahaman.jpeg',
  'Jannat is passionate about UI/UX, web development and SQA. She’s dedicated, eager to learn, and always brings creativity and kindness to her work. A great person to work with!',
  'Jannat is passionate about UI/UX, web development and SQA. She’s dedicated, eager to learn, and always brings creativity and kindness to her work. A great person to work with!',
  4,
  1
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 09. CERTIFICATES & HONORS (ALL 14 VERBATIM RECORDS FROM src/pages.jsx)
-- ============================================================================
INSERT INTO certificates (
  id, category, title, organization, date_issued, certificate_type, description, image, url, sort_order, is_published
)
VALUES
(
  '00000000-0000-0000-0000-000000000401',
  'UI/UX DESIGN',
  'UI/UX Design Career Track Program',
  'OSTAD',
  'Issued August 2026',
  'Certificate of Completion',
  NULL,
  '/images/certificates/ostad_marks_uiux.png',
  'https://ostad.app/share/certificate/c47328-sumaiya-jannat-arpa',
  1,
  1
),
(
  '00000000-0000-0000-0000-000000000402',
  'UI/UX DESIGN',
  'UI/UX Design Career Track Program',
  'OSTAD',
  'Issued August 2026',
  'Certificate of Assessment',
  NULL,
  '/images/certificates/ostad_certificate_uiux.png',
  'https://ostad.app/share/certificate/c47329-sumaiya-jannat-arpa',
  2,
  1
),
(
  '00000000-0000-0000-0000-000000000403',
  'ACADEMIC HONOR',
  '100% Merit Scholarship',
  'East West University',
  'March 2023',
  NULL,
  'Awarded for four years, from Fall 2022 to Summer 2026, on the basis of SSC and HSC results.',
  '/images/certificates/meritEWU.png',
  'https://www.ewubd.edu/storage/app/uploads/public/633/955/5d0/6339555d01897026666955.pdf',
  3,
  1
),
(
  '00000000-0000-0000-0000-000000000404',
  'SCHOLARSHIP',
  'Medha Lalon Fund Scholarship',
  'East West University',
  'September 2025',
  NULL,
  'Scholarship of BDT 45,000 covering Fall 2025, Spring 2026 and Summer 2026.',
  NULL,
  NULL,
  4,
  1
),
(
  '00000000-0000-0000-0000-000000000405',
  'AI & DATA',
  'Data Analytics in the AI Era',
  'Grameenphone Ltd.',
  'October 2026',
  'Certificate of Completion',
  NULL,
  '/images/certificates/dataAnalytics_gp.png',
  'https://www.grameenphone.academy/cert/4d0d76a94ed7',
  5,
  1
),
(
  '00000000-0000-0000-0000-000000000406',
  'AI & DATA',
  'Data Foundations with AI',
  'Grameenphone Ltd.',
  'September 2026',
  'Certificate of Completion',
  NULL,
  '/images/certificates/dataFoundations_gp.png',
  'https://www.grameenphone.academy/cert/8967ba193ae6',
  6,
  1
),
(
  '00000000-0000-0000-0000-000000000407',
  'AI & DATA',
  'AI-Powered Analytics',
  'Grameenphone Ltd.',
  'September 2026',
  'Certificate of Completion',
  NULL,
  '/images/certificates/aiAnalytics_gp.png',
  'https://www.grameenphone.academy/cert/328de029d7fb',
  7,
  1
),
(
  '00000000-0000-0000-0000-000000000408',
  'AI & DATA',
  'From Insights to Influence',
  'Grameenphone Ltd.',
  'September 2026',
  'Certificate of Completion',
  NULL,
  '/images/certificates/insights2influence_gp.png',
  'https://www.grameenphone.academy/cert/7acbf531d985',
  8,
  1
),
(
  '00000000-0000-0000-0000-000000000409',
  'PROFESSIONAL DEVELOPMENT',
  'Unlock Career Opportunities – ERP Decoded',
  'Dot BD Solutions Limited',
  'December 2025',
  'Certificate of Participation',
  NULL,
  '/images/certificates/dotBD_career.png',
  NULL,
  9,
  1
),
(
  '00000000-0000-0000-0000-000000000410',
  'COMPETITION',
  '1st IELC National English Language Carnival',
  'Ideal English Language Club (IELC)',
  'January 2017',
  'Participation Certificate',
  'Wall Magazine Competition. Associated with Ideal School and College.',
  '/images/certificates/ielcPrize.png',
  NULL,
  10,
  1
),
(
  '00000000-0000-0000-0000-000000000411',
  'CERTIFICATE ARCHIVE',
  'Other Certificates and Crests',
  'School achievements',
  NULL,
  NULL,
  'A collection of certificates and crests from school days.',
  '/images/certificates/otherCertficates.png',
  NULL,
  11,
  1
),
(
  '00000000-0000-0000-0000-000000000412',
  'NATIONAL RECOGNITION',
  'Children''s Gathering with the Honorable President',
  'Bangladesh Shishu Academy',
  '2015',
  'Official Participant Pass',
  'Selected as a trainee of Bangladesh Shishu Academy to participate in the special children’s gathering with the Honorable President at Bangabhaban (2015).',
  '/images/certificates/shishuAcademy.png',
  NULL,
  12,
  1
),
(
  '00000000-0000-0000-0000-000000000413',
  'PERFORMING ARTS',
  'Classical Dance',
  'Bangladesh Shishu Academy, Dhaka, Bangladesh',
  'July 2013 – June 2016',
  'Completion Certificate',
  'Completed a three-year certificate course in Nrittyakala (Classical Dance), gaining experience in classical and contemporary dance forms. Performed in cultural programs and annual dance showcases, including events on BTV and Ittadi. Collaborated in choreography and group performances, strengthening teamwork, coordination and confidence.',
  '/images/certificates/dance_shishuAcademy.png',
  NULL,
  13,
  1
),
(
  '00000000-0000-0000-0000-000000000414',
  'VISUAL ARTS',
  'Drawing and Painting',
  'Bangladesh Shishu Academy, Dhaka, Bangladesh',
  'July 2010 – June 2013',
  'Completion Certificate',
  'Completed a three-year certificate course in drawing and painting, focusing on visual composition, creativity and fine arts fundamentals. Participated in art exhibitions and creative workshops, including activities associated with Channel i.',
  '/images/certificates/art_shishuAcademy.png',
  NULL,
  14,
  1
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 10. FAQS (ALL 5 VERBATIM QUESTIONS & ANSWERS)
-- Source: src/data/faq.js
-- ============================================================================
INSERT INTO faqs (id, question, answer, sort_order, is_published)
VALUES
(
  '00000000-0000-0000-0000-000000000051',
  'How does Sumaiya approach designing and building a project?',
  'She begins by understanding the problem and the people who will use the product. She then explores ideas, maps out user flows, creates wireframes and UI designs, and gradually moves towards implementation, testing, and refinement.',
  1,
  1
),
(
  '00000000-0000-0000-0000-000000000052',
  'What guides her approach to UI/UX design?',
  'She focuses on creating intuitive, accessible, and visually consistent interfaces. Her design process considers user needs, information hierarchy, navigation, and interaction details to create meaningful digital experiences.',
  2,
  1
),
(
  '00000000-0000-0000-0000-000000000053',
  'How does she approach software quality assurance?',
  'She explores different scenarios, tests functionality, identifies unexpected behavior, and refines the overall experience. She is continuously developing her Software Quality Assurance skills, with practical exposure to Selenium and API testing.',
  3,
  1
),
(
  '00000000-0000-0000-0000-000000000054',
  'Which technologies and tools does she work with?',
  'Her current experience includes HTML, CSS, JavaScript, Python, Django, Java, React, Figma, Canva, and software testing tools. She continues to expand her technical knowledge through practical projects and continuous learning.',
  4,
  1
),
(
  '00000000-0000-0000-0000-000000000055',
  'What is she currently learning and exploring?',
  'She is continuing to develop her skills in software engineering, UI/UX design, full-stack web development, and Software Quality Assurance while exploring new technologies and building practical projects.',
  5,
  1
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 11. SOCIAL LINKS (ALL 4 CONTACT CHANNELS)
-- Source: src/data/site.js (socials)
-- ============================================================================
INSERT INTO social_links (id, platform_id, label, handle, url, icon, sort_order, is_active, is_published)
VALUES
(
  '00000000-0000-0000-0000-000000000061',
  'github',
  'GitHub',
  'jsumaiyarpa',
  'https://github.com/jsumaiyarpa',
  'github',
  1,
  1,
  1
),
(
  '00000000-0000-0000-0000-000000000062',
  'linkedin',
  'LinkedIn',
  'sumaiya-jannat-arpa',
  'https://www.linkedin.com/in/sumaiya-jannat-arpa/',
  'linkedin',
  2,
  1,
  1
),
(
  '00000000-0000-0000-0000-000000000063',
  'behance',
  'Behance',
  'sumaiyaarpa2',
  'https://www.behance.net/sumaiyaarpa2',
  'behance',
  3,
  1,
  1
),
(
  '00000000-0000-0000-0000-000000000064',
  'email',
  'Email',
  'jannat.sumaiyarpa@gmail.com',
  'mailto:jannat.sumaiyarpa@gmail.com',
  'mail',
  4,
  1,
  1
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 12. GALLERY ITEMS (ALL 8 CANVA SHOWCASE ITEMS)
-- Source: src/data/gallery.js
-- ============================================================================
INSERT INTO gallery_items (
  id, item_code, title, category, organization, year, tools, ratio, dimensions, contribution, description, src, sort_order, is_published
)
VALUES
(
  '00000000-0000-0000-0000-000000000071',
  '01',
  'EWUECC Workshop & Seminar Poster',
  'Event Poster',
  'EWU English Conversation Club (EWUECC)',
  '2024',
  'Canva Pro / Typography Layout',
  '3/4',
  'Portrait 3:4 (A3 Campus Print)',
  'Creative concept, bilingual typography hierarchy, and print-ready vector preparation',
  'High-visibility campus event poster designed for EWUECC interactive language workshops, combining clean typographic hierarchy with engaging headline callouts.',
  '',
  1,
  1
),
(
  '00000000-0000-0000-0000-000000000072',
  '02',
  'Club Recruitment & Welcome Campaign',
  'Social Media Visual',
  'EWU English Conversation Club',
  '2024',
  'Canva Pro / Graphic Composition',
  '1/1',
  'Square 1:1 (Social Feed Carousel)',
  'Visual branding, color grading, and social template layout',
  'Engaging social media graphic series produced for semester club recruitment drives, driving record member onboarding across campus departments.',
  '',
  2,
  1
),
(
  '00000000-0000-0000-0000-000000000073',
  '03',
  'Auditorium Orientation Stage Backdrop',
  'Promotional Banner',
  'EWU English Conversation Club',
  '2024',
  'Canva Pro / Widescreen Vector Design',
  '16/9',
  'Landscape 16:9 (Stage Backdrop & Digital Header)',
  'Large-format auditorium backdrop design and event presentation slide decks',
  'Wide-format stage banner for the annual club orientation symposium, featuring modern geometric motifs and high-contrast typography readable from 50 feet away.',
  '',
  3,
  1
),
(
  '00000000-0000-0000-0000-000000000074',
  '04',
  'National Olympiad Campus Announcement',
  'Event Poster',
  'Campus Crew Banglay IELTS & English Olympiad',
  '2021',
  'Canva / Graphic Layout',
  '4/5',
  'Portrait 4:5 (Campus Bulletin & Digital)',
  'Promotional campaign layout, participant registration formatting, and branding',
  'National competition promotional poster designed to drive student participation across colleges, structuring schedule and registration details clearly.',
  '',
  4,
  1
),
(
  '00000000-0000-0000-0000-000000000075',
  '05',
  'Community Social Outreach Poster',
  'Campaign Graphic',
  'AHOBAN Foundation',
  '2023',
  'Canva / Typography Systems',
  '3/4',
  'Portrait 3:4 (Print Poster & Social)',
  'Visual storytelling, bilingual copywriting alignment, and campaign infographic design',
  'Civic awareness graphic created to communicate community support initiatives, leveraging warm editorial tones and clear infographic highlights.',
  '',
  5,
  1
),
(
  '00000000-0000-0000-0000-000000000076',
  '06',
  'ISTARC Science & Technology Exhibition Banner',
  'Promotional Banner',
  'ISTARC',
  '2021',
  'Canva / Digital Design',
  '16/9',
  'Landscape 16:9 (Event Announcement)',
  'Digital banner formatting, asset compression, and visual alignment',
  'Promotional header communicating exhibition schedule and workshop guidelines for science fair participants and student visitors.',
  '',
  6,
  1
),
(
  '00000000-0000-0000-0000-000000000077',
  '07',
  'Arty-techture-art — Creative Study',
  'Personal Creative Work',
  'Independent Creative Roots',
  '2022',
  'Digital Illustration / Canva',
  '1/1',
  'Square 1:1 (Art Portfolio)',
  'Self-directed visual composition exploring color theory, contrast, and structure',
  'A visual composition from earlier creative work on the Arty-techture-art platform, exploring geometric harmony and structural forms.',
  '',
  7,
  1
),
(
  '00000000-0000-0000-0000-000000000078',
  '08',
  'Cody.techture — Tech & Creative Thumbnail',
  'Personal Creative Work',
  'Cody.techture Creative Channel',
  '2023',
  'Canva / Graphic Hierarchy',
  '16/9',
  'Landscape 16:9 (Video & Cover Specimen)',
  'Visual branding and digital thumbnail layout for creative technology explorations',
  'Editorial visual designed for the Cody.techture creative coding project, balancing technical code callouts with artistic color palettes.',
  '',
  8,
  1
)
ON CONFLICT (id) DO NOTHING;
