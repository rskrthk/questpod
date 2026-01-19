import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, Link as PdfLink } from "@react-pdf/renderer";
import { parse } from "node-html-parser";

Font.register({
  family: "Inter",
  fonts: [
    { src: "/fonts/Inter_18pt-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/Inter_24pt-Bold.ttf", fontWeight: "bold" },
    { src: "/fonts/Inter_24pt-Italic.ttf", fontStyle: "italic" },
    { src: "/fonts/Inter_24pt-SemiBold.ttf", fontStyle: "semibold" },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    paddingHorizontal: 36,
    paddingVertical: 30,
    fontFamily: "Inter",
    fontSize: 10,
    color: "#333333",
  },
  header: {
    textAlign: "center",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  contactLine: {
    fontSize: 10,
    color: "#4b5563",
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "#9ca3af",
    paddingBottom: 3,
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
    fontWeight: "bold",
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

const TemplateBasicPdf = ({ resumeData }) => {
  const { personalDetails, profileSummary, education, workExperience, keySkills, projects, websiteSocialMedia } = resumeData;

  const skillsText = Array.isArray(keySkills) && keySkills.length > 0 ? keySkills.join(", ") : "N/A";

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalDetails?.firstName} {personalDetails?.lastName}
          </Text>
          <Text style={styles.contactLine}>
            {personalDetails?.phone && <Text>{personalDetails.phone}</Text>}
            {personalDetails?.email && (
              <Text>
                {personalDetails?.phone ? " | " : ""}
                <PdfLink src={`mailto:${personalDetails.email}`}>{personalDetails.email}</PdfLink>
              </Text>
            )}
            {personalDetails?.address && (
              <Text>
                {(personalDetails?.phone || personalDetails?.email) ? " | " : ""}
                {personalDetails.address}
              </Text>
            )}
            {websiteSocialMedia?.linkedin && (
              <Text>
                {(personalDetails?.phone || personalDetails?.email || personalDetails?.address) ? " | " : ""}
                <PdfLink src={websiteSocialMedia.linkedin}>LinkedIn</PdfLink>
              </Text>
            )}
            {websiteSocialMedia?.github && (
              <Text>
                {(websiteSocialMedia?.linkedin || personalDetails?.phone || personalDetails?.email || personalDetails?.address) ? " | " : ""}
                <PdfLink src={websiteSocialMedia.github}>GitHub</PdfLink>
              </Text>
            )}
            {websiteSocialMedia?.portfolio && (
              <Text>
                {(websiteSocialMedia?.github || websiteSocialMedia?.linkedin || personalDetails?.phone || personalDetails?.email || personalDetails?.address) ? " | " : ""}
                <PdfLink src={websiteSocialMedia.portfolio}>Portfolio</PdfLink>
              </Text>
            )}
          </Text>
        </View>

        {profileSummary && profileSummary.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SUMMARY</Text>
            <View>{renderHtmlContent(Array.isArray(profileSummary) ? profileSummary.join(" ") : String(profileSummary))}</View>
          </View>
        )}

        {Array.isArray(keySkills) && keySkills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SKILLS</Text>
            <Text>{skillsText}</Text>
          </View>
        )}

        {Array.isArray(workExperience) && workExperience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EXPERIENCE</Text>
            {workExperience.map((exp, idx) => (
              <View key={exp.id || idx}>
                <View style={styles.rowBetween}>
                  <Text style={{ fontSize: 11, fontWeight: "bold" }}>{exp.role}</Text>
                  <Text style={{ color: "#6b7280" }}>{exp.startDate} – {exp.endDate}</Text>
                </View>
                <Text style={{ fontSize: 10, color: "#374151", marginBottom: 2 }}>
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

        {Array.isArray(projects) && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROJECTS</Text>
            {projects.map((proj, idx) => (
              <View key={proj.id || idx}>
                <View style={{ flexDirection: "row", alignItems: "baseline", flexWrap: "wrap" }}>
                  <Text style={{ fontSize: 11, fontWeight: "bold" }}>{proj.name}</Text>
                  {proj.link && (
                    <PdfLink src={proj.link} style={{ color: "#1d4ed8", textDecoration: "underline", marginLeft: 6 }}>
                      LINK
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
                  <Text style={{ fontSize: 11, fontWeight: "bold" }}>
                    {edu.university}
                    {edu.location ? `, ${edu.location}` : ""}
                  </Text>
                  {(edu.startDate || edu.endDate || edu.year) && (
                    <Text style={{ color: "#6b7280" }}>
                      {edu.startDate}
                      {edu.startDate && (edu.endDate || edu.year) ? " – " : " "}
                      {edu.endDate || edu.year}
                    </Text>
                  )}
                </View>
                {edu.degree && <Text>{edu.degree}</Text>}
                {edu.gpa && <Text>GPA: {edu.gpa}</Text>}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default TemplateBasicPdf;
