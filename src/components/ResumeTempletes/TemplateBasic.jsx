import React from "react";
import { parse } from "node-html-parser";

const TemplateBasic = ({ resumeData }) => {
  const {
    personalDetails,
    profileSummary,
    education,
    workExperience,
    keySkills,
    projects,
    websiteSocialMedia,
  } = resumeData;

  // Helper for formatting skills (can be simple comma-separated for basic)
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
              <ul key={index} className="list-disc list-outside ml-5 space-y-1 [&_li>p]:m-0">
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
              <ol key={index} className="list-decimal list-outside ml-5 space-y-1 [&_li>p]:m-0">
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
    <div className="font-sans text-gray-800 p-6 sm:p-8 md:p-10">
      {" "}
      {/* Adjusted padding */}
      {/* Header - Name and Contact Info */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {personalDetails.firstName} {personalDetails.lastName}
        </h1>

        {personalDetails.designation && (
          <p className="text-sm text-gray-700 font-medium mb-1">
            {personalDetails.designation}
          </p>
        )}
        <p className="text-sm text-gray-600">
          {personalDetails.phone && <span>{personalDetails.phone} | </span>}
          {personalDetails.email && (
            <a
              href={`mailto:${personalDetails.email}`}
              className="text-blue-700 hover:underline"
            >
              {personalDetails.email}
            </a>
          )}
          {personalDetails.address && <span> | {personalDetails.address}</span>}
          {(websiteSocialMedia.linkedin ||
            websiteSocialMedia.github ||
            websiteSocialMedia.portfolio) && (
            <>
              {personalDetails.email || personalDetails.address ? " | " : ""}
              {websiteSocialMedia.linkedin && (
                <a
                  href={websiteSocialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline mr-1"
                >
                  LinkedIn
                </a>
              )}
              {websiteSocialMedia.github && (
                <a
                  href={websiteSocialMedia.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline mr-1"
                >
                  GitHub
                </a>
              )}
              {websiteSocialMedia.portfolio && (
                <a
                  href={websiteSocialMedia.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  Portfolio
                </a>
              )}
            </>
          )}
        </p>
      </div>
      {/* Profile Summary */}
      {profileSummary && profileSummary.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-gray-400 pb-1 mb-3">
            SUMMARY
          </h2>
          <div className="text-sm leading-relaxed">
            {renderRichTextContentWithLists(
              Array.isArray(profileSummary) ? profileSummary.join(" ") : profileSummary
            )}
          </div>
        </section>
      )}
      {/* Key Skills */}
      {keySkills && keySkills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-gray-400 pb-1 mb-3">
            SKILLS
          </h2>
          <p className="text-sm leading-relaxed">{formatSkills(keySkills)}</p>
        </section>
      )}
      {/* Work Experience */}
      {workExperience && workExperience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-gray-400 pb-1 mb-3">
            EXPERIENCE
          </h2>
          <div className="space-y-4">
            {workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-semibold text-base text-gray-900">
                    {exp.role}
                  </h3>
                  <p className="text-sm italic text-gray-600">
                    {exp.startDate} – {exp.endDate}
                  </p>
                </div>
                <p className="text-sm text-gray-700 mb-1">
                  {exp.company}
                  {exp.location ? `, ${exp.location}` : ""}
                </p>
                {exp.responsibilities && (
                  hasHtmlList(exp.responsibilities) ? (
                    <div className="text-sm leading-relaxed">
                      {renderRichTextContentWithLists(exp.responsibilities)}
                    </div>
                  ) : (
                    <ul className="list-disc list-outside ml-5 text-sm leading-relaxed space-y-0.5 [&_li>p]:m-0">
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
      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-gray-400 pb-1 mb-3">
            PROJECTS
          </h2>
          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id}>
                <h3 className="font-semibold text-base">
                  {proj.name}
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline text-xs ml-2"
                    >
                      LINK
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
                    <div className="text-sm leading-relaxed">
                      {renderRichTextContentWithLists(proj.description)}
                    </div>
                  ) : (
                    <ul className="list-disc list-outside ml-5 text-sm leading-relaxed space-y-0.5 [&_li>p]:m-0">
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
          {" "}
          {/* Last section, no bottom margin */}
          <h2 className="text-xl font-bold border-b-2 border-gray-400 pb-1 mb-3">
            EDUCATION
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <p className="font-semibold text-base text-gray-900">
                    {edu.university}
                    {edu.location ? `, ${edu.location}` : ""}
                  </p>
                  {(edu.startDate || edu.endDate || edu.year) && (
                    <p className="text-sm italic text-gray-600">
                      {edu.startDate}{" "}
                      {edu.startDate && (edu.endDate || edu.year) ? "–" : ""}{" "}
                      {edu.endDate || edu.year}
                    </p>
                  )}
                </div>
                {edu.degree && (
                  <p className="text-sm text-gray-700">{edu.degree}</p>
                )}
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

export default TemplateBasic;
