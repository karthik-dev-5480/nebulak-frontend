// components/KarthikPortfolioUnfold.tsx

"use client";

import React, { useState } from "react";
import { Briefcase, BookOpen, Code, Lightbulb, GraduationCap, Trophy, FileText, Mail, Phone, Link, Menu, X, ArrowRight } from 'lucide-react';

const THEME_COLOR_CLASS = "text-blue-500";
const THEME_HOVER_CLASS = "hover:text-blue-500";
const THEME_BACKGROUND_CLASS = "bg-blue-500"; 
const THEME_BORDER_CLASS = "border-blue-500";

// --- STATIC RESUME DATA (Cleaned of citation markers) ---

const resumeData = {
    personal: {
        name: "Cheekati Karthik",
        title: "Software Engineer",
        phone: "+91-7995675480",
        email: "dev.karthik.cheekati@gmail.com",
        // !! IMPORTANT: REPLACE THESE PLACEHOLDER URLS !!
        github: "https://github.com/YourGitHub", 
        linkedin: "https://linkedin.com/in/YourLinkedIn", 
        location: "Hyderabad",
    },
    skills: {
        technical: [
            { name: "Java/Spring Boot", level: 95 }, 
            { name: "React JS", level: 90 },
            { name: "HTML/CSS (Tailwind)", level: 99 },
            { name: "Python/Django", level: 85 },
            { name: "SQL/Database (MySql, SSMS)", level: 92 },
            { name: "Microservices/REST", level: 90 },
        ],
        raw: {
            languages: ["Java", "Sql", "Python"],
            frameworks: ["Spring Boot", "Spring Data JPA", "Spring Security", "Restful API", "Microservices", "Django"],
            frontend: ["HTML", "CSS (Tailwind)", "Webix", "Bootstrap", "JavaScript", "React JS"],
            cloud_db: ["MySql", "AWS (EC2, Fargate, EBS, RDS, S3)"],
            tools: ["VS Code", "SSMS", "Jupyter Notebook", "Azure Data studio"],
            interests: ["Data Structures and Algorithms", "Machine Learning", "Data Science", "Artificial Intelligence"]
        }
    },
    projects: [
        {
            title: "eCommerce Application",
            description: "Developed a dynamic e-commerce platform with Python, Django, Razorpay, AWS for Single vendor.",
            tags: "Python, Django, Razorpay, AWS",
            imageUrl: "https://via.placeholder.com/300x400/1C1C1C/FFFFFF?text=E-Commerce+Project",
        },
        {
            title: "Face Recognition Attendance System",
            description: "Developed a face recognition attendance system which identify faces and tracks attendance.",
            tags: "Python, Django, PyTorch",
            imageUrl: "https://via.placeholder.com/300x400/222222/FFFFFF?text=Face+Recognition+ML",
        },
        {
            title: "OCR Web Application",
            description: "Developed the back-end of an OCR web application that converts handwritten receipts into digital invoices using TensorFlow and Keras.",
            tags: "TensorFlow, Keras, ML, Python",
            imageUrl: "https://via.placeholder.com/300x400/2C2C2C/FFFFFF?text=OCR+Invoice+App",
        },
    ],
    experience: [
        {
            title: "Software Engineer",
            company: "ZerocodeHr",
            duration: "June, 2024 - Present",
            description: "Worked on a Long-Term Incentives Management product, developing front-end widgets using React, integrating APIs, developing back-end controllers and service-layer classes, and currently developing stored procedures for database operations.",
        },
        {
            title: "ML Developer",
            company: "IdeaBytes",
            duration: "Dec. 2022 - Jan. 2023",
            description: "Developed the back-end of an OCR web application that converts handwritten receipts into digital invoices using TensorFlow and Keras Python libraries.",
        },
        {
            title: "Python Developer",
            company: "Padaayi",
            duration: "Mar - May, 2022",
            description: "Developed the back-end of a certification automation project that automates certificate generation, utilizing the PIL library for writing functionality.",
        },
    ],
    education: [
        {
            degree: "B. Tech Computer Science and Engineering (Data Science)",
            institution: "Institute of Aeronautical Engineering, Hyderabad",
            duration: "2020-2024",
            gpa: "CGPA: 7.5",
        },
        {
            degree: "Telangana State Board of Intermediate Education",
            institution: "Sri Chaitanya Junior Collage, Hyderabad",
            duration: "2020",
            gpa: "Percentage: 91.8",
        },
        {
            degree: "Central Board of Secondary Education",
            institution: "Dr. KKR's Gowtham Concept School, Hyderabad",
            duration: "2018",
            gpa: "CGPA: 84.2",
        },
    ],
    responsibilities: [
        { role: "Technical Mentor", organization: "Technical Association of Data Science, IARE", duration: "Jan. 2022-2024" },
        { role: "Project Lead", organization: "B. Tech Major Project", duration: "2023 - 2024" }
    ],
    achievements: [
        { name: "Data Science Professional Certification (IBM)" },
        { name: "Data Mining Certification (NPTEL - IIT Kharagpur)" }
    ],
    publications: [
        {
            title: "Efficient Student Attendance Tracking Using Yolov5",
            conference: "14 ICRET 2023 Hybrid International Conference",
            date: "June, 2023"
        }
    ]
};

// --- NAVIGATION COMPONENT ---

const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
];

const NavigationBar = ({ personal }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="fixed w-full z-50 bg-black bg-opacity-90 backdrop-blur-sm border-b border-gray-800">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center max-w-7xl">
                <a href="#hero" className={`text-xl font-bold tracking-widest text-white ${THEME_HOVER_CLASS} transition duration-300`}>
                    Karthik<span className={THEME_COLOR_CLASS}>.dev</span>
                </a>
                
                {/* Desktop Menu */}
                <nav className="hidden md:flex space-x-8">
                    {navItems.map((item) => (
                        <a 
                            key={item.name}
                            href={item.href}
                            className={`text-sm uppercase tracking-widest text-gray-300 ${THEME_HOVER_CLASS} transition duration-300 font-medium`}
                        >
                            {item.name}
                        </a>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden text-white" 
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-black border-t border-gray-800">
                    <nav className="flex flex-col space-y-2 p-4">
                        {navItems.map((item) => (
                            <a 
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`text-lg font-medium text-white ${THEME_HOVER_CLASS} transition duration-300 py-2 border-b border-gray-900 last:border-b-0`}
                            >
                                {item.name}
                            </a>
                        ))}
                    </nav>
                    <div className="p-4 flex justify-center space-x-6 text-sm uppercase tracking-wider border-t border-gray-800">
                        <a href={personal.github} target="_blank" rel="noopener noreferrer" className={THEME_HOVER_CLASS}>Github</a>
                        <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className={THEME_HOVER_CLASS}>LinkedIn</a>
                    </div>
                </div>
            )}
        </header>
    );
}

// --- HELPER COMPONENTS (Adapted for the black/white, minimal aesthetic) ---

const TimelineItem = ({ title, company, duration, description, Icon }) => (
    <div className="flex items-start mb-8 relative">
        <div className="h-full border-l border-gray-700 absolute left-3 top-0 bottom-0"></div>
        <div className="z-10 bg-black p-1 rounded-full border border-gray-700 mr-4 flex-shrink-0">
            <Icon className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 pb-4">
            <p className="text-xs text-gray-400 uppercase tracking-widest">{duration}</p>
            <h3 className="text-xl font-semibold mt-1">{title}</h3>
            {/* Theme color applied here */}
            <p className={`text-sm ${THEME_COLOR_CLASS} mb-2`}>{company}</p>
            <p className="text-gray-400 text-sm">{description}</p>
        </div>
    </div>
);


// --- MAIN PORTFOLIO SECTIONS (Unfold Style) ---

const HeroSection = ({ personal }) => (
    <section id="hero" className="relative h-screen bg-black flex flex-col justify-center items-center text-center overflow-hidden">
        <div className="relative z-10 text-white pt-20">
            <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter uppercase">
                Unfold
            </h1>
            <p className="text-xl md:text-3xl font-light tracking-wide mb-12">
                I'm **{personal.name}** a **{personal.title}**
                <br />Based in **{personal.location}**
            </p>
            <div className="flex flex-col items-center">
                <a href="#about" className="text-sm tracking-widest uppercase font-medium border-b border-white pb-1 animate-pulse">
                    Scroll Down
                </a>
            </div>
        </div>
    </section>
);

const AboutMeSection = ({ personal }) => (
    <section id="about" className="py-20 bg-black text-white">
        <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center uppercase tracking-wider">
                About Me
            </h2>
            <div className="flex flex-wrap md:flex-nowrap gap-10">
                <div className="w-full md:w-1/2">
                    <h3 className="text-2xl font-bold mb-4">A Developer with Analytical Edge</h3>
                    <p className="text-gray-400 leading-relaxed mb-4">
                        I am a **Software Engineer** specializing in **Java/Spring Boot** and **React JS** at **ZerocodeHr**. My educational background is in **Computer Science and Engineering (Data Science)**, providing a blend of core software development skills and analytical interests like **Machine Learning** and **AI**. I am focused on building scalable back-end solutions and responsive front-end widgets.
                    </p>
                    <a
                        href="/your-cv-link.pdf" // **REPLACE WITH ACTUAL CV LINK**
                        download
                        className={`inline-block px-8 py-3 mt-4 text-sm font-medium uppercase tracking-wider border border-white text-white ${THEME_HOVER_CLASS} hover:bg-white hover:text-black transition duration-300`}
                    >
                        Download My CV
                    </a>
                </div>
                <div className="w-full md:w-1/2 flex justify-center items-center">
                    <img
                        src="https://via.placeholder.com/300x400/111111/FFFFFF?text=Side+Profile+Shot" 
                        alt={`${personal.name}`}
                        className="w-48 h-64 object-cover grayscale"
                    />
                </div>
            </div>
        </div>
    </section>
);

const EducationSection = ({ education }) => (
    <section id="education" className="py-20 bg-black text-white">
        <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center uppercase tracking-wider">
                Education
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {education.map((item, index) => (
                    <div key={index} className="border border-gray-800 p-6 hover:border-white transition duration-300">
                        {/* Theme color applied here */}
                        <GraduationCap className={`h-6 w-6 ${THEME_COLOR_CLASS} mb-3`} />
                        <p className="text-sm text-gray-400 mb-1">{item.duration}</p>
                        <h3 className="text-xl font-semibold mb-1">{item.degree}</h3>
                        <p className="text-gray-300">{item.institution}</p>
                        <p className="text-sm text-gray-500 mt-2">{item.gpa}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ExperienceSection = ({ experience }) => (
    <section id="experience" className="py-20 bg-black text-white">
        <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center uppercase tracking-wider">
                Experience
            </h2>
            <div className="relative pl-6">
                {experience.map((job, index) => (
                    <TimelineItem
                        key={index}
                        Icon={Briefcase}
                        title={job.title}
                        company={job.company}
                        duration={job.duration}
                        description={job.description}
                    />
                ))}
            </div>
        </div>
    </section>
);

const SkillsSection = ({ skills }) => {
    const SkillBar = ({ name, level }) => (
        <div className="mb-4">
            <div className="flex justify-between mb-1">
                <span className="font-medium text-white uppercase">{name}</span>
                <span className="font-medium text-white">{level}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
                {/* Theme background color applied here */}
                <div
                    className={`${THEME_BACKGROUND_CLASS} h-1.5 rounded-full transition-all duration-1000`}
                    style={{ width: `${level}%` }}
                ></div>
            </div>
        </div>
    );

    return (
        <section id="skills" className="py-20 bg-black text-white">
            <div className="container mx-auto px-6 max-w-4xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center uppercase tracking-wider">
                    Technical Skills
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    {skills.technical.map((skill, index) => (
                        <SkillBar key={index} name={skill.name} level={skill.level} />
                    ))}
                </div>
                
                {/* Detailed Skills based on Resume Text */}
                <div className="mt-16 pt-8 border-t border-gray-800">
                    <h3 className="text-2xl font-bold mb-4">Detailed Stack</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                            {/* Theme color applied here */}
                            <p className={`font-medium ${THEME_COLOR_CLASS}`}>Languages</p>
                            <p className="text-gray-400">{skills.raw.languages.join(', ')}</p>
                        </div>
                        <div className="space-y-1">
                            {/* Theme color applied here */}
                            <p className={`font-medium ${THEME_COLOR_CLASS}`}>Frameworks</p>
                            <p className="text-gray-400">{skills.raw.frameworks.join(', ')}</p>
                        </div>
                        <div className="space-y-1">
                            {/* Theme color applied here */}
                            <p className={`font-medium ${THEME_COLOR_CLASS}`}>Frontend</p>
                            <p className="text-gray-400">{skills.raw.frontend.join(', ')}</p>
                        </div>
                        <div className="space-y-1">
                            {/* Theme color applied here */}
                            <p className={`font-medium ${THEME_COLOR_CLASS}`}>Cloud/DB</p>
                            <p className="text-gray-400">{skills.raw.cloud_db.join(', ')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const PortfolioGrid = ({ projects }) => (
    <section id="projects" className="py-20 bg-black text-white">
        <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center uppercase tracking-wider">
                Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                    // Using a dummy link. In a real project, this would link to a project page/repo.
                    <a key={index} href="#" onClick={(e) => e.preventDefault()} className="group relative block overflow-hidden">
                        <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-96 object-cover transition duration-500 ease-in-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6 transition duration-300 group-hover:bg-opacity-70">
                            <h3 className="text-2xl font-semibold mb-1">{project.title}</h3>
                            <p className="text-sm text-gray-300">{project.tags}</p>
                            <p className="text-xs text-gray-400 mt-1">{project.description}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    </section>
);

const ResponsibilitiesSection = ({ responsibilities }) => (
    <section id="responsibilities" className="py-20 bg-black text-white">
        <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center uppercase tracking-wider">
                Positions of Responsibility
            </h2>
            <ul className="list-none space-y-6">
                {responsibilities.map((pos, index) => (
                    <li key={index} className="flex items-start p-4 border border-gray-800 hover:border-white transition duration-300">
                        <ArrowRight className="h-5 w-5 text-white mt-1 mr-4 flex-shrink-0" />
                        <div>
                            <p className="text-lg font-semibold">{pos.role}</p>
                            <p className="text-sm text-gray-400">{pos.organization} ({pos.duration})</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </section>
);

const AchievementsSection = ({ achievements }) => (
    <section id="achievements" className="py-20 bg-black text-white">
        <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center uppercase tracking-wider">
                Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
                {achievements.map((ach, index) => (
                    <div key={index} className="p-6 border border-gray-800 hover:border-white transition duration-300">
                        <Trophy className="h-8 w-8 mx-auto mb-3 text-white" />
                        <h3 className="text-xl font-semibold">{ach.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const PublicationsSection = ({ publications }) => (
    <section id="publications" className="py-20 bg-black text-white">
        <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center uppercase tracking-wider">
                Publications
            </h2>
            <ul className="list-none space-y-6">
                {publications.map((pub, index) => (
                    <li key={index} className="p-4 border border-gray-800 hover:border-white transition duration-300">
                        <p className="text-lg font-semibold mb-1">
                            <FileText className="h-5 w-5 inline mr-2 text-white" /> {pub.title}
                        </p>
                        <p className="text-sm text-gray-400">
                            {pub.conference}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Published: {pub.date}</p>
                    </li>
                ))}
            </ul>
        </div>
    </section>
);


const ContactSection = ({ personal }) => (
    <section id="contact" className="py-20 bg-black text-white">
        <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center uppercase tracking-wider">
                Contact Me
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Contact Form Placeholder */}
                <div className="space-y-6">
                    <input type="text" placeholder="NAME" className="w-full bg-transparent border-b border-gray-700 focus:border-white outline-none py-2 text-white placeholder-gray-500" />
                    <input type="email" placeholder="EMAIL" className="w-full bg-transparent border-b border-gray-700 focus:border-white outline-none py-2 text-white placeholder-gray-500" />
                    <textarea rows={4} placeholder="WRITE YOUR MESSAGE..." className="w-full bg-transparent border-b border-gray-700 focus:border-white outline-none py-2 text-white placeholder-gray-500"></textarea>
                    <button className={`px-8 py-3 text-sm font-medium uppercase tracking-wider border border-white text-white ${THEME_HOVER_CLASS} hover:bg-white hover:text-black transition duration-300`}>
                        Send Message
                    </button>
                </div>
                {/* Contact Info */}
                <div className="space-y-6 pt-4 md:pt-0">
                    <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-white flex-shrink-0" />
                        <div className="space-y-1">
                            <p className="text-gray-400 text-sm">EMAIL</p>
                            <p className="text-white text-lg">{personal.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-white flex-shrink-0" />
                        <div className="space-y-1">
                            <p className="text-gray-400 text-sm">PHONE</p>
                            <p className="text-white text-lg">{personal.phone}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Link className="h-5 w-5 text-white flex-shrink-0" />
                        <div className="space-y-1">
                            <p className="text-gray-400 text-sm">ADDRESS</p>
                            <p className="text-white text-lg">{personal.location}</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Social Links */}
            <div className="mt-16 pt-8 border-t border-gray-800 text-center text-sm space-x-6 uppercase tracking-wider">
                <a href={personal.github} target="_blank" rel="noopener noreferrer" className={THEME_HOVER_CLASS}>Github</a>
                <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className={THEME_HOVER_CLASS}>LinkedIn</a>
            </div>
        </div>
    </section>
);


// --- MAIN COMPONENT ---

const KarthikPortfolioUnfold = () => {
    const { personal, skills, projects, experience, education, responsibilities, achievements, publications } = resumeData;

    // Helper to render a divider
    const Divider = () => <hr className="border-gray-800 my-0 mx-auto w-11/12" />;

    return (
        <div className="min-h-screen bg-black font-sans">
            <NavigationBar personal={personal} />

            <HeroSection personal={personal} />

            <Divider />
            <AboutMeSection personal={personal} />

            <Divider />
            <ExperienceSection experience={experience} />

            <Divider />
            <SkillsSection skills={skills} />

            <Divider />
            <PortfolioGrid projects={projects} />
            
            <Divider />
            <EducationSection education={education} />

            <Divider />
            <ResponsibilitiesSection responsibilities={responsibilities} />

            <Divider />
            <AchievementsSection achievements={achievements} />

            <Divider />
            <PublicationsSection publications={publications} />
            
            <Divider />
            <ContactSection personal={personal} />
            
            {/* Footer */}
            <footer className="py-6 bg-black text-center text-gray-500 text-xs border-t border-gray-800">
                &copy; {new Date().getFullYear()} {personal.name}. All rights reserved.
            </footer>
        </div>
    );
};

export default KarthikPortfolioUnfold;