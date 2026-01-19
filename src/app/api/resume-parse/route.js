import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check if file is PDF or DOCX
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.toLowerCase().endsWith('.docx');
    
    if (!isPdf && !isDocx) {
      return NextResponse.json(
        { error: 'Only PDF and DOCX files are supported' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const uint8Array = new Uint8Array(bytes);

    // Determine file type and extract text accordingly
    let extractedText;
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.docx')) {
      extractedText = await extractTextFromDocx(uint8Array);
    } else if (fileName.endsWith('.pdf')) {
      extractedText = await extractTextFromPDF(uint8Array);
    } else {
      throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
    }

    // Extract structured data from the text
    const parsedData = extractResumeData(extractedText);

    const resumeData = {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadedAt: new Date().toISOString(),
      extractedText: extractedText,
      parsedData: parsedData
    };

    return NextResponse.json({
      success: true,
      data: resumeData
    });

  } catch (error) {
    console.error('Error processing resume:', error);
    return NextResponse.json(
      { error: 'Failed to process resume' },
      { status: 500 }
    );
  }
}

async function extractTextFromDocx(uint8Array) {
  try {
    // Convert uint8Array to buffer for mammoth
    const buffer = Buffer.from(uint8Array);
    
    // Extract text from DOCX using mammoth
    const result = await mammoth.extractRawText({ buffer });
    
    if (result.value && result.value.trim()) {
      return result.value.trim();
    } else {
      return `Word document received (${uint8Array.length} bytes). Please describe your background, skills, and experience during the interview as the automatic text extraction found no readable content.`;
    }
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    // Return a fallback message instead of throwing an error
    return `Word document received (${uint8Array.length} bytes). Please describe your background, skills, and experience during the interview as the automatic text extraction encountered an issue.`;
  }
}

async function extractTextFromPDF(uint8Array) {
  try {
    // For now, we'll use a simple approach that extracts basic text
    // In a production environment, you might want to use a more robust PDF parsing library
    
    // Convert uint8Array to string and try to extract readable text
    const buffer = Buffer.from(uint8Array);
    const pdfString = buffer.toString('binary');
    
    // Simple regex to extract text between stream objects
    const textMatches = pdfString.match(/stream\s*(.*?)\s*endstream/gs);
    let extractedText = '';
    
    if (textMatches) {
      textMatches.forEach(match => {
        // Remove stream markers and try to extract readable text
        const content = match.replace(/stream\s*|\s*endstream/g, '');
        // Extract readable ASCII characters
        const readableText = content.replace(/[^\x20-\x7E\n\r]/g, ' ');
        extractedText += readableText + ' ';
      });
    }
    
    // If no text found through stream extraction, try a different approach
    if (!extractedText.trim()) {
      // Look for text objects in PDF
      const textObjects = pdfString.match(/\((.*?)\)/g);
      if (textObjects) {
        extractedText = textObjects
          .map(obj => obj.replace(/[()]/g, ''))
          .filter(text => text.length > 1)
          .join(' ');
      }
    }
    
    // If still no text, provide a fallback
    if (!extractedText.trim()) {
      extractedText = `Resume content extracted from ${buffer.length} byte PDF file. 
      
      Skills: Please manually specify your skills during the interview.
      Experience: Please describe your work experience.
      Education: Please mention your educational background.
      
      Note: For better text extraction, please ensure your PDF contains selectable text.`;
    }
    
    return extractedText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    // Return a fallback message instead of throwing an error
    return `PDF file received (${uint8Array.length} bytes). Please describe your background, skills, and experience during the interview as the automatic text extraction encountered an issue.`;
  }
}

function extractResumeData(text) {
  // Clean and normalize the text
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  // Extract basic information using regex patterns
  const emailMatch = cleanText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  const phoneMatch = cleanText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  
  // Extract name (usually the first line or prominent text)
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const nameMatch = lines[0] && lines[0].trim().length < 50 ? lines[0].trim() : 'Name not found';
  
  // Extract skills - look for skills section
  const skills = extractSkills(cleanText);
  
  // Extract experience
  const experience = extractExperience(cleanText);
  
  // Extract education
  const education = extractEducation(cleanText);

  return {
    name: nameMatch,
    email: emailMatch ? emailMatch[0] : 'Email not found',
    phone: phoneMatch ? phoneMatch[0] : 'Phone not found',
    skills: skills,
    experience: experience,
    education: education
  };
}

function extractSkills(text) {
  const skills = [];
  
  // Look for skills section
  const skillsSection = text.match(/(?:skills?|technologies?|technical skills?|core competencies?)[:\s]+(.*?)(?:\n\n|\n[A-Z]|$)/i);
  
  if (skillsSection) {
    const skillsText = skillsSection[1];
    
    // Common programming languages and technologies
    const techSkills = [
      'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift',
      'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
      'HTML', 'CSS', 'SASS', 'SCSS', 'Bootstrap', 'Tailwind',
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'Jenkins',
      'Machine Learning', 'AI', 'Data Science', 'TensorFlow', 'PyTorch'
    ];
    
    // Find skills that actually appear in the skills section
    techSkills.forEach(skill => {
      if (skillsText.toLowerCase().includes(skill.toLowerCase())) {
        skills.push(skill);
      }
    });
    
    // Also extract any comma-separated or bullet-pointed skills
    const extractedSkills = skillsText.match(/[A-Za-z][A-Za-z0-9+#.\s-]+/g);
    if (extractedSkills) {
      extractedSkills.forEach(skill => {
        const cleanSkill = skill.trim();
        if (cleanSkill.length > 2 && cleanSkill.length < 30 && !skills.includes(cleanSkill)) {
          skills.push(cleanSkill);
        }
      });
    }
  }
  
  return skills.slice(0, 10); // Limit to 10 skills
}

function extractExperience(text) {
  const experience = [];
  
  // Look for experience section
  const expSection = text.match(/(?:experience|work experience|employment)[:\s]+(.*?)(?:\n\n[A-Z]|education|skills|$)/is);
  
  if (expSection) {
    const expText = expSection[1];
    
    // Try to extract company and position information
    const companyMatches = expText.match(/([A-Za-z\s&.,]+)\s*[-–—]\s*([A-Za-z\s]+)/g);
    
    if (companyMatches) {
      companyMatches.slice(0, 3).forEach(match => {
        const parts = match.split(/[-–—]/);
        if (parts.length >= 2) {
          experience.push({
            company: parts[0].trim(),
            position: parts[1].trim(),
            duration: 'Duration not specified'
          });
        }
      });
    }
  }
  
  return experience;
}

function extractEducation(text) {
  const education = [];
  
  // Look for education section
  const eduSection = text.match(/(?:education|academic background)[:\s]+(.*?)(?:\n\n[A-Z]|experience|skills|$)/is);
  
  if (eduSection) {
    const eduText = eduSection[1];
    
    // Common degree patterns
    const degreeMatches = eduText.match(/(bachelor|master|phd|doctorate|diploma|certificate).*?(?:in|of)\s+([A-Za-z\s]+)/gi);
    
    if (degreeMatches) {
      degreeMatches.slice(0, 3).forEach(match => {
        education.push({
          degree: match.trim(),
          institution: 'Institution not specified',
          year: 'Year not specified'
        });
      });
    }
  }
  
  return education;
}