"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import ResumeForm from "@/components/ResumeUtils/ResumeForm";
import { generateUniqueId } from "@/components/ResumeUtils/helpers";
import Layout from "@/components/Layout/Layout";
import { categorizeSkills } from "@/components/ResumeUtils/SkillInput"; // Assuming this is correctly imported and functional
import TemplatePreviewModal from "@/components/ResumeUtils/TemplatePreviewModal";
import toast from "react-hot-toast";
import withAuth from "@/middleware/withAuth";
import { usePathname } from "next/navigation";
import tempImage from "@/assets/image.png"; // Assuming this path is correct
import { chatSession } from "@/utils/GeminiAIModel"; // Assuming this is correctly configured
import AtsScoreModal from "@/components/ResumeUtils/AtsScoreModal"; // Existing ATS Modal
import { BarChart2 } from "lucide-react";
import TemplateModernHtml from "@/components/ResumeTempletes/TemplateModernHtml";
import TemplateIntermediate from "@/components/ResumeTempletes/TemplateIntermediate";
import TemplateExpert from "@/components/ResumeTempletes/TemplateExpert";
import TemplateBasic from "@/components/ResumeTempletes/TemplateBasic";
import { pdf } from "@react-pdf/renderer";
import TemplateModernPdf from "@/components/ResumeTempletes/TemplateModern";
import TemplateIntermediatePdf from "@/components/ResumeTempletes/TemplateIntermediatePdf";
import TemplateExpertPdf from "@/components/ResumeTempletes/TemplateExpertPdf";
import TemplateBasicPdf from "@/components/ResumeTempletes/TemplateBasicPdf";

const templateComponents = {
  Modern: TemplateModernHtml,
  Intermediate: TemplateIntermediate,
  Expert: TemplateExpert,
  Basic: TemplateBasic,
};

// Removed thumbnail grid in favor of a dropdown selector

function ResumeBuilder() {
  // Define all possible sections, including their default deletable status and key
  const allPossibleSectionsConfig = useMemo(
    // Renamed to avoid conflict with 'sections' state
    () => [
      {
        title: "Personal details",
        aiPowered: false,
        deletable: false,
        key: "personalDetails",
      },
      {
        title: "Profile summary",
        aiPowered: true,
        deletable: false,
        key: "profileSummary",
      },
      {
        title: "Education",
        aiPowered: false,
        deletable: false,
        key: "education",
      },
      {
        title: "Work experience",
        aiPowered: true,
        deletable: false,
        key: "workExperience",
      },
      {
        title: "Key skills",
        aiPowered: false,
        deletable: false,
        key: "keySkills",
      },
      {
        title: "Projects",
        aiPowered: true,
        deletable: false,
        key: "projects",
      },
      {
        title: "Internships",
        aiPowered: true,
        deletable: true,
        key: "internships",
      },
      // {
      //   title: "Languages",
      //   aiPowered: false,
      //   deletable: true,
      //   key: "languages",
      // },
      {
        title: "Certifications",
        aiPowered: false,
        deletable: true,
        key: "certifications",
      },
      {
        title: "Website or social media",
        aiPowered: false,
        deletable: true,
        key: "websiteSocialMedia",
      },
      // { title: "Hobbies", aiPowered: true, deletable: true, key: "hobbies" },
      // {
      //   title: "Extra-curricular activities",
      //   aiPowered: true,
      //   deletable: true,
      //   key: "extraCurricularActivities",
      // },
    ],
    []
  );

  // State for resume data, initialized from sessionStorage or default
  const [resumeData, setResumeData] = useState(() => {
    const ensureIds = (arr) =>
      Array.isArray(arr)
        ? arr.map((item) =>
            typeof item === "object" && item !== null && !item.id
              ? { ...item, id: generateUniqueId() }
              : item
          )
        : arr;

    if (typeof window !== "undefined") {
      const savedData = sessionStorage.getItem("resumeBuilderData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Ensure all top-level arrays/objects exist and have IDs where needed
        return {
          ...parsedData,
          personalDetails: parsedData.personalDetails || {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            profession: "",
            careerLevel: "Fresher",
          },
          profileSummary: parsedData.profileSummary
            ? parsedData.profileSummary
            : [""],
          education: ensureIds(parsedData.education || []),
          workExperience: ensureIds(parsedData.workExperience || []),
          internships: ensureIds(parsedData.internships || []),
          certifications: ensureIds(parsedData.certifications || []),
          projects: ensureIds(parsedData.projects || []),
          languages: ensureIds(parsedData.languages || []),
          hobbies: Array.isArray(parsedData.hobbies) ? parsedData.hobbies : [],
          extraCurricularActivities: Array.isArray(
            parsedData.extraCurricularActivities
          )
            ? parsedData.extraCurricularActivities
            : [],
          keySkills: Array.isArray(parsedData.keySkills)
            ? parsedData.keySkills
            : [],
          websiteSocialMedia:
            typeof parsedData.websiteSocialMedia === "object" &&
            parsedData.websiteSocialMedia !== null
              ? parsedData.websiteSocialMedia
              : { website: "", github: "", linkedin: "" },
          customContent:
            typeof parsedData.customContent === "object" &&
            parsedData.customContent !== null
              ? parsedData.customContent
              : {},
        };
      }
    }

    // Default initial state for a "Fresher"
    return {
      personalDetails: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        profession: "",
        careerLevel: "Fresher", // Default for new resumes
      },
      profileSummary: ["<p></p>"],
      education: [
        {
          id: generateUniqueId(),
          degree: "",
          university: "",
          year: "",
          startDate: "",
          endDate: "",
        },
      ],
      workExperience: [
        {
          id: generateUniqueId(),
          parentCompany: "",
          projectTitle: "",
          domain: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ], // Fresher starts with no work experience
      keySkills: [],
      projects: [
        // Fresher starts with one project
        {
          id: generateUniqueId(),
          name: "",
          link: "",
          technologies: "",
          description: "",
          startDate: "",
          endDate: "",
        },
      ],
      internships: [],
      languages: [],
      certifications: [],
      websiteSocialMedia: { website: "", github: "", linkedin: "" },
      hobbies: [],
      extraCurricularActivities: [],
      customContent: {},
    };
  });

  const [activeSection, setActiveSection] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("Modern");
  const [showTemplatePreviewModal, setShowTemplatePreviewModal] =
    useState(false);
  const [previewTemplateName, setPreviewTemplateName] = useState(null);

  const [apiStatus, setApiStatus] = useState({
    loading: false,
    success: false,
    error: null,
    message: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  // State for ATS scoring results
  const [atsScore, setAtsScore] = useState(null);
  const [atsStrengths, setAtsStrengths] = useState([]);
  const [atsSuggestions, setAtsSuggestions] = useState([]);
  const [showAtsModal, setShowAtsModal] = useState(false);
  const [loadingAtsScore, setLoadingAtsScore] = useState(false);

  const currentCareerLevel =
    resumeData.personalDetails?.careerLevel || "Fresher";

  // State for sections, initialized based on career level and updated dynamically
  const [sections, setSections] = useState(() => {
    let initialSections = [...allPossibleSectionsConfig];

    if (currentCareerLevel === "Fresher") {
      const fresherSectionsTitles = [
        "Personal details",
        "Website or social media",
        "Certifications",
        "Work experience",
        "Internships",
        "Projects",
        "Key skills",
        "Profile summary",
        "Education",
        "Languages",
        "Hobbies",
        "Extra-curricular activities",
      ];
      initialSections = initialSections.filter((section) =>
        fresherSectionsTitles.includes(section.title)
      );
    }

    // Add any existing custom sections from resumeData
    Object.keys(resumeData.customContent).forEach((customTitle) => {
      if (!initialSections.some((s) => s.title === customTitle)) {
        initialSections.push({
          title: customTitle,
          aiPowered: false,
          deletable: true,
          key: customTitle.toLowerCase().replace(/ /g, ""),
        });
      }
    });
    return initialSections;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Convert to boolean

    const ensureIds = (arr) =>
      Array.isArray(arr)
        ? arr.map((item) =>
            typeof item === "object" && item !== null && !item.id
              ? { ...item, id: generateUniqueId() }
              : item
          )
        : [];

    const fetchResumeData = async (currentCareerLevel) => {
      try {
        const res = await fetch(
          `/api/user-resume/view?careerLevel=${encodeURIComponent(
            currentCareerLevel
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();

        const resumeString = result?.data?.resumeJsonString;
        if (!res.ok || !resumeString) {
          console.warn(
            "No resume data found or request failed:",
            result?.error
          );
          // toast.error("No resume found for this user. Using default resume.");
          sessionStorage.removeItem("resumeBuilderData");

          const fallbackResume = {
            ...resumeData, // Use the current default resumeData state as fallback
            education: ensureIds(resumeData.education),
            workExperience: ensureIds(resumeData.workExperience),
            internships: ensureIds(resumeData.internships),
            certifications: ensureIds(resumeData.certifications),
            projects: ensureIds(resumeData.projects),
            languages: ensureIds(resumeData.languages),
            // Ensure careerLevel is set for fallback
            personalDetails: {
              ...resumeData.personalDetails,
              careerLevel: resumeData.personalDetails?.careerLevel || "Fresher",
            },
          };

          setResumeData(fallbackResume);
          sessionStorage.setItem(
            "resumeBuilderData",
            JSON.stringify(fallbackResume)
          );
          return;
        }

        const parsedData = JSON.parse(resumeString);

        const updatedResume = {
          ...parsedData,
          // Ensure IDs for fetched data
          education: ensureIds(parsedData.education || []),
          workExperience: ensureIds(parsedData.workExperience || []),
          internships: ensureIds(parsedData.internships || []),
          certifications: ensureIds(parsedData.certifications || []),
          projects: ensureIds(parsedData.projects || []),
          languages: ensureIds(parsedData.languages || []),
          hobbies: Array.isArray(parsedData.hobbies) ? parsedData.hobbies : [],
          extraCurricularActivities: Array.isArray(
            parsedData.extraCurricularActivities
          )
            ? parsedData.extraCurricularActivities
            : [],
          keySkills: Array.isArray(parsedData.keySkills)
            ? parsedData.keySkills
            : [],
          profileSummary: parsedData.profileSummary
            ? parsedData.profileSummary
            : [""],
          personalDetails: {
            ...parsedData.personalDetails,
            careerLevel: parsedData.personalDetails?.careerLevel || "Fresher",
          }, // Ensure careerLevel is set
          customContent:
            typeof parsedData.customContent === "object" &&
            parsedData.customContent !== null
              ? parsedData.customContent
              : {},
        };

        setResumeData(updatedResume);
        sessionStorage.setItem(
          "resumeBuilderData",
          JSON.stringify(updatedResume)
        );
      } catch (err) {
        console.error("Error fetching resume data:", err);
        // toast.error("Failed to fetch resume. Using default resume.");

        const fallbackResume = {
          ...resumeData, // Use the current default resumeData state as fallback
          education: ensureIds(resumeData.education),
          workExperience: ensureIds(resumeData.workExperience),
          internships: ensureIds(resumeData.internships),
          certifications: ensureIds(resumeData.certifications),
          projects: ensureIds(resumeData.projects),
          languages: ensureIds(resumeData.languages),
          // Ensure careerLevel is set for fallback
          personalDetails: {
            ...resumeData.personalDetails,
            careerLevel: resumeData.personalDetails?.careerLevel || "Fresher",
          },
        };

        setResumeData(fallbackResume);
        sessionStorage.setItem(
          "resumeBuilderData",
          JSON.stringify(fallbackResume)
        );
      }
    };

    if (isLoggedIn) {
      // Only fetch if logged in
      fetchResumeData(currentCareerLevel);
    }
  }, [isLoggedIn, currentCareerLevel]); // Removed resumeData from dependency array to prevent infinite loop, as it's updated within the effect

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("resumeBuilderData", JSON.stringify(resumeData));
    }
  }, [resumeData]);

  // Update sections when resumeData changes (especially when custom sections are loaded)
  useEffect(() => {
    setSections((prevSections) => {
      let updatedSections = [...allPossibleSectionsConfig];

      if (currentCareerLevel === "Fresher") {
        const fresherSectionsTitles = [
          "Personal details",
          "Website or social media",
          "Certifications",
          "Work experience",
          "Internships",
          "Projects",
          "Key skills",
          "Profile summary",
          "Education",
          "Languages",
          "Hobbies",
          "Extra-curricular activities",
        ];
        updatedSections = updatedSections.filter((section) =>
          fresherSectionsTitles.includes(section.title)
        );
      }

      // Add any existing custom sections from resumeData
      Object.keys(resumeData.customContent || {}).forEach((customTitle) => {
        if (!updatedSections.some((s) => s.title === customTitle)) {
          updatedSections.push({
            title: customTitle,
            aiPowered: false,
            deletable: true,
            key: customTitle.toLowerCase().replace(/ /g, ""),
          });
        }
      });

      return updatedSections;
    });
  }, [resumeData.customContent, currentCareerLevel, allPossibleSectionsConfig]);

  const handleAddSection = useCallback(
    (type) => {
      let newSectionTitle = type;
      let isAiPowered = false;
      let isDeletable = true;
      let newSectionKey = type.toLowerCase().replace(/ /g, "");

      if (type === "Custom section") {
        const name = prompt("Enter custom section title:");
        if (name && name.trim() !== "") {
          newSectionTitle = name.trim();
          newSectionKey = name.trim().toLowerCase().replace(/ /g, "");
          let counter = 1;
          let originalKey = newSectionKey;
          while (
            sections.some((s) => s.key === newSectionKey) ||
            resumeData.customContent[newSectionTitle] // Check if title exists in customContent
          ) {
            newSectionKey = `${originalKey}${counter}`;
            newSectionTitle = `${name.trim()} ${counter}`; // Also update title for display
            counter++;
          }
        } else {
          return;
        }
      }

      // Check if the section already exists before adding
      if (
        sections.some((section) => section.title === newSectionTitle) &&
        type !== "Custom section"
      ) {
        toast.error(`${newSectionTitle} section already exists.`);
        return;
      }

      setSections((prevSections) => [
        ...prevSections,
        {
          title: newSectionTitle,
          aiPowered: isAiPowered,
          deletable: isDeletable,
          key: newSectionKey,
        },
      ]);

      setResumeData((prev) => {
        const newResumeData = { ...prev };
        switch (newSectionTitle) {
          case "Certifications":
            newResumeData.certifications = [
              { id: generateUniqueId(), name: "", organization: "", date: "" },
            ];
            break;
          case "Website or social media":
            newResumeData.websiteSocialMedia = {
              website: "",
              github: "",
              linkedin: "",
            };
            break;
          case "Hobbies":
            newResumeData.hobbies = []; // Initialize as empty array for HobbyInput
            break;
          case "Extra-curricular activities":
            newResumeData.extraCurricularActivities = [""];
            break;
          case "Internships": // Ensure internships are initialized if added later
            newResumeData.internships = [
              {
                id: generateUniqueId(),
                company: "",
                role: "",
                startDate: "",
                endDate: "",
                description: "",
              },
            ];
            break;
          case "Languages": // Ensure languages are initialized if added later
            newResumeData.languages = [
              { id: generateUniqueId(), name: "", proficiency: "" },
            ];
            break;
          default:
            // For custom sections, initialize with an empty string in an array
            if (
              newSectionTitle.includes("Custom") ||
              !Object.keys(newResumeData).includes(newSectionKey) // Check if key doesn't exist in main data
            ) {
              newResumeData.customContent = {
                ...newResumeData.customContent,
                [newSectionTitle]: [""],
              };
            }
            break;
        }
        return newResumeData;
      });
    },
    [sections, resumeData] // Depend on sections and resumeData for accurate checks
  );

  const handleDeleteSection = useCallback(
    (titleToDelete) => {
      setSections((prevSections) =>
        prevSections.filter((section) => section.title !== titleToDelete)
      );
      if (activeSection === titleToDelete) {
        setActiveSection(null);
      }

      const sectionKeyMap = {
        Certifications: "certifications",
        Education: "education",
        "Work experience": "workExperience",
        "Key skills": "keySkills",
        Languages: "languages",
        Projects: "projects",
        Internships: "internships",
        Hobbies: "hobbies",
        "Extra-curricular activities": "extraCurricularActivities",
        "Website or social media": "websiteSocialMedia",
        "Profile summary": "profileSummary", // Add profileSummary for reset
        "Personal details": "personalDetails", // Add personalDetails for reset
      };

      setResumeData((prevData) => {
        const newData = { ...prevData };
        const key = sectionKeyMap[titleToDelete];

        if (key) {
          // Reset to initial default state based on type
          if (Array.isArray(newData[key])) {
            // For arrays, reset to empty or specific default if needed
            if (["profileSummary", "extraCurricularActivities"].includes(key)) {
              newData[key] = [""]; // Reset to array with one empty string
            } else if (key === "keySkills" || key === "hobbies") {
              newData[key] = []; // Reset to empty array
            } else {
              newData[key] = []; // Default for other arrays (e.g., education, projects)
            }
          } else if (
            typeof newData[key] === "object" &&
            newData[key] !== null
          ) {
            // Reset objects to their initial empty state
            if (key === "personalDetails") {
              newData[key] = {
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                address: "",
                profession: "",
                careerLevel: "Fresher",
              };
            } else if (key === "websiteSocialMedia") {
              newData[key] = { website: "", github: "", linkedin: "" };
            } else {
              newData[key] = {}; // Generic object reset
            }
          } else {
            newData[key] = ""; // Reset strings to empty
          }
        }
        // Handle custom content deletion
        if (
          newData.customContent &&
          newData.customContent.hasOwnProperty(titleToDelete)
        ) {
          const newCustomContent = { ...newData.customContent };
          delete newCustomContent[titleToDelete];
          newData.customContent = newCustomContent;
        }
        return newData;
      });
    },
    [activeSection, sections]
  );

  const updateResumeData = useCallback(
    (section, field, value, itemId = null) => {
      setResumeData((prevData) => {
        const newData = { ...prevData };

        if (section === "personalDetails" || section === "websiteSocialMedia") {
          newData[section] = { ...newData[section], [field]: value };
        } else if (
          [
            "profileSummary",
            "keySkills",
            "hobbies",
            "extraCurricularActivities",
          ].includes(section)
        ) {
          // For these sections, 'value' is the entire updated array or string
          newData[section] = value;
        } else if (section === "customContent" && typeof field === "string") {
          // For customContent, 'field' is the custom section title, 'value' is the array of content
          newData.customContent = { ...newData.customContent, [field]: value };
        } else if (Array.isArray(newData[section])) {
          if (itemId) {
            // Update a specific item in an array (e.g., education, workExperience, projects, internships, certifications, languages)
            newData[section] = newData[section].map((item) =>
              item.id === itemId ? { ...item, [field]: value } : item
            );
          } else {
            // Replace the entire array (e.g., if the component handles the array directly)
            newData[section] = value;
          }
        }
        return newData;
      });
    },
    []
  );

  // Removed: handleFormValidation function

  const handleMainBuildResumeButton = useCallback(async () => {
    const toastId = toast.loading(
      "Saving your resume data and calculating ATS score..."
    );

    setApiStatus({
      loading: true,
      success: false,
      error: null,
      message: "Saving resume data...",
    });
    setLoadingAtsScore(true); // Indicate ATS calculation is also loading

    const apiEndpoint = "/api/user-resume/create";
    const payload = {
      resumeJsonString: JSON.stringify(resumeData),
      careerLevel: resumeData.personalDetails?.careerLevel,
    };
    console.log("Resume payload", resumeData);
    try {
      // Step 1: Save Resume Data
      const token = localStorage.getItem("token");
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Something went wrong while saving your resume."
        );
      }

      toast.success("Resume saved successfully!", { id: toastId });
      setApiStatus({
        loading: false,
        success: true,
        error: null,
        message: "Resume data successfully saved!",
      });

      toast.loading("Calculating ATS score...", { id: toastId }); // Update toast message

      const atsPrompt = `
        You are an Applicant Tracking System (ATS) expert. Your task is to evaluate a candidate's resume against a given job description.
        Analyze the resume for relevant skills, experience, qualifications, and keywords that directly match the job description.

        Provide a detailed ATS compatibility score (out of 100) based on the relevance and strength of the match.
        Also, identify and list key strengths of the resume for ATS.
        Finally, provide actionable suggestions for improving the resume to better match the job description, focusing on keyword optimization and content enhancement.

        **Resume Data (JSON):**
        ${JSON.stringify(resumeData, null, 2)}

      
        Please provide your response in JSON format, adhering to the following schema:
        {
          "atsScore": { "type": "INTEGER", "description": "ATS compatibility score out of 100" },
          "strengths": {
            "type": "ARRAY",
            "items": { "type": "STRING", "description": "Key strengths of the resume for ATS" }
          },
          "suggestions": {
            "type": "ARRAY",
            "items": { "type": "STRING", "description": "Actionable suggestions for ATS improvement" }
          }
        }
        Provide ONLY the JSON object. Do not include any conversational text or markdown outside the JSON.
      `;

      const result = await chatSession.sendMessage(atsPrompt);
      const raw = await result.response.text();

      const cleanedJsonString = raw
        .replace(/```json\s*([\s\S]*?)```/, "$1") // Match and extract only content inside ```json ... ```
        .trim();

      console.log("Raw AI response:", cleanedJsonString);

      const atsData = JSON.parse(cleanedJsonString);
      setAtsScore(atsData.atsScore);
      setAtsStrengths(atsData.strengths);
      setAtsSuggestions(atsData.suggestions);
      setShowAtsModal(true);
      toast.success("ATS score calculated!", { id: toastId });
    } catch (error) {
      console.error("Error during resume save or ATS scoring:", error);

      toast.error(`${error.message}`, { id: toastId });

      setApiStatus({
        loading: false,
        success: false,
        error: true,
        message: `Failed to save resume or calculate ATS score: ${error.message}`,
      });
    } finally {
      setLoadingAtsScore(false);
    }
  }, [resumeData, isLoggedIn]);

  const handleUseTemplate = useCallback((templateName) => {
    setSelectedTemplate(templateName);
    // Removed: setActiveTemplate(templateName); // This state is not defined
  }, []);

  const handlePreviewTemplate = useCallback((templateName) => {
    setPreviewTemplateName(templateName);
    setShowTemplatePreviewModal(true);
    // Removed: setActiveTemplate(templateName); // This state is not defined
  }, []);

  const handleDownloadSelectedPdf = useCallback(async () => {
    const toastId = toast.loading("Generating PDF...");
    try {
      const pdfMap = {
        Modern: TemplateModernPdf,
        Intermediate: TemplateIntermediatePdf,
        Expert: TemplateExpertPdf,
        Basic: TemplateBasicPdf,
      };
      const PdfComponent = pdfMap[selectedTemplate] || TemplateModernPdf;
      const blob = await pdf(<PdfComponent resumeData={resumeData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${selectedTemplate}-resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error(`Failed to generate PDF: ${error.message || "Unknown error"}`, { id: toastId });
    }
  }, [selectedTemplate, resumeData]);

  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [loadingSuggestionIdentifier, setLoadingSuggestionIdentifier] =
    useState(null);

  const handleAISuggestion = useCallback(
    async (sectionKey, fieldName, currentValue, id = null) => {
      setLoadingSuggestion(true);

      // Create a unique identifier for the specific field being suggested
      const currentFieldIdentifier =
        id !== null ? `${sectionKey}-${id}-${fieldName || "main"}` : sectionKey;
      setLoadingSuggestionIdentifier(currentFieldIdentifier);

      try {
        let prompt = "";
        let context = "";
        const careerLevelContext = `My career level is "${currentCareerLevel}".`;

        // --- Prompt Generation Logic ---
        if (sectionKey === "profileSummary") {
          context = `My profession is "${
            resumeData.personalDetails.profession || "a professional"
          }". My key skills are: ${resumeData.keySkills.join(
            ", "
          )}. ${careerLevelContext}`;
          prompt = `Generate a 2-3 sentence professional summary for a resume based on the following information: "${currentValue}". ${context} Focus on impact, key skills, and career goals. Provide only the summary, no extra text or options.`;
        } else if (sectionKey === "extraCurricularActivities") {
          prompt = `Refine this description of an extra-curricular activity into a single, concise, impactful bullet point for a resume, highlighting transferable skills like leadership, teamwork, or initiative. Provide only the bullet point, no extra text or options: "${currentValue}"`;
        } else if (sectionKey === "hobbies") {
          prompt = `Convert these hobbies into a professional, concise, comma-separated list of 3-5 items suitable for a resume. Focus on transferable skills if possible. Provide only the comma-separated list, no extra text or options: "${
            Array.isArray(currentValue) ? currentValue.join(", ") : currentValue
          }"`;
        } else if (sectionKey === "keySkills") {
          prompt = `Given the following raw skills, categorize and refine them into a concise, impactful comma-separated list of 5-10 key skills for a modern tech resume, using strong action verbs where appropriate. Prioritize relevant and in-demand skills. Provide only the comma-separated list, no extra text or options: "${
            Array.isArray(currentValue) ? currentValue.join(", ") : currentValue
          }"`;
        } else if (
          sectionKey === "customContent" &&
          typeof fieldName === "string" &&
          id !== null
        ) {
          prompt = `Refine the following text for a resume section titled "${fieldName}". Make it concise and impactful, suitable for professional bullet points or a short paragraph. Provide ONLY the refined text, no extra text or options. Original content: "${currentValue}"`;
        } else if (
          sectionKey === "workExperience" &&
          id !== null &&
          fieldName
        ) {
          const currentExp = resumeData.workExperience.find(
            (exp) => exp.id === id
          );
          if (currentExp) {
            context = `For a project titled "${
              currentExp.projectTitle || "a project"
            }" at "${
              currentExp.parentCompany || "a company"
            }", in the domain of "${
              currentExp.domain || "IT"
            }". Key technologies involved: ${
              currentExp.technologyFrameworks || "various"
            }. ${careerLevelContext}`;
          }
          if (fieldName === "responsibilities") {
            prompt = `Generate 3-5 powerful, achievement-oriented bullet points for my responsibilities in a work experience entry on a resume. Focus on results and impact. Do not use markdown, bullet points, asterisks, or introductory phrases. Provide each point on a new line. Original content: "${currentValue}". Context: ${context}`;
          } else if (fieldName === "featuresImplemented") {
            prompt = `List 3-5 key features implemented or contributed to for a resume work experience entry. Use action verbs and highlight the impact of these features. Do not use markdown, bullet points, asterisks, or introductory phrases. Provide each point on a new line. Original content: "${currentValue}". Context: ${context}`;
          } else if (fieldName === "goal") {
            prompt = `Condense the main goal or objective of this work experience project into a single, concise sentence for a resume. Provide ONLY the sentence, no extra text or options. Original content: "${currentValue}". Context: ${context}`;
          } else if (fieldName === "platforms") {
            prompt = `List the primary platforms (e.g., Web, iOS, Android, Desktop) relevant to this work experience entry in a concise, comma-separated format. Provide ONLY the comma-separated list, no extra text or options. Original content: "${currentValue}". Context: ${context}`;
          } else if (fieldName === "technologyFrameworks") {
            prompt = `Provide a concise, comma-separated list of the key technology frameworks and tools used in this project/role for a resume. Do NOT provide options, explanations, or conversational text. List only the technologies. Original content: "${currentValue}". Context: ${context}`;
          } else {
            // Completed this 'else' block for any other field in workExperience
            prompt = `Summarize the following text concisely and professionally for the "${fieldName}" field of a work experience entry on a resume. Provide only the summary, no extra text or options: "${currentValue}". Context: ${context}`;
          }
        } else if (
          sectionKey === "projects" &&
          id !== null &&
          fieldName === "description"
        ) {
          const currentProject = resumeData.projects.find(
            (proj) => proj.id === id
          );
          if (currentProject) {
            context = `For a project titled "${
              currentProject.name || "a project"
            }"${
              currentProject.link ? ` (link: ${currentProject.link})` : ""
            }. ${careerLevelContext}`;
          }
          prompt = `Generate 3-5 concise, achievement-oriented bullet points for a project description on a resume. Focus on the project's purpose, technologies used, and outcomes. Do not use markdown, bullet points, asterisks, or introductory phrases. Provide each point on a new line. Original content: "${currentValue}". Context: ${context}`;
        } else if (
          sectionKey === "internships" &&
          id !== null &&
          fieldName === "description"
        ) {
          const currentInternship = resumeData.internships.find(
            (int) => int.id === id
          );
          if (currentInternship) {
            context = `For an internship role as "${
              currentInternship.role || "an intern"
            }" at "${currentInternship.company || "a company"}" from ${
              currentInternship.startDate || "an unspecified date"
            } to ${
              currentInternship.endDate || "an unspecified date"
            }. ${careerLevelContext}`;
          }
          prompt = `Generate 3-5 concise, achievement-oriented bullet points for an internship description on a resume. Focus on responsibilities, projects, and skills gained. Do not use markdown, bullet points, asterisks, or introductory phrases. Provide each point on a new line. Original content: "${currentValue}". Context: ${context}`;
        } else {
          prompt = `Summarize the following text concisely and professionally for a resume. Provide only the summary, no extra text or options: "${currentValue}"`;
        }

        console.log(
          `AI Suggestion Request for section: ${sectionKey}, field: ${fieldName}, value: "${currentValue}"`
        );

        const result = await chatSession.sendMessage(prompt);
        const aiResponse = result.response.text().trim();

        setResumeData((prevData) => {
          const newData = { ...prevData };

          // --- State Update Logic ---
          if (sectionKey === "profileSummary") {
            // Ensure profileSummary is an array, then update the first element
            newData.profileSummary = aiResponse;
          } else if (sectionKey === "extraCurricularActivities") {
            if (id !== null && typeof id === "number") {
              const updatedArray = [...newData.extraCurricularActivities];
              updatedArray[id] = aiResponse;
              newData.extraCurricularActivities = updatedArray;
            } else {
              if (newData.extraCurricularActivities.length > 0) {
                newData.extraCurricularActivities[0] = aiResponse;
              } else {
                newData.extraCurricularActivities.push(aiResponse);
              }
            }
          } else if (sectionKey === "hobbies") {
            newData.hobbies = aiResponse
              .split(",")
              .map((h) => h.trim())
              .filter(Boolean);
          } else if (sectionKey === "keySkills") {
            newData.keySkills = aiResponse
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
          } else if (
            sectionKey === "workExperience" &&
            id !== null &&
            fieldName
          ) {
            const updatedExperience = newData.workExperience.map((exp) =>
              exp.id === id ? { ...exp, [fieldName]: aiResponse } : exp
            );
            newData.workExperience = updatedExperience;
          } else if (
            sectionKey === "projects" &&
            id !== null &&
            fieldName === "description"
          ) {
            const updatedProjects = newData.projects.map((proj) =>
              proj.id === id ? { ...proj, [fieldName]: aiResponse } : proj
            );
            newData.projects = updatedProjects;
          } else if (
            sectionKey === "internships" &&
            id !== null &&
            fieldName === "description"
          ) {
            const updatedInternships = newData.internships.map((int) =>
              int.id === id ? { ...int, [fieldName]: aiResponse } : int
            );
            newData.internships = updatedInternships;
          } else if (
            sectionKey === "customContent" &&
            typeof fieldName === "string"
          ) {
            if (id !== null && typeof id === "number") {
              const customContent = { ...newData.customContent };
              const updatedSection = [...(customContent[fieldName] || [])];
              updatedSection[id] = aiResponse;
              customContent[fieldName] = updatedSection;
              newData.customContent = customContent;
            } else {
              // Fallback for customContent if id is not provided, treat as single string
              const customContent = { ...newData.customContent };
              customContent[fieldName] = [aiResponse]; // Ensure it's an array for consistency
              newData.customContent = customContent;
              console.warn(
                "AI suggestion for customContent called without valid index, treating as single string array."
              );
            }
          }
          return newData;
        });
      } catch (error) {
        console.error("Error generating AI suggestion:", error);
        toast.error("Failed to get AI suggestion. Please try again.");
      } finally {
        setLoadingSuggestion(false);
        setLoadingSuggestionIdentifier(null);
      }
    },
    [resumeData, currentCareerLevel] // Add currentCareerLevel to dependencies for AI context
  );

  const CurrentTemplateComponent = templateComponents[selectedTemplate];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-fuchsia-100 font-sans py-20">
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-7xl mx-auto">
          <div className="lg:col-span-6 bg-white max-h-max rounded-xl shadow-lg p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Build Your Resume
            </h2>
            <ResumeForm
              resumeData={resumeData}
              updateResumeData={updateResumeData}
              sections={sections} // Pass the filtered sections
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              handleDeleteSection={handleDeleteSection}
              handleAddSection={handleAddSection}
              handleMainBuildResumeButton={handleMainBuildResumeButton}
              handleAISuggestion={handleAISuggestion} // Pass the function
              loadingSuggestion={loadingSuggestion} // Pass the loading state
              loadingSuggestionIdentifier={loadingSuggestionIdentifier}
            />
          </div>

          <div className="lg:col-span-6 bg-white rounded-xl shadow-lg p-6 flex flex-col relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Choose Your Resume Template</h2>

            <div className="flex flex-col items-center gap-4 mt-8">
              <label className="w-full max-w-sm text-sm font-medium text-gray-700">Select template</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(templateComponents).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleDownloadSelectedPdf}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow"
                >
                  Download
                </button>
                <button
                  onClick={() => handlePreviewTemplate(selectedTemplate)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md shadow"
                >
                  Preview
                </button>
                <button
                  onClick={handleMainBuildResumeButton}
                  className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-md shadow flex items-center gap-2"
                >
                  <BarChart2 className="w-4 h-4" /> ATS Score
                </button>
              </div>
            </div>
          </div>
        </main>

        {showTemplatePreviewModal && previewTemplateName && (
          <TemplatePreviewModal
            templateComponent={templateComponents[previewTemplateName]}
            templateName={previewTemplateName}
            resumeData={resumeData}
            onClose={() => setShowTemplatePreviewModal(false)}
          />
        )}

        {/* ATS Modal is now controlled by showAtsModal and isLoading */}
        <AtsScoreModal
          atsScore={atsScore}
          strengths={atsStrengths}
          suggestions={atsSuggestions}
          onClose={() => setShowAtsModal(false)}
          isOpen={showAtsModal}
          isLoading={loadingAtsScore} // Pass the loading state
        />
      </div>
    </Layout>
  );
}

export default withAuth(ResumeBuilder, ["admin", "college", "user"]);
