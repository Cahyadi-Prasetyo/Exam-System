/**
 * Document Parser Utility
 * Extracts questions from PDF and DOC/DOCX files
 */

export interface ParsedQuestion {
    text: string;
    type: "multiple_choice" | "essay";
    options: string[];
    correctAnswer: number;
    subject?: string;
    topic?: string;
    difficulty?: "easy" | "medium" | "hard";
}

export interface ParseResult {
    success: boolean;
    questions: ParsedQuestion[];
    errors: string[];
    rawText?: string;
}

/**
 * Parse questions from extracted text
 * Expected format:
 * 1. Question text here?
 *    A. Option 1
 *    B. Option 2 ✓ (or * or (benar))
 *    C. Option 3
 *    D. Option 4
 * 
 * 2. Essay question here?
 *    [Esai]
 */
export function parseQuestionsFromText(text: string): ParseResult {
    const questions: ParsedQuestion[] = [];
    const errors: string[] = [];

    // Normalize line endings
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Pattern to match numbered questions
    // Matches: "1." or "1)" at start of line, followed by question text
    // Using [\s\S] instead of . with 's' flag for broader compatibility
    const questionPattern = /^(\d+)[.\)]\s*([\s\S]+?)(?=\n\d+[.\)]|\n*$)/gm;

    // Find all questions
    const matches = normalizedText.matchAll(questionPattern);

    for (const match of matches) {
        try {
            const questionNumber = parseInt(match[1]);
            const questionContent = match[2].trim();

            // Check if it's an essay question
            const isEssay = /\[esai\]|\[essay\]/i.test(questionContent) ||
                !(/^\s*[A-D][.\)]/mi.test(questionContent));

            if (isEssay) {
                // Essay question
                const questionText = questionContent
                    .replace(/\[esai\]|\[essay\]/gi, '')
                    .trim();

                questions.push({
                    text: questionText,
                    type: "essay",
                    options: [],
                    correctAnswer: -1,
                });
            } else {
                // Multiple choice question
                // Split into question text and options
                const lines = questionContent.split('\n');
                let questionText = '';
                const options: string[] = [];
                let correctAnswer = 0;

                for (const line of lines) {
                    const trimmedLine = line.trim();

                    // Check if line is an option (A. B. C. D. or A) B) C) D))
                    const optionMatch = trimmedLine.match(/^([A-D])[.\)]\s*(.+)/i);

                    if (optionMatch) {
                        const optionLetter = optionMatch[1].toUpperCase();
                        let optionText = optionMatch[2].trim();
                        const optionIndex = optionLetter.charCodeAt(0) - 65; // A=0, B=1, etc.

                        // Check for correct answer markers
                        const isCorrect = /[✓✔*★]|\(benar\)|\(correct\)|\[benar\]|\[correct\]/i.test(optionText);

                        if (isCorrect) {
                            correctAnswer = optionIndex;
                            // Remove the marker from option text
                            optionText = optionText
                                .replace(/[✓✔*★]/g, '')
                                .replace(/\(benar\)|\(correct\)|\[benar\]|\[correct\]/gi, '')
                                .trim();
                        }

                        options[optionIndex] = optionText;
                    } else if (trimmedLine) {
                        // Part of question text
                        questionText += (questionText ? ' ' : '') + trimmedLine;
                    }
                }

                // Ensure we have 4 options, fill missing with empty
                while (options.length < 4) {
                    options.push('');
                }

                if (questionText) {
                    questions.push({
                        text: questionText,
                        type: "multiple_choice",
                        options: options.slice(0, 4),
                        correctAnswer,
                    });
                }
            }
        } catch (e) {
            errors.push(`Error parsing question: ${e}`);
        }
    }

    // If no questions found with the pattern, try simpler parsing
    if (questions.length === 0) {
        // Try to find questions by looking for numbered lines
        const simplePattern = /^(\d+)[.\)]\s*(.+)/gm;
        const simpleMatches = [...normalizedText.matchAll(simplePattern)];

        for (const match of simpleMatches) {
            const questionText = match[2].trim();
            if (questionText.length > 10) { // Only if reasonable length
                questions.push({
                    text: questionText,
                    type: "essay", // Default to essay if can't parse options
                    options: [],
                    correctAnswer: -1,
                });
            }
        }

        if (questions.length === 0) {
            errors.push("Tidak dapat menemukan format soal yang valid. Pastikan soal diberi nomor (1. atau 1))");
        }
    }

    return {
        success: questions.length > 0,
        questions,
        errors,
        rawText: normalizedText,
    };
}

/**
 * Parse PDF file and extract questions
 */
export async function parsePDF(file: File): Promise<ParseResult> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Dynamic import for pdf-parse (only works server-side)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pdfParseModule = await import('pdf-parse') as any;
        const pdfParse = pdfParseModule.default || pdfParseModule;
        const data = await pdfParse(buffer);

        return parseQuestionsFromText(data.text);
    } catch (error) {
        return {
            success: false,
            questions: [],
            errors: [`Gagal parsing PDF: ${error}`],
        };
    }
}

/**
 * Parse DOC/DOCX file and extract questions
 */
export async function parseDOCX(file: File): Promise<ParseResult> {
    try {
        const arrayBuffer = await file.arrayBuffer();

        // Dynamic import for mammoth
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ arrayBuffer });

        return parseQuestionsFromText(result.value);
    } catch (error) {
        return {
            success: false,
            questions: [],
            errors: [`Gagal parsing DOC/DOCX: ${error}`],
        };
    }
}

/**
 * Main parser function - detects file type and parses accordingly
 */
export async function parseDocument(file: File): Promise<ParseResult> {
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.pdf')) {
        return parsePDF(file);
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
        return parseDOCX(file);
    } else if (fileName.endsWith('.txt')) {
        // Plain text file
        const text = await file.text();
        return parseQuestionsFromText(text);
    } else {
        return {
            success: false,
            questions: [],
            errors: ['Format file tidak didukung. Gunakan PDF, DOC, DOCX, atau TXT.'],
        };
    }
}
