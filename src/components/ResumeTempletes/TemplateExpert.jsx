import React from "react";
import { parse } from "node-html-parser";

const TemplateExpert = ({ resumeData }) => {
  const {
    personalDetails,
    profileSummary,
    education,
    workExperience,
    keySkills,
    projects,
    websiteSocialMedia,
  } = resumeData;

  const formatSkills = (skills) => {
    return Array.isArray(skills) && skills.length > 0
      ? skills.map((s) => s.trim()).join(", ")
      : "N/A";
  };

  const renderRichTextContentWithLists = (htmlContent) => {
    if (!htmlContent) return null;
    const root = parse(htmlContent);
    const elements = root.childNodes
      .filter((node) => !(
        node.tagName && node.tagName.toLowerCase() === "p" && node.innerHTML.trim() === ""
      ))
      .map((node, index) => {
        if (node.nodeType === 1) {
          const tagName = node.tagName.toLowerCase();
          if (tagName === "ul") {
            return (
              <ul key={index} className="list-disc list-outside ml-5 space-y-1">
                {node.childNodes
                  .filter((child) => child.tagName && child.tagName.toLowerCase() === "li")
                  .map((li, liIndex) => (
                    <li
                      key={liIndex}
                      dangerouslySetInnerHTML={{ __html: li.innerHTML }}
                    />
                  ))}
              </ul>
            );
          } else if (tagName === "ol") {
            return (
              <ol key={index} className="list-decimal list-outside ml-5 space-y-1">
                {node.childNodes
                  .filter((child) => child.tagName && child.tagName.toLowerCase() === "li")
                  .map((li, liIndex) => (
                    <li
                      key={liIndex}
                      dangerouslySetInnerHTML={{ __html: li.innerHTML }}
                    />
                  ))}
              </ol>
            );
          } else {
            return (
              <div
                key={index}
                dangerouslySetInnerHTML={{ __html: node.outerHTML }}
              />
            );
          }
        } else if (node.nodeType === 3) {
          return <span key={index}>{node.text}</span>;
        }
        return null;
      });
    return elements;
  };

  const hasHtmlList = (s) => typeof s === "string" && /<(ul|ol)[^>]*>/i.test(s);

  return (
    <div className="font-serif text-gray-800 p-8 md:p-10 bg-white">
      {/* Header - Name, Title, and Executive Summary */}
      <div className="mb-8 border-b-2 border-gray-700 pb-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {personalDetails.firstName} {personalDetails.lastName}
        </h1>
        {personalDetails.designation && (
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            {personalDetails.designation}
          </h2>
        )}
        {personalDetails.jobTitle && (
          <h2 className="text-xl font-medium text-gray-700 mb-3">
            {personalDetails.jobTitle}
          </h2>
        )}
        <div className="flex flex-wrap gap-x-4 text-sm text-gray-600">
          {personalDetails.phone && <p>{personalDetails.phone}</p>}
          {personalDetails.email && (
            <p>
              <a
                href={`mailto:${personalDetails.email}`}
                className="text-blue-800 hover:underline"
              >
                {personalDetails.email}
              </a>
            </p>
          )}
          {personalDetails.address && <p>{personalDetails.address}</p>}
          {websiteSocialMedia.linkedin && (
            <p>
              <a
                href={websiteSocialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-800 hover:underline"
              >
                LinkedIn
              </a>
            </p>
          )}
          {websiteSocialMedia.portfolio && (
            <p>
              <a
                href={websiteSocialMedia.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-800 hover:underline"
              >
                Portfolio
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {profileSummary && profileSummary.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            PROFESSIONAL SUMMARY
          </h2>
          <div className="text-base leading-relaxed text-gray-700">
            {renderRichTextContentWithLists(
              Array.isArray(profileSummary) ? profileSummary.join(" ") : profileSummary
            )}
          </div>
        </section>
      )}

      {/* Work Experience - Central and Detailed */}
      {workExperience && workExperience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">EXPERIENCE</h2>
          <div className="space-y-6">
            {workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {exp.role}
                  </h3>
                  <p className="text-sm italic text-gray-600">
                    {exp.startDate} – {exp.endDate}
                  </p>
                </div>
                <p className="text-base font-medium text-gray-700 mb-2">
                  {exp.company}
                  {exp.location ? `, ${exp.location}` : ""}
                </p>
                {exp.responsibilities && (
                  hasHtmlList(exp.responsibilities) ? (
                    <div className="text-base leading-relaxed">
                      {renderRichTextContentWithLists(exp.responsibilities)}
                    </div>
                  ) : (
                    <ul className="list-disc list-outside ml-5 text-base leading-relaxed space-y-1">
                      {exp.responsibilities
                        .split("\n")
                        .filter(Boolean)
                        .map((resp, idx) => (
                          <li
                            key={idx}
                            dangerouslySetInnerHTML={{
                              __html: resp.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                            }}
                          />
                        ))}
                    </ul>
                  )
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Skills */}
      {keySkills && keySkills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            CORE COMPETENCIES
          </h2>
          <p className="text-base leading-relaxed text-gray-700">
            {formatSkills(keySkills)}
          </p>
        </section>
      )}

      {/* Projects (if relevant for expert level) */}
      {projects && projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            SELECT PROJECTS
          </h2>
          <div className="space-y-5">
            {projects.map((proj) => (
              <div key={proj.id}>
                <h3 className="font-semibold text-lg">
                  {proj.name}
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-800 underline text-sm ml-2"
                    >
                      VIEW PROJECT
                    </a>
                  )}
                </h3>
                {proj.technologies && (
                  <p className="italic text-gray-600 text-sm mb-1">
                    Technologies: {proj.technologies}
                  </p>
                )}
                {proj.description && (
                  hasHtmlList(proj.description) ? (
                    <div className="text-base leading-relaxed">
                      {renderRichTextContentWithLists(proj.description)}
                    </div>
                  ) : (
                    <ul className="list-disc list-outside ml-5 text-base leading-relaxed space-y-1">
                      {proj.description
                        .split("\n")
                        .filter(Boolean)
                        .map((desc, idx) => (
                          <li
                            key={idx}
                            dangerouslySetInnerHTML={{
                              __html: desc.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                            }}
                          />
                        ))}
                    </ul>
                  )
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">EDUCATION</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <p className="font-semibold text-base text-gray-900">
                    {edu.degree}
                  </p>
                  {(edu.startDate || edu.endDate || edu.year) && (
                    <p className="text-sm italic text-gray-600">
                      {edu.startDate}{" "}
                      {edu.startDate && (edu.endDate || edu.year) ? "–" : ""}{" "}
                      {edu.endDate || edu.year}
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-700">
                  {edu.university}
                  {edu.location ? `, ${edu.location}` : ""}
                </p>
                {edu.gpa && (
                  <p className="text-sm text-gray-700">GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default TemplateExpert;
