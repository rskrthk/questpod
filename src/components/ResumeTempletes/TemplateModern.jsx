import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link as PdfLink,
} from "@react-pdf/renderer";
import { parse } from "node-html-parser";

// --- Font Registration ---
Font.register({
  family: "Inter", // This is the name you'll use in your StyleSheet
  fonts: [
    { src: "/fonts/Inter_18pt-Regular.ttf", fontWeight: "normal" }, // Base font for regular text
    { src: "/fonts/Inter_24pt-Bold.ttf", fontWeight: "bold" }, // Used for fontWeight: 'bold'
    { src: "/fonts/Inter_24pt-Italic.ttf", fontStyle: "italic" }, // Used for fontStyle: 'italic'
    { src: "/fonts/Inter_24pt-SemiBold.ttf", fontStyle: "semibold" }, // Used for fontStyle: 'italic'
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff", // Clean white background
    paddingHorizontal: 36, // ~0.5 inch margins
    paddingVertical: 30,
    fontFamily: "Inter", // Use the registered 'Inter' font
    fontSize: 10, // Base font size for body text
    color: "#333333", // Dark charcoal for main text
  },
  header: {
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    marginBottom: 5,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000000", // Keep name pure black for strong emphasis
  },
  designation: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#374151", // Slightly softer than name
    marginBottom: 8,
  },
  contactInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10, // Slightly increased font size from 9 to 10
    marginBottom: 15,
    flexWrap: "wrap",
    fontWeight: "bold", // Applied bold to the entire container for consistency
    color: "#333333", // Ensure contact info has dark charcoal color
  },
  contactLeft: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "2px",
    maxWidth: "50%",
  },
  contactRight: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "2px",
    maxWidth: "50%",
  },
  link: {
    color: "#2563eb", // Professional blue for links
    textDecoration: "underline",
    fontWeight: "normal", // Ensure links are not *extra* bold if parent is bold
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#000000", // Section titles black for strong contrast with border
    fontWeight: "bold",
    fontSize: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#000000", // Black border for defined look
    paddingBottom: 2,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  // Skills section styles (unchanged, as they look good)
  skillsContainer: {
    marginTop: 2,
  },
  skillCategory: {
    flexDirection: "row",
    marginBottom: 1,
    flexWrap: "wrap",
  },
  skillCategoryTitle: {
    fontWeight: "bold",
    marginRight: 4,
    fontSize: 10,
  },
  skillList: {
    fontSize: 10,
    flexShrink: 1,
  },
  bold: {
    fontWeight: "bold", // Used for **text** rendering
  },
  italic: {
    fontStyle: "italic", // Used for italic rendering (if needed)
  },
  workItem: {
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000000", // Company/Project names pure black for emphasis
  },
  itemTitlerole: {
    fontSize: 10,
    color: "#555555", // Company/Project names pure black for emphasis
  },
  itemDate: {
    fontSize: 9,
    // The Gowtham N example dates are not italic, but are bold.
    fontStyle: "normal",
    color: "#555555", // Slightly lighter grey for dates, good contrast
  },
  roleText: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#333333", // Role text dark charcoal
  },
  descriptionList: {
    marginLeft: 10,
    marginTop: 2,
  },
  descriptionListItem: {
    flexDirection: "row",
    marginBottom: 1,
    alignItems: "flex-start",
  },
  bullet: {
    marginRight: 4,
    fontSize: 8,
    lineHeight: 1.2,
    color: "#333333", // Bullet color matches text
  },
  projectItem: {
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000000", // Company/Project names pure black for emphasis
  },
  projectLink: {
    color: "#2563eb", // Consistent blue for links
    textDecoration: "underline",
    marginLeft: 5,
    fontWeight: "normal",
  },
  // projectTitle now has a marginRight for spacing (from previous request)
  projectTech: {
    fontSize: 10,
    fontWeight: "bold", // Technologies in Gowtham N appear bold
    fontStyle: "normal",
    marginLeft: 5,
    color: "#555555", // Slightly lighter grey for technologies
  },
  educationItem: {
    marginBottom: 8,
  },
  educationDegree: {
    fontSize: 10,
    // Degree text appears regular, not bold/italic in Gowtham N
    fontWeight: "normal",
    color: "#333333",
  },
  educationCoursework: {
    fontSize: 10,
    fontWeight: "normal",
    color: "#333333",
  },
});

// Helper function to render HTML content for PDF
// This function recursively converts HTML nodes into React-PDF components.
const renderHtmlContent = (htmlContent) => {
  if (!htmlContent) return null;

  // Use node-html-parser to parse the HTML string
  const root = parse(htmlContent.trim());
  const elements = [];

  root.childNodes.forEach((node, index) => {
    if (node.nodeType === 1) { // Element node
      const tagName = node.tagName.toLowerCase();

      if (tagName === "p") {
        elements.push(
          <View key={index} style={{ marginBottom: 4 }}>
            <Text>{renderHtmlContent(node.innerHTML)}</Text>
          </View>
        );
      } else if (tagName === "ul") {
        const listItems = node.childNodes
          .filter(child => child.tagName && child.tagName.toLowerCase() === "li")
          .map((li, liIndex) => (
            <View key={liIndex} style={styles.descriptionListItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={{ flex: 1 }}>{renderHtmlContent(li.innerHTML)}</Text>
            </View>
          ));
        elements.push(<View key={index} style={styles.descriptionList}>{listItems}</View>);
      } else if (tagName === "ol") {
        const listItems = node.childNodes
          .filter(child => child.tagName && child.tagName.toLowerCase() === "li")
          .map((li, liIndex) => (
            <View key={liIndex} style={styles.descriptionListItem}>
              <Text style={styles.bullet}>{liIndex + 1}.</Text>
              <Text style={{ flex: 1 }}>{renderHtmlContent(li.innerHTML)}</Text>
            </View>
          ));
        elements.push(<View key={index} style={styles.descriptionList}>{listItems}</View>);
      } else if (tagName === "b" || tagName === "strong") {
        elements.push(<Text key={index} style={styles.bold}>{renderHtmlContent(node.innerHTML)}</Text>);
      } else {
        // Fallback for other tags, just render their inner content as text
        elements.push(<Text key={index}>{renderHtmlContent(node.innerHTML)}</Text>);
      }
    } else if (node.nodeType === 3) { // Text node
      // Handle simple text nodes and recursively call to handle nested formatting
      elements.push(node.text);
    }
  });

  return elements;
};

// Helper functions (stripHtmlTags, categorizeSkills) remain the same
const stripHtmlTags = (htmlString) => {
  if (typeof htmlString !== "string" || !htmlString) return "";
  return htmlString.replace(/<[^>]*>/g, "");
};

const TemplateModernPdf = ({ resumeData }) => {
  const {
    personalDetails,
    profileSummary,
    education,
    workExperience,
    keySkills,
    projects,
    internships, // Added internships
    certifications, // Added certifications
    websiteSocialMedia,
  } = resumeData;

  const currentCareerLevel = personalDetails?.careerLevel || "Fresher";
  const isFresher = currentCareerLevel === "Fresher";

  const categorizeSkills = (skills) => {
    if (!Array.isArray(skills) || skills.length === 0) {
      return {};
    }

    const categorized = {
      "Programming Languages": [],
      "Frontend Frameworks": [],
      "Backend Frameworks": [],
      "Cloud Platforms": [],
      "Databases": [],
      "Tools & DevOps": [],
      "Operating Systems": [],
      "Other": [],
    };

    // Expanded and refined skill mappings with aliases
    const skillMap = {
      "Programming Languages": [
        "Java", "JavaScript", "TypeScript", "Python", "C++", "C#", "Go", "Ruby",
        "PHP", "Swift", "Kotlin", "Rust", "Scala", "Dart", "Solidity",
        "HTML", "CSS", "Bash", "Shell", "PowerShell",
      ],
      "Frontend Frameworks": [
        "React", "Redux", "Angular", "Vue.js", "Next.js", "Nuxt.js", "Svelte",
        "jQuery", "Bootstrap", "Tailwind CSS", "Material-UI", "Chakra UI",
      ],
      "Backend Frameworks": [
        "Node.js", "Express.js", "Spring Boot", "Django", "Flask", "Laravel",
        "ASP.NET Core", "Ruby on Rails", "NestJS", "FastAPI", "Gin", "Phoenix",
      ],
      "Cloud Platforms": [
        "AWS", "Amazon Web Services", "Azure", "Microsoft Azure", "GCP",
        "Google Cloud Platform", "Heroku", "Firebase", "DigitalOcean", "Vercel", "Netlify",
      ],
      "Databases": [
        "MySQL", "PostgreSQL", "MongoDB", "SQLite", "Redis", "Cassandra",
        "DynamoDB", "MariaDB", "Oracle", "SQL Server", "Elasticsearch", "Neo4j",
        "SQL", // MOVED SQL HERE
      ],
      "Tools & DevOps": [
        "Git", "GitHub", "GitLab", "Bitbucket", "Docker", "Kubernetes", "Jenkins",
        "Jira", "Confluence", "Trello", "VS Code", "Postman", "Swagger",
        "Webpack", "Babel", "ESLint", "Prettier", "NPM", "Yarn", "Maven", "Gradle",
        "Terraform", "Ansible", "Chef", "Puppet", "Grafana", "Prometheus", "CI/CD",
        "Selenium", "Cypress", "Jest", "Enzyme", "Mocha", "Chai", "Junit", "Pytest",
      ],
      "Operating Systems": [
        "Linux", "Ubuntu", "CentOS", "Debian", "Windows", "macOS", "Unix", "Android", "iOS",
      ],
    };

    const normalizeSkill = (skill) =>
      skill
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9+#.\-]/g, ""); // Allow dashes and dots

    // Function to capitalize first letter of each word - REMOVED AS PER REQUIREMENT
    // const toTitleCase = (str) => {
    // 	 return str
    // 		 .split(" ")
    // 		 .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    // 		 .join(" ");
    // };

    const processedSkills = new Set(); // To prevent duplicates

    skills.forEach((skill) => {
      const originalSkill = skill.trim();
      if (!originalSkill) return; // Skip empty strings

      const normalizedSkill = normalizeSkill(originalSkill);
      let foundCategory = false;

      // Iterate through categories in a desired order of priority
      const categoryOrder = [
        "Databases", // Prioritize Databases if SQL is present
        "Programming Languages",
        "Frontend Frameworks",
        "Backend Frameworks",
        "Cloud Platforms",
        "Tools & DevOps",
        "Operating Systems",
      ];

      for (const category of categoryOrder) {
        if (
          skillMap[category].some((keyword) =>
            normalizedSkill.includes(normalizeSkill(keyword))
          )
        ) {
          if (!processedSkills.has(normalizedSkill)) {
            categorized[category].push(originalSkill); // Use original skill for display
            processedSkills.add(normalizedSkill);
          }
          foundCategory = true;
          break; // Assign to the first matching category and move to next skill
        }
      }

      if (!foundCategory && !processedSkills.has(normalizedSkill)) {
        categorized.Other.push(originalSkill); // Use original skill for display
        processedSkills.add(normalizedSkill);
      }
    });

    const finalCategories = {};
    for (const category in categorized) {
      if (categorized[category].length > 0) {
        // Sort skills alphabetically within each category and join
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
    // Handle 'present' keyword
    if (dateString.toLowerCase() === "present") return "Present";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { month: "short", year: "numeric" });
  };

  // Define the sections and their render logic based on career level
  // This array determines the order for FRESHERS
  const sectionsForFresher = [
    // Profile Summary
    profileSummary &&
    profileSummary.length > 0 &&
    profileSummary[0] && {
      title: "PROFILE SUMMARY",
      data: profileSummary,
      render: () => (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROFILE SUMMARY</Text>
          <Text>{renderHtmlContent(profileSummary)}</Text>
        </View>
      ),
    },

    // Skills Section (always first for Fresher)

    Object.keys(categorizedSkills).length > 0 && {
      title: "SKILLS",
      render: () => (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SKILLS</Text>
          <View style={styles.skillsContainer}>
            {Object.entries(categorizedSkills).map(([category, skillsList]) => (
              <View key={category} style={styles.skillCategory}>
                <Text style={styles.skillCategoryTitle}>{category}:</Text>
                <Text style={styles.skillList}>{skillsList}</Text>
              </View>
            ))}
          </View>
        </View>
      ),
    },

    // Projects
    projects &&
    projects.length > 0 && {
      title: "PROJECTS",
      data: projects,
      render: () => (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROJECTS</Text>
          {projects.map((proj, index) => (
            <View
              key={proj.id || index}
              style={styles.projectItem}
              break={index > 0}
            >
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "flex-end",
                  marginBottom: 2,
                }}
              >
                <Text style={styles.projectTitle}>{proj.name}</Text>
                <Text style={styles.projectTech}>|</Text>
                {proj.link && (
                  <PdfLink src={proj.link} style={styles.projectLink}>
                    LINK
                  </PdfLink>
                )}
                {proj.technologies && (
                  <Text style={styles.projectTech}>
                    | {proj.technologies}
                  </Text>
                )}
              </View>
              {proj.description && (
                <View>{renderHtmlContent(proj.description)}</View>
              )}
            </View>
          ))}
        </View>
      ),
    },

    // Education
    education &&
    education.length > 0 && {
      title: "EDUCATION",
      data: education,
      render: () => (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EDUCATION</Text>
          {education.map((edu, index) => (
            <View
              key={edu.id || index}
              style={styles.educationItem}
              break={index > 0}
            >
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>
                  {edu.university}
                  {edu.location ? `, ${edu.location}` : ""}
                </Text>
                <Text style={styles.itemDate}>
                  {formatDate(edu.startDate)}
                  {edu.startDate && (edu.endDate || edu.year) ? " – " : ""}
                  {formatDate(edu.endDate || edu.year)}
                </Text>
              </View>
              {edu.degree && (
                <Text style={styles.educationDegree}>
                  {edu.degree}
                  {edu.gpa ? ` – ${edu.gpa}` : ""}
                </Text>
              )}
              {edu.coursework && (
                <Text style={styles.educationCoursework}>
                  Coursework: {edu.coursework}
                </Text>
              )}
            </View>
          ))}
        </View>
      ),
    },

    // Certifications (ONLY FOR FRESHERS)
    certifications &&
    certifications.length > 0 && {
      title: "CERTIFICATIONS",
      data: certifications,
      render: () => (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
          {certifications.map((cert, index) => (
            <View
              key={cert.id || index}
              style={styles.workItem} // Reusing workItem style for consistency
              break={index > 0}
            >
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{cert.name}</Text>
                <Text style={styles.itemDate}>{formatDate(cert.date)}</Text>
              </View>
              {cert.organization && (
                <Text style={styles.roleText}>{cert.organization}</Text>
              )}
            </View>
          ))}
        </View>
      ),
    },

    // Internships (ONLY FOR FRESHERS)
    internships &&
    internships.length > 0 && {
      title: "INTERNSHIPS",
      data: internships,
      render: () => (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INTERNSHIPS</Text>
          {internships.map((internship, index) => (
            <View
              key={internship.id || index}
              style={styles.workItem} // Reusing workItem style for consistency
              break={index > 0}
            >
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{internship.company}</Text>
                <Text style={styles.itemDate}>
                  {formatDate(internship.startDate)} –{" "}
                  {formatDate(internship.endDate)}
                </Text>
              </View>
              {internship.role && (
                <Text style={styles.roleText}>{internship.role}</Text>
              )}
              {internship.description && (
                <View>{renderHtmlContent(internship.description)}</View>
              )}
            </View>
          ))}
        </View>
      ),
    },
  ].filter(Boolean); // Filter out nulls from conditional rendering

  // This array determines the order for NON-FRESHERS (existing order)
  const sectionsForExperienced = [
    // --- START: MODIFIED SECTION ORDER FOR EXPERIENCED ---

    profileSummary &&
    profileSummary.length > 0 &&
    profileSummary[0] && {
      title: "PROFILE SUMMARY",
      data: profileSummary,
      render: () => (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROFILE SUMMARY</Text>
          <Text>{renderHtmlContent(profileSummary)}</Text>
        </View>
      ),
    },

    // Skills Section (Now explicitly first for Experienced too)
    Object.keys(categorizedSkills).length > 0 && {
      title: "SKILLS",
      render: () => (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SKILLS</Text>
          <View style={styles.skillsContainer}>
            {Object.entries(categorizedSkills).map(([category, skillsList]) => (
              <View key={category} style={styles.skillCategory}>
                <Text style={styles.skillCategoryTitle}>{category}:</Text>
                <Text style={styles.skillList}>{skillsList}</Text>
              </View>
            ))}
          </View>
        </View>
      ),
    },

    // Work Experience
    workExperience &&
    workExperience.length > 0 && {
      title: "WORK EXPERIENCE",
      data: workExperience,
      render: () => (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>WORK EXPERIENCE</Text>
          {workExperience.map((exp, index) => (
            <View
              key={exp.id || index}
              style={styles.workItem}
              break={index > 0}
            >
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{exp.parentCompany}</Text>
                <Text style={styles.itemDate}>
                  {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                </Text>
              </View>
              {exp.role && <Text style={styles.roleText}>{exp.role}</Text>}
              {exp.projectTitle && (
                <Text style={styles.subDetail}>
                  <Text style={styles.bold}>Project:</Text> {exp.projectTitle}
                </Text>
              )}

              {exp.domain && (
                <Text style={styles.subDetail}>
                  <Text style={styles.bold}>Domain:</Text> {exp.domain}
                </Text>
              )}

              {exp.description && (
                <View>{renderHtmlContent(exp.description)}</View>
              )}
            </View>
          ))}
        </View>
      ),
    },

    // Projects
    projects &&
    projects.length > 0 && {
      title: "PROJECTS",
      data: projects,
      render: () => (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROJECTS</Text>
          {projects.map((proj, index) => (
            <View
              key={proj.id || index}
              style={styles.projectItem}
              break={index > 0}
            >
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "flex-end",
                  marginBottom: 2,
                }}
              >
                <Text style={styles.projectTitle}>{proj.name}</Text>
                <Text style={styles.projectTech}>|</Text>
                {proj.link && (
                  <PdfLink src={proj.link} style={styles.projectLink}>
                    LINK
                  </PdfLink>
                )}
                {proj.technologies && (
                  <Text style={styles.projectTech}>
                    | {proj.technologies}
                  </Text>
                )}
              </View>
              {proj.description && (
                <View>{renderHtmlContent(proj.description)}</View>
              )}
            </View>
          ))}
        </View>
      ),
    },

    // Education
    education &&
    education.length > 0 && {
      title: "EDUCATION",
      data: education,
      render: () => (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EDUCATION</Text>
          {education.map((edu, index) => (
            <View
              key={edu.id || index}
              style={styles.educationItem}
              break={index > 0}
            >
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>
                  {edu.university}
                  {edu.location ? `, ${edu.location}` : ""}
                </Text>
                <Text style={styles.itemDate}>
                  {formatDate(edu.startDate)}
                  {edu.startDate && (edu.endDate || edu.year) ? " – " : ""}
                  {formatDate(edu.endDate || edu.year)}
                </Text>
              </View>
              {edu.degree && (
                <Text style={styles.educationDegree}>
                  {edu.degree}
                  {edu.gpa ? ` – ${edu.gpa}` : ""}
                </Text>
              )}
              {edu.coursework && (
                <Text style={styles.educationCoursework}>
                  Coursework: {edu.coursework}
                </Text>
              )}
            </View>
          ))}
        </View>
      ),
    },

    // Certifications (ONLY FOR FRESHERS)
    certifications &&
    certifications.length > 0 && {
      title: "CERTIFICATIONS",
      data: certifications,
      render: () => (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
          {certifications.map((cert, index) => (
            <View
              key={cert.id || index}
              style={styles.workItem} // Reusing workItem style for consistency
              break={index > 0}
            >
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{cert.name}</Text>
                <Text style={styles.itemDate}>{formatDate(cert.date)}</Text>
              </View>
              {cert.organization && (
                <Text style={styles.roleText}>{cert.organization}</Text>
              )}
            </View>
          ))}
        </View>
      ),
    },
  ].filter(Boolean); // Filter out nulls from conditional rendering

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalDetails?.firstName} {personalDetails?.lastName}
          </Text>
          {personalDetails?.designation && (
            <Text style={styles.designation}>
              {personalDetails.designation}
            </Text>
          )}
          <View style={styles.contactInfoContainer}>
            <View style={styles.contactLeft}>
              {websiteSocialMedia?.linkedin && (
                <Text>
                  LinkedIn:{" "}
                  <PdfLink
                    src={websiteSocialMedia.linkedin}
                    style={styles.link}
                  >
                    {websiteSocialMedia.linkedin.split("/").pop()}
                  </PdfLink>
                </Text>
              )}

              {/* Added Website URL */}
              {websiteSocialMedia?.website && (
                <Text>
                  Website:{" "}
                  <PdfLink src={websiteSocialMedia.website} style={styles.link}>
                    {websiteSocialMedia.website.replace(/(^\w+:|^)\/\//, "")}
                  </PdfLink>
                </Text>
              )}
              {personalDetails?.address && (
                <Text>{personalDetails.address}</Text>
              )}
            </View>
            <View style={styles.contactRight}>
              {personalDetails?.email && (
                <Text>
                  Email:{" "}
                  <PdfLink
                    src={`mailto:${personalDetails.email}`}
                    style={styles.link}
                  >
                    {personalDetails.email}
                  </PdfLink>
                </Text>
              )}
              {/* Added GitHub URL */}
              {websiteSocialMedia?.github && (
                <Text>
                  GitHub:{" "}
                  <PdfLink src={websiteSocialMedia.github} style={styles.link}>
                    {websiteSocialMedia.github.split("/").pop()}
                  </PdfLink>
                </Text>
              )}
              {personalDetails?.phone && (
                <Text>Mobile: {personalDetails.phone}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Dynamically render sections based on career level */}
        {(isFresher ? sectionsForFresher : sectionsForExperienced).map(
          (section, index) => (
            <React.Fragment key={section.title || index}>
              {section.render()}
            </React.Fragment>
          )
        )}
      </Page>
    </Document>
  );
};

export default TemplateModernPdf;