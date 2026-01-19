import React from "react";
import { parse } from "node-html-parser";

const TemplateIntermediate = ({ resumeData }) => {
  const {
    personalDetails,
    profileSummary,
    education,
    workExperience,
    keySkills,
    projects,
    websiteSocialMedia,
  } = resumeData;

  // Helper for formatting skills (could be categories or just a list)
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
              <ul key={index} className="list-disc pl-5 space-y-1">
                {node.childNodes
                  .filter((child) => child.tagName && child.tagName.toLowerCase() === "li")
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
                  .filter((child) => child.tagName && child.tagName.toLowerCase() === "li")
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

  const accentColor = "blue-700"; // Define an accent color for consistency

  return (
    <div className="font-sans text-gray-800 flex min-h-full">
      {/* Left Column (Sidebar) */}
      <div
        className={`w-1/3 bg-gray-50 p-6 border-r border-gray-200 flex flex-col justify-between`}
      >
        <div>
          {/* Contact Information */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-1">
              CONTACT
            </h2>
            {personalDetails.designation && (
              <p className="text-sm mb-1 font-medium text-gray-800">
                {personalDetails.designation}
              </p>
            )}
            <p className="text-sm mb-1">{personalDetails.phone}</p>
            <p className="text-sm mb-1">
              <a
                href={`mailto:${personalDetails.email}`}
                className={`text-${accentColor} hover:underline`}
              >
                {personalDetails.email}
              </a>
            </p>
            {personalDetails.address && (
              <p className="text-sm mb-1">{personalDetails.address}</p>
            )}
            {websiteSocialMedia.linkedin && (
              <p className="text-sm">
                <a
                  href={websiteSocialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-${accentColor} hover:underline`}
                >
                  LinkedIn
                </a>
              </p>
            )}
            {websiteSocialMedia.github && (
              <p className="text-sm">
                <a
                  href={websiteSocialMedia.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-${accentColor} hover:underline`}
                >
                  GitHub
                </a>
              </p>
            )}
            {websiteSocialMedia.portfolio && (
              <p className="text-sm">
                <a
                  href={websiteSocialMedia.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-${accentColor} hover:underline`}
                >
                  Portfolio
                </a>
              </p>
            )}
          </div>

          {/* Skills */}
          {keySkills && keySkills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-1">
                SKILLS
              </h2>
              <p className="text-sm leading-relaxed">
                {formatSkills(keySkills)}
              </p>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-1">
                EDUCATION
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="font-semibold text-sm">
                      {edu.university}
                      {edu.location ? `, ${edu.location}` : ""}
                    </p>
                    {edu.degree && <p className="text-sm">{edu.degree}</p>}
                    {(edu.startDate || edu.endDate || edu.year) && (
                      <p className="text-xs italic text-gray-600">
                        {edu.startDate}{" "}
                        {edu.startDate && (edu.endDate || edu.year) ? "–" : ""}{" "}
                        {edu.endDate || edu.year}
                      </p>
                    )}
                    {edu.gpa && (
                      <p className="text-xs text-gray-700">GPA: {edu.gpa}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column (Main Content) */}
      <div className="w-2/3 p-6">
        {/* Name at the top of the main column */}
        <h1 className={`text-4xl font-extrabold text-${accentColor} mb-6`}>
          {personalDetails.firstName} {personalDetails.lastName}
        </h1>

        {/* Profile Summary */}
        {profileSummary && profileSummary.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-400 pb-1">
              SUMMARY
            </h2>
            <div className="text-sm leading-relaxed">
              {renderRichTextContentWithLists(
                Array.isArray(profileSummary) ? profileSummary.join(" ") : profileSummary
              )}
            </div>
          </section>
        )}

        {/* Work Experience */}
        {workExperience && workExperience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-400 pb-1">
              EXPERIENCE
            </h2>
            <div className="space-y-5">
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
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {exp.company}
                    {exp.location ? `, ${exp.location}` : ""}
                  </p>
                  {exp.responsibilities && (
                    hasHtmlList(exp.responsibilities) ? (
                      <div className="text-sm leading-relaxed">
                        {renderRichTextContentWithLists(exp.responsibilities)}
                      </div>
                    ) : (
                      <ul className="list-disc list-inside text-sm leading-relaxed space-y-0.5">
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
          <section className="mb-0">
            <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-400 pb-1">
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
                        className={`text-${accentColor} underline text-xs ml-2`}
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
                      <ul className="list-disc list-inside text-sm leading-relaxed space-y-0.5">
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
      </div>
    </div>
  );
};

export default TemplateIntermediate;
