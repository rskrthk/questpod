/**
 * Converts a data URI to ArrayBuffer
 * @param {string} dataUri - Data URI string
 * @returns {ArrayBuffer} Array buffer of the file
 */
function dataUriToArrayBuffer(dataUri) {
    const base64 = dataUri.split(',')[1];
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * Extracts text from PDF resume using PDF.js
 * @param {string} pdfSource - URL or data URI to the PDF file
 * @returns {Promise<string>} Extracted text content
 */
export async function extractTextFromPDF(pdfSource) {
    try {
        // Dynamically import pdfjs-dist only on client side
        const pdfjsLib = await import('pdfjs-dist');

        // Set worker source
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        let loadingTask;

        // Check if it's a data URI
        if (pdfSource.startsWith('data:')) {
            const arrayBuffer = dataUriToArrayBuffer(pdfSource);
            loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        } else {
            loadingTask = pdfjsLib.getDocument(pdfSource);
        }

        const pdf = await loadingTask.promise;

        let fullText = '';

        // Extract text from all pages
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }

        return fullText.trim();
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        throw new Error('Failed to parse PDF resume');
    }
}

/**
 * Extracts text from DOCX resume
 * @param {string} docxSource - URL or data URI to the DOCX file
 * @returns {Promise<string>} Extracted text content
 */
export async function extractTextFromDOCX(docxSource) {
    try {
        const mammoth = await import('mammoth');

        let arrayBuffer;

        // Check if it's a data URI
        if (docxSource.startsWith('data:')) {
            arrayBuffer = dataUriToArrayBuffer(docxSource);
        } else {
            // Fetch the DOCX file
            const response = await fetch(docxSource);
            arrayBuffer = await response.arrayBuffer();
        }

        // Extract text using mammoth
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value.trim();
    } catch (error) {
        console.error('Error extracting text from DOCX:', error);
        throw new Error('Failed to parse DOCX resume');
    }
}

/**
 * Main function to extract text from resume based on file type
 * @param {string} resumeSource - URL or data URI to the resume file
 * @param {string} fileName - Original filename (optional, used for extension detection)
 * @returns {Promise<string>} Extracted text content
 */
export async function extractResumeText(resumeSource, fileName = '') {
    // Detect file type from fileName or data URI
    let fileExtension = '';

    if (fileName) {
        // Extract extension from filename
        fileExtension = fileName.split('.').pop().toLowerCase();
    } else if (resumeSource.startsWith('data:')) {
        // Extract MIME type from data URI
        const mimeType = resumeSource.split(';')[0].split(':')[1];
        if (mimeType === 'application/pdf') {
            fileExtension = 'pdf';
        } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            fileExtension = 'docx';
        } else if (mimeType === 'application/msword') {
            fileExtension = 'doc';
        }
    } else {
        // Extract from URL
        fileExtension = resumeSource.split('.').pop().toLowerCase().split('?')[0];
    }

    console.log('Detected file extension:', fileExtension, 'from:', fileName || resumeSource.substring(0, 50));

    if (fileExtension === 'pdf') {
        return await extractTextFromPDF(resumeSource);
    } else if (fileExtension === 'docx' || fileExtension === 'doc') {
        return await extractTextFromDOCX(resumeSource);
    } else {
        throw new Error(`Unsupported file format: ${fileExtension}. Only PDF and DOCX are supported.`);
    }
}
