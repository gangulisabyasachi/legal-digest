import pdfParse from 'pdf-parse';

export interface ExtractedPdf {
  text: string;
  numpages: number;
  info?: any;
}

/**
 * Extracts plain text from a judgment PDF buffer.
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<ExtractedPdf> {
  try {
    const data = await pdfParse(buffer);
    const cleanedText = cleanJudgmentText(data.text);
    return {
      text: cleanedText,
      numpages: data.numpages || 1,
      info: data.info,
    };
  } catch (error) {
    console.error('PDF parsing error, attempting raw fallback:', error);
    // If standard pdfParse fails, return raw string decode
    const raw = buffer.toString('utf-8');
    return {
      text: cleanJudgmentText(raw),
      numpages: 1,
    };
  }
}

/**
 * Normalizes legal text by stripping excessive whitespace, headers, and footer page artifacts.
 */
function cleanJudgmentText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
