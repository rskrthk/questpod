"use client";
import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

const skillCategories = {
  languages: [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "Ruby",
    "Go",
    "Rust",
    "PHP",
    "Swift",
    "Kotlin",
  ],
  frameworks: [
    "React",
    "Next.js",
    "Angular",
    "Vue.js",
    "Nuxt.js",
    "Svelte",
    "Remix",
    "Express.js",
    "Spring Boot",
    "Django",
    "Flask",
    "Laravel",
    "Rails",
  ],
  tools: [
    "Git",
    "Docker",
    "Kubernetes",
    "Jira",
    "Figma",
    "Postman",
    "Webpack",
    "Vite",
    "NPM",
    "Yarn",
    "CI/CD",
  ],
  databases: [
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "SQLite",
    "MariaDB",
    "Firebase",
    "Supabase",
  ],
  cloud: [
    "AWS",
    "Azure",
    "Google Cloud",
    "Firebase",
    "Vercel",
    "Heroku",
    "DigitalOcean",
  ],
  testing: [
    "Jest",
    "Mocha",
    "Chai",
    "Cypress",
    "Playwright",
    "Testing Library",
  ],
  devops: ["GitHub Actions", "Jenkins", "CircleCI", "Terraform", "Ansible"],
  webTechnologies: [
    "HTML",
    "CSS",
    "Tailwind CSS",
    "Bootstrap",
    "Sass",
    "LESS",
    "Styled Components",
  ],
  mobile: ["React Native", "Flutter", "Swift", "Kotlin", "Xamarin", "Ionic"],
  design: ["Figma", "Adobe XD", "Sketch", "Canva"],
  others: [
    "Agile",
    "Scrum",
    "RESTful APIs",
    "GraphQL",
    "WebSockets",
    "SEO",
    "Accessibility",
  ],
};

const categorizeSkills = (skillsArray = []) => {
  const categoryMap = {
    skillsProgrammingLanguages: [],
    skillsFrameworks: [],
    skillsDevelopmentTools: [],
    skillsDatabases: [],
    skillsWebTechnologies: [],
    skillsOperatingSystems: [],
    skillsApplicationServers: [],
    skillsArchitectures: [],
    skillsMobilityPlatforms: [],
    skillsPrimaryTechnology: [],
    skillsCloud: [],
    skillsTesting: [],
  };

   const allCategories = {
    languages: "skillsProgrammingLanguages",
    frameworks: "skillsFrameworks",
    tools: "skillsDevelopmentTools",
    databases: "skillsDatabases",
    cloud: "skillsCloud",
    testing: "skillsTesting",
    devops: "skillsDevelopmentTools",
    webTechnologies: "skillsWebTechnologies",
    mobile: "skillsMobilityPlatforms",
    design: "skillsDevelopmentTools",
    others: "skillsPrimaryTechnology",
  };

  skillsArray.forEach((inputSkill) => {
    const normalized = inputSkill.toLowerCase();
    let found = false;

    for (const [categoryKey, skills] of Object.entries(skillCategories)) {
      if (skills.map((s) => s.toLowerCase()).includes(normalized)) {
        const field = allCategories[categoryKey];
        if (field) {
          categoryMap[field].push(inputSkill);
          found = true;
          break;
        }
      }
    }

    if (!found) {
      categoryMap.skillsPrimaryTechnology.push(inputSkill);
    }
  });

  const formatted = {};
  for (const key in categoryMap) {
    formatted[key] = categoryMap[key].join(", ");
  }

  return formatted;
};

const SkillInput = ({
  skills = [],
  onSkillsChange,
  placeholder = "Enter skills you use at work. Eg: Java, SQL",
  label = "Skills",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef(null);

  // Flatten all skills from categories for easier filtering & suggestion
  const suggestedSkills = Object.values(skillCategories).flat();

  // Filter suggestions based on input and exclude already selected skills
  const filteredSuggestions = suggestedSkills.filter(
    (skill) =>
      skill.toLowerCase().includes(inputValue.toLowerCase()) &&
      !skills.includes(skill)
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setHighlightedIndex(0);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setDropdownOpen(true);
    setHighlightedIndex(0);
  };

  const handleAddSkill = (newSkill) => {
    const skill = newSkill.trim();
    if (skill && !skills.includes(skill)) {
      onSkillsChange([...skills, skill]);
    }
    setInputValue("");
    setDropdownOpen(false);
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    onSkillsChange(updatedSkills);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev + 1 < filteredSuggestions.length ? prev + 1 : 0
      );
      setDropdownOpen(true);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev - 1 >= 0 ? prev - 1 : filteredSuggestions.length - 1
      );
      setDropdownOpen(true);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        handleAddSkill(filteredSuggestions[highlightedIndex]);
      } else if (inputValue.trim() !== "") {
        handleAddSkill(inputValue.trim());
      }
    } else if (e.key === "Escape") {
      setDropdownOpen(false);
    }
  };

  const handleAddAll = () => {
    const notAddedSkills = suggestedSkills.filter((skill) => !skills.includes(skill));
    if (notAddedSkills.length > 0) {
      onSkillsChange([...skills, ...notAddedSkills]);
      setDropdownOpen(false);
      setInputValue("");
    }
  };

  const handleClearAll = () => {
    onSkillsChange([]);
    setDropdownOpen(false);
    setInputValue("");
  };

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col gap-3 relative font-sans"
    >
      <div
        className="flex flex-wrap items-center gap-2 min-h-[44px] px-3 py-2 border rounded-md bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1 cursor-text"
        onClick={() => setDropdownOpen(true)}
      >
        {skills.map((skill, idx) => (
          <span
            key={skill + idx}
            className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs sm:text-sm px-3 py-1 rounded-full select-none"
          >
            {skill}
            <button
              type="button"
              aria-label={`Remove ${skill}`}
              onClick={() => handleRemoveSkill(skill)}
              className="text-blue-600 hover:text-blue-900 focus:outline-none"
            >
              <X size={14} />
            </button>
          </span>
        ))}

        <input
          id="skill-input"
          type="text"
          aria-autocomplete="list"
          aria-controls="skill-suggestions"
          aria-activedescendant={
            isDropdownOpen && filteredSuggestions[highlightedIndex]
              ? `skill-option-${highlightedIndex}`
              : undefined
          }
          className="flex-grow min-w-[100px] border-none focus:outline-none text-sm sm:text-base bg-transparent placeholder:text-gray-400"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          autoComplete="off"
          spellCheck="false"
        />
      </div>

      <div className="flex gap-2 justify-end text-xs sm:text-sm">
        <button
          onClick={handleAddAll}
          disabled={suggestedSkills.filter((s) => !skills.includes(s)).length === 0}
          className={`px-4 py-1 rounded-full font-semibold transition ${
            suggestedSkills.filter((s) => !skills.includes(s)).length === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-200 text-green-800 hover:bg-green-300"
          }`}
          type="button"
        >
          Add All (
          {suggestedSkills.filter((s) => !skills.includes(s)).length})
        </button>
        <button
          onClick={handleClearAll}
          disabled={skills.length === 0}
          className={`px-4 py-1 rounded-full font-semibold transition ${
            skills.length === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-red-200 text-red-800 hover:bg-red-300"
          }`}
          type="button"
        >
          Clear All
        </button>
      </div>

      {/* Your requested new suggestions below input as buttons */}
      {inputValue === "" && skills.length < suggestedSkills.length && (
        <div className="flex flex-wrap gap-2 mt-2">
          {suggestedSkills
            .filter((skill) => !skills.includes(skill))
            .slice(0, 10)
            .map((skill, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleAddSkill(skill)}
                className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full hover:bg-gray-300 transition-colors"
              >
                {skill}
              </button>
            ))}
        </div>
      )}

      {inputValue !== "" && filteredSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {filteredSuggestions.slice(0, 10).map((skill, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleAddSkill(skill)}
              className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full hover:bg-gray-300 transition-colors"
            >
              {skill}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillInput;
export { categorizeSkills };
