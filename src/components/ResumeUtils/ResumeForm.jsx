import React, { useState, useCallback, useMemo, useEffect } from "react"; // Import useEffect
import { Plus, Trash2, Lightbulb } from "lucide-react";
import Input from "./Input";
import LanguagesSection from "./LanguagesSection";
import HobbyInput from "./HobbyInput";
import RichTextEditorField from "./RichTextEditorField";
import CollapsibleSection from "./CollapsibleSection";
import SkillInput, { categorizeSkills } from "./SkillInput";
import EducationEntry from "./EducationEntry";
import { generateUniqueId } from "./helpers";

const ResumeForm = ({
  resumeData,
  updateResumeData,
  sections,
  activeSection,
  setActiveSection,
  handleDeleteSection,
  handleAddSection,
  handleAISuggestion,
  loadingSuggestion,
  handleMainBuildResumeButton,
}) => {
  const currentCareerLevel =
    resumeData.personalDetails?.careerLevel || "Fresher";

  const [githubError, setGithubError] = useState("");
  const [linkedinError, setLinkedinError] = useState("");

  const cities = useMemo(
    () => [
      "Agartala", "Agra", "Ahmedabad", "Ahmednagar", "Aizawl", "Ajmer", "Akola",
      "Aligarh", "Ambattur", "Amravati", "Amritsar", "Anantapur", "Ankleshwar",
      "Arrah", "Asansol", "Aurangabad", "Ballari", "Balasore", "Balurghat",
      "Bankura", "Bareilly", "Belagavi", "Bengaluru", "Begusarai",
      "Bhagalpur", "Bharuch", "Bhavnagar", "Bhilai", "Bhuj", "Bhopal",
      "Bhubaneswar", "Bidar", "Bikaner", "Bilaspur", "Bokaro Steel City",
      "Burdwan", "Chaibasa", "Chandigarh", "Chennai", "Chirala",
      "Chittoor", "Coimbatore", "Cuttack", "Darbhanga", "Davanagere",
      "Dehradun", "Delhi", "Dhanbad", "Dharwad", "Dindigul", "Diu", "Durgapur",
      "Eluru", "Erode", "Etawah", "Faridabad", "Firozabad", "Gandhidham",
      "Gandhinagar", "Gangtok", "Gaya", "Ghaziabad", "Giridih", "Godhra",
      "Gopalganj", "Gorakhpur", "Gulbarga", "Guntur", "Guwahati", "Gwalior",
      "Hajipur", "Haridwar", "Hapur", "Hassan", "Hazaribagh",
      "Hisar", "Howrah", "Hosur", "Hubballi-Dharwad", "Hyderabad", "Imphal",
      "Indore", "Itanagar", "Jabalpur", "Jagdalpur", "Jaipur", "Jalandhar",
      "Jalgaon", "Jammu", "Jamnagar", "Jamshedpur",
      "Jhansi", "Jharsuguda", "Jhunjhunu", "Jodhpur", "Junagadh", "Kadapa",
      "Kakinada", "Kalyan-Dombivli", "Kanpur", "Karaikudi", "Karimnagar",
      "Kargil", "Karnal", "Katni", "Khammam", "Kharagpur", "Kochi", "Kolhapur",
      "Kolkata", "Kollam", "Kota", "Kohima", "Kumbakonam", "Ludhiana", "Leh",
      "Lucknow", "Madurai", "Malegaon", "Malda", "Mangaluru", "Margao",
      "Mathura", "Mehsana", "Meerut", "Medinipur", "Mira-Bhayandar",
      "Moradabad", "Morbi", "Muzaffarpur", "Mumbai", "Mysuru", "Nadiad",
      "Nagercoil", "Nagpur", "Nanded", "Navsari", "Navi Mumbai", "Nellore",
      "New Delhi", "Nizamabad", "Noida", "Panaji", "Panchkula", "Panipat",
      "Patna", "Pathankot", "Pondicherry", "Porbandar", "Port Blair",
      "Prayagraj", "Pudukkottai", "Pune", "Puri", "Purnea", "Raichur",
      "Raipur", "Rajahmundry", "Rajkot", "Rampur", "Ranchi", "Ratlam",
      "Rewa", "Rohtak", "Rourkela", "Saharanpur", "Salem", "Sambalpur",
      "Satna", "Shillong", "Shimla", "Shimoga", "Sikar", "Siliguri",
      "Siwan", "Solapur", "Srinagar", "Surat", "Surendranagar", "Tezpur",
      "Thane", "Thanjavur", "Thiruvananthapuram", "Thrissur", "Tiruchirappalli",
      "Tirunelveli", "Tiruppur", "Tiruvannamalai", "Tuticorin", "Tumakuru",
      "Udaipur", "Ujjain", "Ulhasnagar", "Vadodara", "Valsad", "Varanasi",
      "Vasai-Virar", "Vellore", "Veraval", "Vijayawada", "Visakhapatnam",
      "Warangal"
    ],
    []
  );

  // Define limits based on career level
  const limits = useMemo(() => {
    switch (currentCareerLevel) {
      case "Fresher":
        return {
          maxProjects: 1,
          maxWorkExperiences: 1, // Fresher typically has no work experience
          maxSkills: 10,
          showWorkExperience: true,
        };
      case "Intermediate":
        return {
          maxProjects: 2,
          maxWorkExperiences: 2,
          maxSkills: Infinity,
          showWorkExperience: true,
        };
      case "Expert":
        return {
          maxProjects: 3,
          maxWorkExperiences: 3,
          maxSkills: Infinity,
          showWorkExperience: true,
        };
      default:
        return {
          maxProjects: 1,
          maxWorkExperiences: 1,
          maxSkills: 10,
          showWorkExperience: true,
        };
    }
  }, [currentCareerLevel]);

  const doneButton = (
    <button
      onClick={() => setActiveSection(null)}
      className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors"
    >
      Done
    </button>
  );

  const getPreviewText = useCallback((text) => {
    if (typeof text === "string") {
      const doc = new DOMParser().parseFromString(text, "text/html");
      const plainText = doc.body.textContent || "";
      return plainText.substring(0, 30) + (plainText.length > 30 ? "..." : "");
    }
    return "";
  }, []);

  const renderForm = useCallback(
    (title) => {
      switch (title) {
        case "Personal details":
          return (
            <div className="space-y-4">
              <Input
                label="First Name"
                value={resumeData.personalDetails.firstName || ""}
                onChange={(e) =>
                  updateResumeData(
                    "personalDetails",
                    "firstName",
                    e.target.value
                  )
                }
              />
              <Input
                label="Last Name"
                value={resumeData.personalDetails.lastName || ""}
                onChange={(e) =>
                  updateResumeData(
                    "personalDetails",
                    "lastName",
                    e.target.value
                  )
                }
              />
              <Input
                label="Email"
                type="email"
                value={resumeData.personalDetails.email || ""}
                onChange={(e) =>
                  updateResumeData("personalDetails", "email", e.target.value)
                }
              />
              <Input
                label="Phone"
                type="tel"
                value={resumeData.personalDetails.phone || ""}
                onChange={(e) =>
                  updateResumeData("personalDetails", "phone", e.target.value)
                }
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <select
                  value={resumeData.personalDetails.address || ""}
                  onChange={(e) =>
                    updateResumeData("personalDetails", "address", e.target.value)
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="" disabled>
                    Select city
                  </option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Designation"
                value={resumeData.personalDetails.designation || ""}
                onChange={(e) =>
                  updateResumeData(
                    "personalDetails",
                    "designation",
                    e.target.value
                  )
                }
              />
              {/* Career Level Dropdown */}
              <div>
                <label
                  htmlFor="careerLevel"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Career Level
                </label>
                <select
                  id="careerLevel"
                  name="careerLevel"
                  value={resumeData.personalDetails.careerLevel || "Fresher"}
                  onChange={(e) =>
                    updateResumeData(
                      "personalDetails",
                      "careerLevel",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="Fresher">Fresher</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              {doneButton}
            </div>
          );
        case "Profile summary":
          console.log("profileSummary", resumeData);
          return (
            <div className="space-y-4">
              <RichTextEditorField
                label="Profile Summary"
                value={resumeData.profileSummary || ""}
                onUpdate={(content) =>
                  updateResumeData("profileSummary", null, content)
                }
                onAISuggestion={() =>
                  handleAISuggestion(
                    "profileSummary",
                    null,
                    resumeData.profileSummary,
                    "profileSummary"
                  )
                }
                loadingSuggestion={loadingSuggestion}
                identifier="profileSummary"
              />
              {doneButton}
            </div>
          );
        case "Education":
          return (
            <div className="space-y-4">
              {resumeData.education.map((edu) => (
                <EducationEntry
                  key={edu.id}
                  education={edu}
                  onUpdate={(field, value) =>
                    updateResumeData("education", field, value, edu.id)
                  }
                  onDelete={() => {
                    const updatedEducation = resumeData.education.filter(
                      (item) => item.id !== edu.id
                    );
                    updateResumeData("education", null, updatedEducation);
                  }}
                  isLast={resumeData.education.length === 1}
                />
              ))}
              <button
                onClick={() =>
                  updateResumeData("education", null, [
                    ...resumeData.education,
                    {
                      id: generateUniqueId(),
                      degree: "",
                      university: "",
                      startDate: "",
                      endDate: "",
                      year: "",
                    },
                  ])
                }
                className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
              >
                <Plus size={16} /> Add another education
              </button>
              {doneButton}
            </div>
          );
        case "Work experience":
          return (
            <div className="space-y-6">
              {resumeData.workExperience.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No work experience added yet. Click "Add Experience" to get
                  started.
                </p>
              ) : (
                // Map over experiences ONLY if there are any
                resumeData.workExperience.map((exp) => (
                  <div
                    key={exp.id}
                    className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Experience
                      </h4>
                      {/* Keep the trash icon here, it correctly appears only when an item exists */}
                      <Trash2
                        size={16}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        onClick={() => {
                          const updatedExperience =
                            resumeData.workExperience.filter(
                              (item) => item.id !== exp.id
                            );
                          updateResumeData(
                            "workExperience",
                            null,
                            updatedExperience
                          );
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: "Parent Company", field: "parentCompany" },
                        { label: "Project Title", field: "projectTitle" },
                        { label: "Domain", field: "domain" },
                        {
                          label: "Start Date",
                          field: "startDate",
                          type: "month",
                        },
                        { label: "End Date", field: "endDate", type: "month" },
                      ].map((item, j) => (
                        <Input
                          key={j}
                          label={item.label}
                          type={item.type || "text"}
                          value={exp[item.field] || ""}
                          onChange={(e) =>
                            updateResumeData(
                              "workExperience",
                              item.field,
                              e.target.value,
                              exp.id
                            )
                          }
                        />
                      ))}
                    </div>
                    {[{ label: "Description", field: "description" }].map(
                      (item, j) => (
                        <RichTextEditorField
                          key={j}
                          label={item.label}
                          value={exp[item.field] || ""}
                          onUpdate={(content) =>
                            updateResumeData(
                              "workExperience",
                              item.field,
                              content,
                              exp.id
                            )
                          }
                          onAISuggestion={() =>
                            handleAISuggestion(
                              "workExperience",
                              item.field,
                              exp[item.field],
                              exp.id
                            )
                          }
                          loadingSuggestion={loadingSuggestion}
                          identifier={`${exp.id}-${item.field}`}
                        />
                      )
                    )}
                  </div>
                ))
              )}

              {/* Place the Add button AFTER the conditional mapping */}
              {resumeData.workExperience.length < limits.maxWorkExperiences ? (
                <button
                  onClick={() =>
                    updateResumeData("workExperience", null, [
                      ...resumeData.workExperience,
                      {
                        id: generateUniqueId(),
                        parentCompany: "",
                        projectTitle: "",
                        domain: "",
                        startDate: "",
                        endDate: "",
                        description: "",
                      },
                    ])
                  }
                  className="text-blue-600 dark:text-blue-400 text-sm flex items-center gap-1 hover:underline mt-4" // Added mt-4 for spacing
                >
                  <Plus size={16} /> Add Experience
                </button>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Maximum {limits.maxWorkExperiences} work experiences allowed
                  for your career level.
                </p>
              )}
              {doneButton}
            </div>
          );
        case "Key skills":
          return (
            <div className="space-y-4">
              <SkillInput
                skills={resumeData.keySkills || []}
                onSkillsChange={(updatedSkills) => {
                  const categorized = categorizeSkills(updatedSkills);

                  updateResumeData("keySkills", null, updatedSkills);

                  const categorizedFields = [
                    "skillsProgrammingLanguages",
                    "skillsFrameworks",
                    "skillsDevelopmentTools",
                    "skillsDatabases",
                    "skillsWebTechnologies",
                    "skillsMobilityPlatforms",
                    "skillsCloud",
                    "skillsTesting",
                    "skillsPrimaryTechnology",
                  ];

                  categorizedFields.forEach((field) => {
                    updateResumeData(field, null, categorized[field] || "");
                  });
                }}
                placeholder="Enter skills you use at work. Eg: Java, SQL"
                label="Key Skills"
                maxSkills={limits.maxSkills}
              />
              {doneButton}
            </div>
          );
        case "Projects":
          return (
            <div className="space-y-6">
              {resumeData.projects.map((project) => (
                <div
                  key={project.id}
                  className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Project
                    </h4>
                    {resumeData.projects.length > 0 && ( // Allow deleting even if it's the last one
                      <Trash2
                        size={16}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        onClick={() => {
                          const updatedProjects = resumeData.projects.filter(
                            (item) => item.id !== project.id
                          );
                          updateResumeData("projects", null, updatedProjects);
                        }}
                      />
                    )}
                  </div>
                  <Input
                    label="Project Name"
                    value={project.name}
                    onChange={(e) =>
                      updateResumeData(
                        "projects",
                        "name",
                        e.target.value,
                        project.id
                      )
                    }
                  />
                  <Input
                    label="Project Link (Optional)"
                    value={project.link}
                    onChange={(e) =>
                      updateResumeData(
                        "projects",
                        "link",
                        e.target.value,
                        project.id
                      )
                    }
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <RichTextEditorField
                      label="Description"
                      value={project.description}
                      onUpdate={(content) =>
                        updateResumeData(
                          "projects",
                          "description",
                          content,
                          project.id
                        )
                      }
                      onAISuggestion={() =>
                        handleAISuggestion(
                          "projects",
                          "description",
                          project.description,
                          project.id
                        )
                      }
                      loadingSuggestion={loadingSuggestion}
                      identifier={project.id}
                    />
                  </div>
                </div>
              ))}
              {resumeData.projects.length < limits.maxProjects ? (
                <button
                  onClick={() =>
                    updateResumeData("projects", null, [
                      ...resumeData.projects,
                      {
                        id: generateUniqueId(),
                        name: "",
                        link: "",
                        description: "",
                      },
                    ])
                  }
                  className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
                >
                  <Plus size={16} /> Add Project
                </button>
              ) : (
                <p className="text-sm text-gray-500">
                  Maximum {limits.maxProjects} project(s) allowed for your
                  career level.
                </p>
              )}
              {doneButton}
            </div>
          );
        case "Internships":
          return (
            <div className="space-y-6">
              {resumeData.internships.map((internship) => (
                <div
                  key={internship.id}
                  className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Internship
                    </h4>
                    {resumeData.internships.length > 1 && (
                      <Trash2
                        size={16}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        onClick={() => {
                          const updatedInternships =
                            resumeData.internships.filter(
                              (item) => item.id !== internship.id
                            );
                          updateResumeData(
                            "internships",
                            null,
                            updatedInternships
                          );
                        }}
                      />
                    )}
                  </div>
                  <Input
                    label="Company"
                    value={internship.company}
                    onChange={(e) =>
                      updateResumeData(
                        "internships",
                        "company",
                        e.target.value,
                        internship.id
                      )
                    }
                  />
                  <Input
                    label="Role"
                    value={internship.role}
                    onChange={(e) =>
                      updateResumeData(
                        "internships",
                        "role",
                        e.target.value,
                        internship.id
                      )
                    }
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      type="month"
                      label="Start Date"
                      value={internship.startDate}
                      onChange={(e) =>
                        updateResumeData(
                          "internships",
                          "startDate",
                          e.target.value,
                          internship.id
                        )
                      }
                    />
                    <Input
                      type="month"
                      label="End Date"
                      value={internship.endDate}
                      onChange={(e) =>
                        updateResumeData(
                          "internships",
                          "endDate",
                          e.target.value,
                          internship.id
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <RichTextEditorField
                      label="Description"
                      value={internship.description}
                      onUpdate={(content) =>
                        updateResumeData(
                          "internships",
                          "description",
                          content,
                          internship.id
                        )
                      }
                      onAISuggestion={() =>
                        handleAISuggestion(
                          "internships",
                          "description",
                          internship.description,
                          internship.id
                        )
                      }
                      loadingSuggestion={loadingSuggestion}
                      identifier={internship.id}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() =>
                  updateResumeData("internships", null, [
                    ...resumeData.internships,
                    {
                      id: generateUniqueId(),
                      company: "",
                      role: "",
                      startDate: "",
                      endDate: "",
                      description: "",
                    },
                  ])
                }
                className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
              >
                <Plus size={16} /> Add Internship
              </button>
              {doneButton}
            </div>
          );
        case "Languages":
          return (
            <LanguagesSection
              resumeData={resumeData}
              updateResumeData={updateResumeData}
              doneButton={doneButton}
            />
          );

        case "Certifications":
          return (
            <div className="space-y-4">
              {resumeData.certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Certification
                    </h4>
                    {resumeData.certifications.length > 1 && (
                      <Trash2
                        size={16}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        onClick={() => {
                          const updatedCertifications =
                            resumeData.certifications.filter(
                              (item) => item.id !== cert.id
                            );
                          updateResumeData(
                            "certifications",
                            null,
                            updatedCertifications
                          );
                        }}
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Certification Name"
                      value={cert.name}
                      onChange={(e) =>
                        updateResumeData(
                          "certifications",
                          "name",
                          e.target.value,
                          cert.id
                        )
                      }
                    />
                    <Input
                      label="Organization"
                      value={cert.organization}
                      onChange={(e) =>
                        updateResumeData(
                          "certifications",
                          "organization",
                          e.target.value,
                          cert.id
                        )
                      }
                    />
                    <Input
                      type="month"
                      label="Date"
                      value={cert.date}
                      onChange={(e) =>
                        updateResumeData(
                          "certifications",
                          "date",
                          e.target.value,
                          cert.id
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() =>
                  updateResumeData("certifications", null, [
                    ...resumeData.certifications,
                    {
                      id: generateUniqueId(),
                      name: "",
                      organization: "",
                      date: "",
                    },
                  ])
                }
                className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
              >
                <Plus size={16} /> Add Certification
              </button>
              {doneButton}
            </div>
          );
        case "Website or social media":
          return (
            <div className="space-y-4">
              <Input
                label="Website URL"
                value={resumeData.websiteSocialMedia.website || ""}
                onChange={(e) =>
                  updateResumeData(
                    "websiteSocialMedia",
                    "website",
                    e.target.value
                  )
                }
                placeholder="e.g., https://yourportfolio.com"
              />
              <Input
                label="GitHub URL"
                value={resumeData.websiteSocialMedia.github || ""}
                onChange={(e) => {
                  const v = e.target.value;
                  updateResumeData("websiteSocialMedia", "github", v);
                  if (!v) {
                    setGithubError("");
                  } else {
                    const re = /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+(\/[A-Za-z0-9_.-]+)?\/?$/;
                    setGithubError(re.test(v) ? "" : "Enter a valid GitHub URL, e.g., https://github.com/yourusername");
                  }
                }}
                onBlur={(e) => {
                  const v = (e.target.value || "").trim();
                  const re = /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+(\/[A-Za-z0-9_.-]+)?\/?$/;
                  if (v && !re.test(v)) {
                    updateResumeData("websiteSocialMedia", "github", "");
                    setGithubError("");
                  }
                }}
                placeholder="e.g., https://github.com/yourusername"
                pattern="^https?:\\/\\/(www\\.)?github\\.com\\/.+"
                error={!!githubError}
                errorMessage={githubError}
              />
              <Input
                label="LinkedIn URL"
                value={resumeData.websiteSocialMedia.linkedin || ""}
                onChange={(e) => {
                  const v = e.target.value;
                  updateResumeData("websiteSocialMedia", "linkedin", v);
                  if (!v) {
                    setLinkedinError("");
                  } else {
                    const re = /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9%_\-]+\/?(\?.*)?$/;
                    setLinkedinError(re.test(v) ? "" : "Enter a valid LinkedIn profile URL, e.g., https://linkedin.com/in/yourprofile");
                  }
                }}
                onBlur={(e) => {
                  const v = (e.target.value || "").trim();
                  const re = /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9%_\-]+\/?(\?.*)?$/;
                  if (v && !re.test(v)) {
                    updateResumeData("websiteSocialMedia", "linkedin", "");
                    setLinkedinError("");
                  }
                }}
                placeholder="e.g., https://linkedin.com/in/yourprofile"
                pattern="^https?:\\/\\/(www\\.)?linkedin\\.com\\/in\\/.+"
                error={!!linkedinError}
                errorMessage={linkedinError}
              />
              {doneButton}
            </div>
          );
        case "Hobbies":
          return (
            <div className="space-y-4">
              <HobbyInput
                hobbies={resumeData.hobbies || []}
                onHobbiesChange={(updatedHobbies) =>
                  updateResumeData("hobbies", null, updatedHobbies)
                }
                label="Hobbies"
                placeholder="Type or select a hobby"
              />
              {doneButton}
            </div>
          );
        case "Extra-curricular activities":
          return (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-800">
                Extra-Curricular Activities
              </h3>
              {resumeData.extraCurricularActivities.map((activity, i) => (
                <div
                  key={i}
                  className="relative flex flex-col sm:flex-row sm:items-start gap-3"
                >
                  <div className="flex-grow">
                    <RichTextEditorField
                      label={`Activity ${i + 1}`}
                      value={activity}
                      onUpdate={(content) => {
                        const updated = [
                          ...resumeData.extraCurricularActivities,
                        ];
                        updated[i] = content;
                        updateResumeData(
                          "extraCurricularActivities",
                          null,
                          updated
                        );
                      }}
                      onAISuggestion={() =>
                        handleAISuggestion(
                          "extraCurricularActivities",
                          null,
                          activity,
                          i
                        )
                      }
                      loadingSuggestion={loadingSuggestion}
                      identifier={i}
                    />
                  </div>

                  {resumeData.extraCurricularActivities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated =
                          resumeData.extraCurricularActivities.filter(
                            (_, idx) => idx !== i
                          );
                        updateResumeData(
                          "extraCurricularActivities",
                          null,
                          updated
                        );
                      }}
                      className="text-gray-400 hover:text-red-500 mt-1 sm:mt-7 transition-colors"
                      aria-label="Remove activity"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateResumeData("extraCurricularActivities", null, [
                      ...resumeData.extraCurricularActivities,
                      "",
                    ])
                  }
                  className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
                >
                  <Plus size={16} /> Add Activity
                </button>
                {doneButton}
              </div>
            </div>
          );

        default:
          // Handles custom sections
          return (
            <div className="space-y-4">
              {(resumeData.customContent[title] || []).map((val, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex-grow">
                    <RichTextEditorField
                      label={`${title} ${i + 1}`}
                      value={val}
                      onUpdate={(content) => {
                        const updatedContent = { ...resumeData.customContent };
                        const updatedSection = [
                          ...(updatedContent[title] || []),
                        ];
                        updatedSection[i] = content;
                        updateResumeData(
                          "customContent",
                          title,
                          updatedSection
                        );
                      }}
                      onAISuggestion={() =>
                        handleAISuggestion("customContent", title, val, i)
                      }
                      loadingSuggestion={loadingSuggestion}
                      identifier={i}
                    />
                  </div>

                  {(resumeData.customContent[title] || []).length > 1 && (
                    <Trash2
                      size={16}
                      className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer mt-7"
                      onClick={() => {
                        const updatedContent = { ...resumeData.customContent };
                        const updatedSection = (
                          updatedContent[title] || []
                        ).filter((_, idx) => idx !== i);
                        updateResumeData(
                          "customContent",
                          title,
                          updatedSection
                        );
                      }}
                    />
                  )}
                </div>
              ))}
              <button
                onClick={() => {
                  const updatedContent = { ...resumeData.customContent };
                  const updatedSection = [...(updatedContent[title] || []), ""];
                  updateResumeData("customContent", title, updatedSection);
                }}
                className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
              >
                <Plus size={16} /> Add {title}
              </button>
              {doneButton}
            </div>
          );
      }
    },
    [
      resumeData,
      updateResumeData,
      doneButton,
      handleAISuggestion,
      loadingSuggestion,
      limits,
    ]
  );

  const filteredSections = useMemo(() => {
    return sections.filter((section) => {
      if (section.title === "Work experience") {
        return true;
      }
      return true;
    });
  }, [sections]);

  // Define which optional sections can be added based on career level
  const allowedOptionalSections = useMemo(() => {
    const allOptionalSections = [
      "Certifications",
      "Website or social media",
      // "Hobbies",
      // "Extra-curricular activities",
      "Custom section",
    ];

    // For now, all optional sections are available regardless of career level.
    // If specific optional sections should be hidden for certain levels, add logic here.
    return allOptionalSections;
  }, [currentCareerLevel]);

  return (
    <>
      {filteredSections.map((section, idx) => {
        let itemLabel = "";
        const dataKey = section.key;
        const sectionData =
          resumeData[dataKey] || resumeData.customContent[section.title];

        if (Array.isArray(sectionData) && sectionData.length > 0) {
          if (dataKey === "education" && sectionData[0]?.degree) {
            itemLabel = sectionData[0].degree;
          } else if (
            dataKey === "workExperience" &&
            (sectionData[0]?.projectTitle || sectionData[0]?.parentCompany)
          ) {
            itemLabel =
              sectionData[0].projectTitle || sectionData[0].parentCompany;
          } else if (
            dataKey === "internships" &&
            (sectionData[0]?.role || sectionData[0]?.company)
          ) {
            itemLabel = `${sectionData[0].role || ""} at ${sectionData[0].company || ""
              }`.trim();
          } else if (dataKey === "certifications" && sectionData[0]?.name) {
            itemLabel = sectionData[0].name;
          } else if (dataKey === "profileSummary") {
            itemLabel = getPreviewText(resumeData.profileSummary[0]);
          } else if (dataKey === "keySkills") {
            itemLabel = getPreviewText(sectionData.join(", "));
          } else if (dataKey === "projects") {
            itemLabel = getPreviewText(sectionData[0]?.name);
          } else if (dataKey === "languages" && sectionData[0]?.name) {
            itemLabel = sectionData[0].name;
          } else if (dataKey === "hobbies") {
            itemLabel = getPreviewText(sectionData.join(", "));
          } else if (dataKey === "extraCurricularActivities") {
            itemLabel = getPreviewText(sectionData[0]);
          } else if (section.title.includes("Custom")) {
            itemLabel = getPreviewText(sectionData[0]);
          }
        } else if (
          dataKey === "personalDetails" &&
          resumeData.personalDetails.firstName
        ) {
          itemLabel =
            `${resumeData.personalDetails.firstName} ${resumeData.personalDetails.lastName}`.trim();
        } else if (
          dataKey === "websiteSocialMedia" &&
          (resumeData.websiteSocialMedia.website ||
            resumeData.websiteSocialMedia.linkedin ||
            resumeData.websiteSocialMedia.github)
        ) {
          if (resumeData.websiteSocialMedia.website) {
            itemLabel =
              resumeData.websiteSocialMedia.website
                .replace(/(^\w+:|^)\/\//, "")
                .substring(0, 30) +
              (resumeData.websiteSocialMedia.website.length > 30 ? "..." : "");
          } else if (resumeData.websiteSocialMedia.linkedin) {
            itemLabel = "LinkedIn Profile";
          } else if (resumeData.websiteSocialMedia.github) {
            itemLabel = "GitHub Profile";
          }
        }

        return (
          <CollapsibleSection
            key={idx}
            title={section.title}
            isOpen={activeSection === section.title}
            onToggle={() =>
              setActiveSection(
                activeSection === section.title ? null : section.title
              )
            }
            isAiPowered={section.aiPowered}
            onDelete={
              section.deletable
                ? () => handleDeleteSection(section.title)
                : null
            }
            itemLabel={itemLabel}
          >
            {renderForm(section.title)}
          </CollapsibleSection>
        );
      })}

      <div className="p-4 bg-white rounded-b-xl border-t border-gray-200">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Add more sections
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {allowedOptionalSections
            .filter(
              (secTitle) => !filteredSections.some((s) => s.title === secTitle)
            )
            .map((secType, i) => (
              <button
                key={i}
                onClick={() => handleAddSection(secType)}
                className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md border border-gray-300 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <Plus size={14} /> {secType}
              </button>
            ))}
        </div>
      </div>


    </>
  );
};

export default ResumeForm;
