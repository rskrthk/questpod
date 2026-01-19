import React from "react";
import { Document, Page, Text, View, StyleSheet, Link as PdfLink } from "@react-pdf/renderer";
import { parse } from "node-html-parser";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    paddingHorizontal: 36,
    paddingVertical: 30,
    fontFamily: "Times-Roman",
    fontSize: 11,
    color: "#333333",
  },
  header: {
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#374151",
    paddingBottom: 8,
  },
  name: {
    fontSize: 26,
    fontFamily: "Times-Bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 12,
    color: "#4b5563",
    marginBottom: 3,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  contactText: {
    fontSize: 10,
    color: "#4b5563",
    marginRight: 10,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Times-Bold",
    color: "#111827",
    marginBottom: 6,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 2,
  },
  bulletLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  descriptionList: {
    marginLeft: 6,
    marginTop: 2,
  },
  bullet: {
    width: 10,
  },
  bold: {
    fontFamily: "Times-Bold",
  },
});

const renderInlineBold = (text) => {
  if (!text) return null;
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return (
    <Text>
      {parts.map((part, idx) => {
        const m = part.match(/^\*\*([^*]+)\*\*$/);
        if (m) return <Text key={idx} style={styles.bold}>{m[1]}</Text>;
        return <Text key={idx}>{part}</Text>;
      })}
    </Text>
  );
};

const renderBulletListFromLines = (value) => {
  if (!value) return null;
  const lines = String(value).split("\n").map((l) => l.trim()).filter(Boolean);
  return (
    <View>
      {lines.map((line, i) => (
        <View key={i} style={styles.bulletLine}>
          <Text style={styles.bullet}>•</Text>
          <View style={{ flex: 1 }}>
            {renderInlineBold(line)}
          </View>
        </View>
      ))}
    </View>
  );
};

const renderHtmlContent = (htmlContent) => {
  if (!htmlContent) return null;
  const root = parse(String(htmlContent).trim());
  const elements = [];

  root.childNodes.forEach((node, index) => {
    if (node.nodeType === 1) {
      const tag = node.tagName.toLowerCase();
      if (tag === "p") {
        elements.push(
          <View key={index} style={{ marginBottom: 2 }}>
            <Text>{renderHtmlContent(node.innerHTML)}</Text>
          </View>
        );
      } else if (tag === "ul") {
        const items = node.childNodes
          .filter((c) => c.tagName && c.tagName.toLowerCase() === "li")
          .map((li, i) => (
            <View key={i} style={styles.bulletLine}>
              <Text style={styles.bullet}>•</Text>
              <Text style={{ flex: 1 }}>{renderHtmlContent(li.innerHTML)}</Text>
            </View>
          ));
        elements.push(
          <View key={index} style={styles.descriptionList}>
            {items}
          </View>
        );
      } else if (tag === "ol") {
        const items = node.childNodes
          .filter((c) => c.tagName && c.tagName.toLowerCase() === "li")
          .map((li, i) => (
            <View key={i} style={styles.bulletLine}>
              <Text style={styles.bullet}>{i + 1}.</Text>
              <Text style={{ flex: 1 }}>{renderHtmlContent(li.innerHTML)}</Text>
            </View>
          ));
        elements.push(
          <View key={index} style={styles.descriptionList}>
            {items}
          </View>
        );
      } else if (tag === "b" || tag === "strong") {
        elements.push(
          <Text key={index} style={styles.bold}>
            {renderHtmlContent(node.innerHTML)}
          </Text>
        );
      } else {
        elements.push(<Text key={index}>{renderHtmlContent(node.innerHTML)}</Text>);
      }
    } else if (node.nodeType === 3) {
      elements.push(node.text);
    }
  });
  return elements;
};

const hasHtml = (value) => /<[^>]+>/.test(String(value));

const TemplateExpertPdf = ({ resumeData }) => {
  const { personalDetails, profileSummary, education, workExperience, keySkills, projects, websiteSocialMedia } = resumeData;

  const skillsText = Array.isArray(keySkills) && keySkills.length > 0 ? keySkills.join(", ") : "N/A";

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalDetails?.firstName} {personalDetails?.lastName}
          </Text>
          {personalDetails?.designation && (
            <Text style={styles.subTitle}>{personalDetails.designation}</Text>
          )}
          {personalDetails?.jobTitle && (
            <Text style={styles.subTitle}>{personalDetails.jobTitle}</Text>
          )}
          <View style={styles.contactRow}>
            {personalDetails?.phone && <Text style={styles.contactText}>{personalDetails.phone}</Text>}
            {personalDetails?.email && (
              <Text style={styles.contactText}>
                <PdfLink src={`mailto:${personalDetails.email}`}>{personalDetails.email}</PdfLink>
              </Text>
            )}
            {personalDetails?.address && <Text style={styles.contactText}>{personalDetails.address}</Text>}
            {websiteSocialMedia?.linkedin && (
              <Text style={styles.contactText}>
                <PdfLink src={websiteSocialMedia.linkedin}>LinkedIn</PdfLink>
              </Text>
            )}
            {websiteSocialMedia?.portfolio && (
              <Text style={styles.contactText}>
                <PdfLink src={websiteSocialMedia.portfolio}>Portfolio</PdfLink>
              </Text>
            )}
          </View>
        </View>

        {profileSummary && profileSummary.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
            <View>{renderHtmlContent(Array.isArray(profileSummary) ? profileSummary.join(" ") : String(profileSummary))}</View>
          </View>
        )}

        {Array.isArray(workExperience) && workExperience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EXPERIENCE</Text>
            {workExperience.map((exp, idx) => (
              <View key={exp.id || idx}>
                <View style={styles.rowBetween}>
                  <Text style={{ fontSize: 12, fontWeight: "bold" }}>{exp.role}</Text>
                  <Text style={{ color: "#6b7280" }}>{exp.startDate} – {exp.endDate}</Text>
                </View>
                <Text style={{ fontSize: 11, color: "#374151", marginBottom: 2 }}>
                  {exp.company}
                  {exp.location ? `, ${exp.location}` : ""}
                </Text>
                {exp.responsibilities && (
                  hasHtml(exp.responsibilities)
                    ? <View>{renderHtmlContent(exp.responsibilities)}</View>
                    : renderBulletListFromLines(exp.responsibilities)
                )}
              </View>
            ))}
          </View>
        )}

        {Array.isArray(keySkills) && keySkills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CORE COMPETENCIES</Text>
            <Text>{skillsText}</Text>
          </View>
        )}

        {Array.isArray(projects) && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SELECT PROJECTS</Text>
            {projects.map((proj, idx) => (
              <View key={proj.id || idx}>
                <View style={{ flexDirection: "row", alignItems: "baseline", flexWrap: "wrap" }}>
                  <Text style={{ fontSize: 12, fontWeight: "bold" }}>{proj.name}</Text>
                  {proj.link && (
                    <PdfLink src={proj.link} style={{ color: "#1e3a8a", textDecoration: "underline", marginLeft: 6 }}>
                      VIEW PROJECT
                    </PdfLink>
                  )}
                </View>
                {proj.technologies && (
                  <Text style={{ fontStyle: "italic", color: "#6b7280", marginBottom: 2 }}>
                    Technologies: {proj.technologies}
                  </Text>
                )}
                {proj.description && (
                  hasHtml(proj.description)
                    ? <View>{renderHtmlContent(proj.description)}</View>
                    : renderBulletListFromLines(proj.description)
                )}
              </View>
            ))}
          </View>
        )}

        {Array.isArray(education) && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EDUCATION</Text>
            {education.map((edu, idx) => (
              <View key={edu.id || idx}>
                <View style={styles.rowBetween}>
                  <Text style={{ fontSize: 11, fontWeight: "bold" }}>{edu.degree}</Text>
                  {(edu.startDate || edu.endDate || edu.year) && (
                    <Text style={{ color: "#6b7280" }}>
                      {edu.startDate}
                      {edu.startDate && (edu.endDate || edu.year) ? " – " : " "}
                      {edu.endDate || edu.year}
                    </Text>
                  )}
                </View>
                <Text style={{ fontSize: 10, color: "#374151" }}>
                  {edu.university}
                  {edu.location ? `, ${edu.location}` : ""}
                </Text>
                {edu.gpa && <Text style={{ fontSize: 10, color: "#374151" }}>GPA: {edu.gpa}</Text>}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default TemplateExpertPdf;
