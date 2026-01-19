import React from "react";
import { parse } from "node-html-parser";

// Helper function to render HTML content with list support
// Helper function to render HTML content with list support
const renderRichTextContentWithLists = (htmlContent) => {
  if (!htmlContent) return null;

  const root = parse(htmlContent);
  const elements = root.childNodes
    .filter((node) => {
      // Filter out empty <p> tags
      return !(
        node.tagName &&
        node.tagName.toLowerCase() === "p" &&
        node.innerHTML.trim() === ""
      );
    })
    .map((node, index) => {
      if (node.nodeType === 1) {
        // Element node
        const tagName = node.tagName.toLowerCase();

        if (tagName === "ul") {
          return (
            <ul key={index} className="list-disc pl-5 space-y-1">
              {node.childNodes
                .filter(
                  (child) =>
                    child.tagName && child.tagName.toLowerCase() === "li"
                )
                .map((li, liIndex) => (
                  <li
                    key={liIndex}
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: li.innerHTML }}
                  />
                ))}
            </ul>
          );
        } else if (tagName === "ol") {
          return (
            <ol key={index} className="list-decimal pl-5 space-y-1">
              {node.childNodes
                .filter(
                  (child) =>
                    child.tagName && child.tagName.toLowerCase() === "li"
                )
                .map((li, liIndex) => (
                  <li
                    key={liIndex}
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: li.innerHTML }}
                  />
                ))}
            </ol>
          );
        } else {
          // Handle other tags and text nodes
          return (
            <div
              key={index}
              dangerouslySetInnerHTML={{ __html: node.outerHTML }}
            />
          );
        }
      } else if (node.nodeType === 3) {
        // Text node
        return <span key={index}>{node.text}</span>;
      }
      return null;
    });

  return elements;
};

// Helper function to strip all HTML tags (retained as it might be needed for specific text fields)
const stripAllHtmlTags = (htmlString) => {
  if (typeof htmlString !== "string" || !htmlString) return "";
  const doc = new DOMParser().parseFromString(htmlString, "text/html");
  return doc.body.textContent || "";
};

const TemplateModernHtml = ({ resumeData }) => {
  const {
    personalDetails,
    profileSummary,
    education,
    workExperience,
    keySkills,
    projects,
    internships,
    certifications,
    websiteSocialMedia,
  } = resumeData;

  const currentCareerLevel = personalDetails?.careerLevel || "Fresher";
  const isFresher =
    personalDetails.careerLevel === "Fresher" ||
    !["Intermediate", "Expert"].includes(personalDetails.careerLevel);

  const categorizeSkills = (skills) => {
    if (!Array.isArray(skills) || skills.length === 0) {
      return {};
    }

    const categorized = {
      "Programming Languages": [],
      "Frontend Frameworks": [],
      "Backend Frameworks": [],
      "Cloud Platforms": [],
      Databases: [],
      "Tools & DevOps": [],
      "Operating Systems": [],
      Other: [],
    };

    const skillMap = {
      "Programming Languages": [
        "Java",
        "JavaScript",
        "TypeScript",
        "Python",
        "C++",
        "C#",
        "Go",
        "Ruby",
        "PHP",
        "Swift",
        "Kotlin",
        "Rust",
        "Scala",
        "Dart",
        "Solidity",
        "SQL",
        "HTML",
        "CSS",
        "Bash",
        "Shell",
        "PowerShell",
      ],
      "Frontend Frameworks": [
        "React",
        "Redux",
        "Angular",
        "Vue.js",
        "Next.js",
        "Nuxt.js",
        "Svelte",
        "jQuery",
        "Bootstrap",
        "Tailwind CSS",
        "Material-UI",
        "Chakra UI",
      ],
      "Backend Frameworks": [
        "Node.js",
        "Express.js",
        "Spring Boot",
        "Django",
        "Flask",
        "Laravel",
        "ASP.NET Core",
        "Ruby on Rails",
        "NestJS",
        "FastAPI",
        "Gin",
        "Phoenix",
      ],
      "Cloud Platforms": [
        "AWS",
        "Amazon Web Services",
        "Azure",
        "Microsoft Azure",
        "GCP",
        "Google Cloud Platform",
        "Heroku",
        "Firebase",
        "DigitalOcean",
        "Vercel",
        "Netlify",
      ],
      Databases: [
        "MySQL",
        "PostgreSQL",
        "MongoDB",
        "SQLite",
        "Redis",
        "Cassandra",
        "DynamoDB",
        "MariaDB",
        "Oracle",
        "SQL Server",
        "Elasticsearch",
        "Neo4j",
        "DBMS",
        "Microsoft SQL Server",
        "Postgres",
      ],
      "Tools & DevOps": [
        "Git",
        "GitHub",
        "GitLab",
        "Bitbucket",
        "Docker",
        "Kubernetes",
        "Jenkins",
        "Jira",
        "Confluence",
        "Trello",
        "VS Code",
        "Postman",
        "Swagger",
        "Webpack",
        "Babel",
        "ESLint",
        "Prettier",
        "NPM",
        "Yarn",
        "Maven",
        "Gradle",
        "Terraform",
        "Ansible",
        "Chef",
        "Puppet",
        "Grafana",
        "Prometheus",
        "CI/CD",
        "Selenium",
        "Cypress",
        "Jest",
        "Enzyme",
        "Mocha",
        "Chai",
        "Junit",
        "Pytest",
        "Figma",
        "npm",
        "yarn",
      ],
      "Operating Systems": [
        "Linux",
        "Ubuntu",
        "CentOS",
        "Debian",
        "Windows",
        "macOS",
        "Unix",
        "Android",
        "iOS",
      ],
    };

    const normalizeSkill = (skill) =>
      skill
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9+#.\-]/g, "");

    const toTitleCase = (str) => {
      return str
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    };

    const processedSkills = new Set();

    skills.forEach((skill) => {
      const originalSkill = skill.trim();
      if (!originalSkill) return;

      const normalizedSkill = normalizeSkill(originalSkill);
      let foundCategory = false;

      const categoryOrder = [
        "Databases",
        "Programming Languages",
        "Frontend Frameworks",
        "Backend Frameworks",
        "Cloud Platforms",
        "Tools & DevOps",
        "Operating Systems",
      ];

      for (const category of categoryOrder) {
        const isMatch = skillMap[category].some((keyword) => {
          const normalizedKeyword = normalizeSkill(keyword);
          return (
            normalizedSkill === normalizedKeyword ||
            normalizedSkill.includes(normalizedKeyword)
          );
        });

        if (isMatch) {
          if (!processedSkills.has(normalizedSkill)) {
            let skillToDisplay = originalSkill;

            switch (normalizedSkill) {
              case "mongodb":
                skillToDisplay = "MongoDB";
                break;
              case "mysql":
                skillToDisplay = "MySQL";
                break;
              case "postgresql":
                skillToDisplay = "PostgreSQL";
                break;
              case "sqlserver":
              case "microsoftsqlserver":
                skillToDisplay = "SQL Server";
                break;
              case "html":
                skillToDisplay = "HTML";
                break;
              case "css":
                skillToDisplay = "CSS";
                break;
              case "aws":
                skillToDisplay = "AWS";
                break;
              case "gcp":
                skillToDisplay = "GCP";
                break;
              case "ci/cd":
                skillToDisplay = "CI/CD";
                break;
              case "vs code":
              case "vscode":
                skillToDisplay = "VS Code";
                break;
              case "node.js":
              case "nodejs":
                skillToDisplay = "Node.js";
                break;
              case "express.js":
              case "expressjs":
                skillToDisplay = "Express.js";
                break;
              case "next.js":
              case "nextjs":
                skillToDisplay = "Next.js";
                break;
              case "vue.js":
              case "vuejs":
                skillToDisplay = "Vue.js";
                break;
              case "spring boot":
              case "springboot":
                skillToDisplay = "Spring Boot";
                break;
              case "material-ui":
              case "materialui":
                skillToDisplay = "Material-UI";
                break;
              case "chakra ui":
              case "chakraui":
                skillToDisplay = "Chakra UI";
                break;
              default:
                skillToDisplay = toTitleCase(originalSkill);
                break;
            }
            categorized[category].push(skillToDisplay);
            processedSkills.add(normalizedSkill);
          }
          foundCategory = true;
          break;
        }
      }

      if (!foundCategory && !processedSkills.has(normalizedSkill)) {
        categorized.Other.push(toTitleCase(originalSkill));
        processedSkills.add(normalizedSkill);
      }
    });

    const finalCategories = {};
    for (const category in categorized) {
      if (categorized[category].length > 0) {
        finalCategories[category] = Array.from(new Set(categorized[category]))
          .sort((a, b) => a.localeCompare(b))
          .join(", ");
      }
    }
    return finalCategories;
  };

  const categorizedSkills = categorizeSkills(keySkills);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    if (dateString.toLowerCase() === "present") return "Present";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { month: "short", year: "numeric" });
  };

  const Section = ({ title, children }) => {
    if (!children) return null;
    return (
      <div className="mb-3">
        <h3 className="text-black font-bold border-b border-black pb-0.5 mb-1.5 text-base uppercase">
          {title}
        </h3>
        {children}
      </div>
    );
  };

  const profileSummarySection = profileSummary && profileSummary.length > 0 && (
    <Section title="PROFILE SUMMARY">
      <div
        className="text-gray-700 text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: profileSummary }}
      />
    </Section>
  );

  const skillsSection = Object.keys(categorizedSkills).length > 0 && (
    <Section title="SKILLS">
      <div className="mt-0.5">
        {Object.entries(categorizedSkills).map(([category, skillsList]) => (
          <p key={category} className="text-sm mb-0.5 flex flex-wrap">
            <span className="font-bold mr-1">{category}:</span> {skillsList}
          </p>
        ))}
      </div>
    </Section>
  );

  const educationSection = education && education.length > 0 && (
    <Section title="EDUCATION">
      {education.map((edu, index) => (
        <div key={edu.id || index} className="mb-2">
          <div className="flex justify-between">
            <p className="font-bold text-black">
              {edu.university}
              {edu.location ? `, ${edu.location}` : ""}
            </p>
            <p className="text-gray-600 text-xs">
              {formatDate(edu.startDate)}
              {edu.startDate && (edu.endDate || edu.year) ? " – " : ""}
              {formatDate(edu.endDate || edu.year)}
            </p>
          </div>
          {edu.degree && (
            <p className="text-gray-700 text-xs">
              {edu.degree}
              {edu.gpa ? ` – ${edu.gpa}` : ""}
            </p>
          )}
          {edu.coursework && (
            <p className="text-gray-700 text-xs">
              Coursework: {edu.coursework}
            </p>
          )}
        </div>
      ))}
    </Section>
  );

  const projectsSection = projects && projects.length > 0 && (
    <Section title="PROJECTS">
      {projects.map((proj, index) => (
        <div key={proj.id || index} className="mb-2">
          <p className="font-bold text-black flex items-end flex-wrap mb-0.5">
            {proj.name}
            <span className="text-gray-600 font-bold ml-1">|</span>
            {proj.link && (
              <a
                href={proj.link}
                className="text-blue-600 underline ml-1 font-normal"
                target="_blank"
                rel="noopener noreferrer"
              >
                LINK
              </a>
            )}
            {proj.technologies && (
              <span className="text-gray-600 font-bold ml-1">
                | {proj.technologies}
              </span>
            )}
          </p>
          {proj.description && (
            <div className="text-gray-700 mt-1">
              {renderRichTextContentWithLists(proj.description)}
            </div>
          )}
        </div>
      ))}
    </Section>
  );

  const internshipsSection = internships && internships.length > 0 && (
    <Section title="INTERNSHIPS">
      {internships.map((internship, index) => (
        <div key={internship.id || index} className="mb-2">
          <div className="flex justify-between mb-0.5">
            <p className="font-bold text-black">{internship.company}</p>
            <p className="text-gray-600 text-xs">
              {formatDate(internship.startDate)} –{" "}
              {formatDate(internship.endDate)}
            </p>
          </div>
          {internship.role && (
            <p className="font-bold text-gray-700 mb-0.5">{internship.role}</p>
          )}
          {internship.description && (
            <div className="text-gray-700 mt-1">
              {renderRichTextContentWithLists(internship.description)}
            </div>
          )}
        </div>
      ))}
    </Section>
  );

  const certificationsSection = certifications && certifications.length > 0 && (
    <Section title="CERTIFICATIONS">
      {certifications.map((cert, index) => (
        <div key={cert.id || index} className="mb-2">
          <div className="flex justify-between mb-0.5">
            <p className="font-bold text-black">{cert.name}</p>
            <p className="text-gray-600 text-xs">{formatDate(cert.date)}</p>
          </div>
          {cert.organization && (
            <p className="font-bold text-gray-700 mb-0.5">
              {cert.organization}
            </p>
          )}
        </div>
      ))}
    </Section>
  );

  const workExperienceSection = workExperience && workExperience.length > 0 && (
    <Section title="WORK EXPERIENCE">
      {workExperience.map((exp, index) => (
        <div key={exp.id || index} className="mb-2">
          <div className="flex justify-between mb-0.5">
            <p className="font-bold text-black">{exp.parentCompany}</p>
            <p className="text-gray-600 text-xs">
              {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
            </p>
          </div>
          {exp.role && (
            <p className="font-bold text-gray-700 mb-0.5">{exp.role}</p>
          )}
          {exp.projectTitle && (
            <p className="text-sm text-gray-600 mb-0.5">
              <span className="font-semibold">Project:</span> {exp.projectTitle}
            </p>
          )}
          {exp.domain && (
            <p className="text-sm text-gray-600 mb-0.5">
              <span className="font-semibold">Domain:</span> {exp.domain}
            </p>
          )}
          {exp.description && (
            <div className="text-gray-700 mt-1">
              {renderRichTextContentWithLists(exp.description)}
            </div>
          )}
        </div>
      ))}
    </Section>
  );

  // Custom sections handling
  const customSections = [];
  if (resumeData.customContent && typeof resumeData.customContent === 'object') {
    Object.entries(resumeData.customContent).forEach(([sectionTitle, sectionContent]) => {
      if (Array.isArray(sectionContent) && sectionContent.length > 0 && sectionContent.some(item => item && item.trim())) {
        const customSection = (
          <Section title={sectionTitle.toUpperCase()}>
            {sectionContent.map((item, index) => {
              if (!item || !item.trim()) return null;
              return (
                <div key={index} className="mb-1">
                  <div className="text-gray-700">
                    {renderRichTextContentWithLists(item)}
                  </div>
                </div>
              );
            })}
          </Section>
        );
        customSections.push(customSection);
      }
    });
  }

  const sectionsForFresher = [
    profileSummarySection,
    skillsSection,
    projectsSection,
    educationSection,
    internshipsSection,
    certificationsSection,
    ...customSections,
  ].filter(Boolean);

  const sectionsForExperienced = [
    profileSummarySection,
    skillsSection,
    workExperienceSection,
    projectsSection,
    educationSection,
    certificationsSection,
    ...customSections,
  ].filter(Boolean);

  const displayedSections = isFresher
    ? sectionsForFresher
    : sectionsForExperienced;

  return (
    <div className="flex flex-col bg-white px-9 py-8 text-gray-700 text-sm leading-normal font-sans">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold mb-1 text-black">
          {personalDetails?.firstName} {personalDetails?.lastName}
        </h1>
        {personalDetails?.designation && (
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            {personalDetails.designation}
          </h2>
        )}
        <div className="flex justify-between flex-wrap text-sm font-bold text-gray-700 mb-4">
          <div className="flex flex-col items-start max-w-[50%]">
            {websiteSocialMedia?.linkedin && (
              <p>
                LinkedIn:{" "}
                <a
                  href={websiteSocialMedia.linkedin}
                  className="text-blue-600 underline font-normal"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {websiteSocialMedia.linkedin.split("/").pop()}
                </a>
              </p>
            )}
            {websiteSocialMedia?.website && (
              <p>
                Website:{" "}
                <a
                  href={websiteSocialMedia.website}
                  className="text-blue-600 underline font-normal"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {websiteSocialMedia.website.replace(/(^\w+:|^)\/\//, "")}
                </a>
              </p>
            )}
            {personalDetails?.address && <p>{personalDetails.address}</p>}
          </div>
          <div className="flex flex-col items-end max-w-[50%]">
            {personalDetails?.email && (
              <p>
                Email:{" "}
                <a
                  href={`mailto:${personalDetails.email}`}
                  className="text-blue-600 underline font-normal"
                >
                  {personalDetails.email}
                </a>
              </p>
            )}
            {websiteSocialMedia?.github && (
              <p>
                GitHub:{" "}
                <a
                  href={websiteSocialMedia.github}
                  className="text-blue-600 underline font-normal"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {websiteSocialMedia.github.split("/").pop()}
                </a>
              </p>
            )}
            {personalDetails?.phone && <p>Mobile: {personalDetails.phone}</p>}
          </div>
        </div>
      </div>

      {/* Dynamically render sections based on career level */}
      {displayedSections.map((section, index) => (
        <React.Fragment key={section.props.title || index}>
          {section}
        </React.Fragment>
      ))}
    </div>
  );
};

export default TemplateModernHtml;

