// app/api/generate-word/route.js
import { NextResponse } from 'next/server';
import * as fs from 'node:fs'; // Node.js File System module
import * as path from 'node:path'; // Node.js Path module
import Docxtemplater from 'docxtemplater'; // Library for DOCX generation
import PizZip from 'pizzip'; // Required by docxtemplater for ZIP file handling

// Helper function to format dates consistently with the frontend
const formatDate = (dateString) => {
  if (!dateString || dateString.toLowerCase() === "present") return "Present";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original if invalid date
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

/**
 * Handles POST requests to generate a Word document from resume data.
 * This is a Next.js App Router API route.
 */
export async function POST(req) {
  try {
    // Parse the JSON request body to get resumeData and templateName
    const { resumeData, templateName } = await req.json();

    // Basic validation: ensure resume data is provided
    if (!resumeData) {
      return NextResponse.json({ message: 'No resume data provided.' }, { status: 400 });
    }

    // --- CRUCIAL DEBUGGING LINES ---
    // Log the current working directory. This is the base path Next.js uses.
    console.log(`[DEBUG] Current Working Directory: ${process.cwd()}`);

    // Construct the absolute path to your DOCX template file.
    // This path assumes 'src' is directly under the project root, and 'templates' is under 'src'.
    const templatePath = path.join(process.cwd(), 'src', 'templates', 'resume-template.docx');

    // Log the full path being attempted for template loading
    console.log(`[DEBUG] Attempting to load template from: ${templatePath}`);
    // --- END DEBUGGING LINES ---

    // Check if the template file actually exists at the constructed path
    if (!fs.existsSync(templatePath)) {
      console.error(`[ERROR] Template file not found at: ${templatePath}`);
      return NextResponse.json({ message: 'Resume template not found on the server.' }, { status: 500 });
    }

    // Read the DOCX template file content as a binary buffer
    const content = fs.readFileSync(templatePath, 'binary');

    // Initialize PizZip to handle the DOCX (which is a ZIP archive)
    const zip = new PizZip(content);

    // Initialize Docxtemplater with the ZIP content
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true, // Enables looping over paragraphs for array data
      linebreaks: true,    // Converts newline characters (\n) in data to line breaks in Word
    });

    // Prepare the data to be injected into the template.
    // This step transforms the frontend resumeData structure to match the DOCX template's placeholders.
    const transformedData = {
      personalDetails: resumeData.personalDetails || {},
      profileSummary: resumeData.profileSummary || [],
      // Map and format education items
      education: resumeData.education.map(edu => ({
        ...edu,
        year: edu.year ? formatDate(edu.year) : '' // Format year if it's a date string
      })) || [],
      // Map and format work experience items
      workExperience: resumeData.workExperience.map(exp => ({
        ...exp,
        startDate: formatDate(exp.startDate),
        endDate: formatDate(exp.endDate || "Present"),
        // Join various description fields into a single string with line breaks
        description: [
          exp.domain && `Domain: ${exp.domain}`,
          exp.goal && `Goal: ${exp.goal}`,
          exp.responsibilities && `Responsibilities: ${exp.responsibilities}`,
          exp.technologyFrameworks && `Technologies: ${exp.technologyFrameworks}`,
          exp.featuresImplemented && `Features: ${exp.featuresImplemented}`,
          exp.databaseUsed && `Database: ${exp.databaseUsed}`,
          exp.developmentTool && `Tools: ${exp.developmentTool}`,
          exp.platforms && `Platforms: ${exp.platforms}`,
          exp.description,
        ].filter(Boolean).join('\n') // Filter out falsy values before joining
      })) || [],
      keySkills: resumeData.keySkills || [], // Keep as array for bullet points in template
      // Map and format project items
      projects: resumeData.projects.map(proj => ({
        ...proj,
        startDate: formatDate(proj.startDate),
        endDate: formatDate(proj.endDate || "Present"),
        description: [
            proj.domain && `Domain: ${proj.domain}`,
            proj.goal && `Goal: ${proj.goal}`,
            proj.responsibilities && `Responsibilities: ${proj.responsibilities}`,
            proj.technologyFrameworks && `Technologies: ${proj.technologyFrameworks}`,
            proj.featuresImplemented && `Features: ${proj.featuresImplemented}`,
            proj.databaseUsed && `Database: ${proj.databaseUsed}`,
            proj.developmentTool && `Tools: ${proj.developmentTool}`,
            proj.platforms && `Platforms: ${proj.platforms}`,
            proj.description,
        ].filter(Boolean).join('\n')
      })) || [],
      internships: resumeData.internships.map(intern => ({
        ...intern,
        startDate: formatDate(intern.startDate),
        endDate: formatDate(intern.endDate || "Present"),
        description: [
            intern.domain && `Domain: ${intern.domain}`,
            intern.goal && `Goal: ${intern.goal}`,
            intern.responsibilities && `Responsibilities: ${intern.responsibilities}`,
            intern.technologyFrameworks && `Technologies: ${intern.technologyFrameworks}`,
            intern.featuresImplemented && `Features: ${intern.featuresImplemented}`,
            intern.databaseUsed && `Database: ${intern.databaseUsed}`,
            intern.developmentTool && `Tools: ${intern.developmentTool}`,
            intern.platforms && `Platforms: ${intern.platforms}`,
            intern.description,
        ].filter(Boolean).join('\n')
      })) || [],
      // Map and format certifications
      certifications: resumeData.certifications.map(cert => ({
        ...cert,
        date: cert.date ? formatDate(cert.date) : ''
      })) || [],
      languages: resumeData.languages || [],
      websiteSocialMedia: resumeData.websiteSocialMedia || {},
      hobbies: resumeData.hobbies || [],
      extraCurricularActivities: resumeData.extraCurricularActivities || [],
      awards: resumeData.awards || [],
      volunteering: resumeData.volunteering || [],
      publications: resumeData.publications || [],
      customContent: resumeData.customContent || {},
    };

    // Set the transformed data to the Docxtemplater instance
    doc.setData(transformedData);

    // Render the document (populate placeholders)
    doc.render();

    // Generate the final DOCX file content as a Node.js Buffer
    const buf = doc.getZip().generate({
      type: 'nodebuffer', // Output as a Node.js Buffer
      compression: 'DEFLATE', // Compression algorithm
    });

    // Set HTTP headers for the response to indicate a file download
    const headers = new Headers();
    headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'); // MIME type for .docx
    headers.set('Content-Disposition', `attachment; filename="${templateName || 'resume'}.docx"`); // Suggests filename for download

    // Return the generated buffer as a Next.js response
    return new NextResponse(buf, { headers });

  } catch (error) {
    // Comprehensive error handling for debugging
    console.error('Error generating Word document:', error);

    let errorMessage = 'Failed to generate Word document.';
    // If it's a docxtemplater specific error, extract its explanation
    if (error.properties && error.properties.explanation) {
      errorMessage += ` Explanation: ${error.properties.explanation}`;
    } else if (error.message) {
      // Fallback to general error message
      errorMessage += ` Error: ${error.message}`;
    }

    // Return a JSON error response
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
