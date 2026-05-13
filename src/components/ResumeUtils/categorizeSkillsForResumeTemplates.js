export const categorizeSkillsForResumeTemplates = (skills) => {
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
    skill.toLowerCase().trim().replace(/[^a-z0-9+#.\-]/g, "");

  const toTitleCase = (str) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const processedSkills = new Set();

  skills.forEach((skill) => {
    const originalSkill = String(skill || "").trim();
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

