import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { z } from 'zod';
import { categoryEnum } from '@/lib/validations/document';

const extractRequestSchema = z.object({
  text: z.string().min(5, 'Text must be at least 5 characters long').max(4000),
});

/**
 * Intelligent regex and heuristic extractor used when AI API key is not configured or as fallback
 */
function heuristicExtract(text: string) {
  const lower = text.toLowerCase();

  // Category detection
  let category: z.infer<typeof categoryEnum> = 'OTHER';
  if (/insurance|policy|coverage|premium/i.test(lower)) {
    category = 'INSURANCE';
  } else if (/passport|visa|national id|aadhaar|social security|ssn|voter|pan card/i.test(lower)) {
    category = 'IDENTITY';
  } else if (/license|licence|driving|driver|vehicle registration|rc|car registration/i.test(lower)) {
    category = /vehicle|car|bike|motor/i.test(lower) ? 'VEHICLE' : 'CERTIFICATION';
  } else if (/certificate|diploma|degree|accreditation|course/i.test(lower)) {
    category = 'CERTIFICATION';
  } else if (/warranty|guarantee/i.test(lower)) {
    category = 'WARRANTY';
  } else if (/subscription|membership|netflix|amazon|gym|spotify/i.test(lower)) {
    category = 'SUBSCRIPTION';
  }

  // Title extraction heuristics
  let title = 'Important Document';
  if (/passport/i.test(lower)) title = 'Passport';
  else if (/car insurance/i.test(lower)) title = 'Car Insurance';
  else if (/health insurance/i.test(lower)) title = 'Health Insurance';
  else if (/driving licen[cs]e/i.test(lower)) title = 'Driving Licence';
  else if (/vehicle registration|rc/i.test(lower)) title = 'Vehicle Registration';
  else if (/home insurance/i.test(lower)) title = 'Home Insurance';
  else {
    const firstLine = text.trim().split('\n')[0].slice(0, 50);
    if (firstLine.length > 3) title = firstLine;
  }

  // Document Number extraction
  const docNumMatch = text.match(/(?:number|no|#|id|policy\s*no\.?)\s*[:=-]?\s*([A-Za-z0-9\-_]{4,25})/i);
  const documentNumber = docNumMatch ? docNumMatch[1] : null;

  // Date parsing helper
  const extractDates = (input: string) => {
    // Matches YYYY-MM-DD, DD/MM/YYYY, or Month DD, YYYY
    const isoDates = input.match(/\b\d{4}-\d{2}-\d{2}\b/g) || [];
    const slashDates = input.match(/\b\d{1,2}[/-]\d{1,2}[/-]\d{4}\b/g) || [];
    const verbalDates = input.match(/\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+\d{4}\b/gi) || [];

    return [...isoDates, ...slashDates, ...verbalDates].map((d) => {
      const parsed = new Date(d);
      return isNaN(parsed.getTime()) ? null : parsed;
    }).filter(Boolean) as Date[];
  };

  const dates = extractDates(text);

  let issueDate: string | null = null;
  let expiryDate: string | null = null;

  if (dates.length >= 2) {
    // Sort chronological: earlier is issueDate, later is expiryDate
    dates.sort((a, b) => a.getTime() - b.getTime());
    issueDate = dates[0].toISOString().split('T')[0];
    expiryDate = dates[dates.length - 1].toISOString().split('T')[0];
  } else if (dates.length === 1) {
    if (/issued|issue|start|bought/i.test(lower)) {
      issueDate = dates[0].toISOString().split('T')[0];
    } else {
      expiryDate = dates[0].toISOString().split('T')[0];
    }
  }

  return {
    title,
    category,
    documentNumber,
    issueDate,
    expiryDate,
    notes: text.trim().slice(0, 300),
  };
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = extractRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide document text to analyze',
        },
        { status: 400 }
      );
    }

    const text = result.data.text;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `You are a structured document data extractor for personal documents.
Extract the document details from the text below and return strictly valid JSON matching this schema:
{
  "title": string (e.g. "Car Insurance", "Passport", max 60 chars),
  "category": one of ["IDENTITY", "INSURANCE", "VEHICLE", "CERTIFICATION", "WARRANTY", "SUBSCRIPTION", "OTHER"],
  "documentNumber": string or null,
  "issueDate": "YYYY-MM-DD" or null,
  "expiryDate": "YYYY-MM-DD" or null,
  "notes": string or null (brief summary, max 200 chars)
}

Text:
"${text.replace(/"/g, '\\"')}"`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json' },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            const parsed = JSON.parse(candidateText);
            return NextResponse.json({
              success: true,
              data: parsed,
            });
          }
        }
      } catch (aiErr) {
        console.warn('Gemini API call failed, falling back to heuristic parser:', aiErr);
      }
    }

    // Heuristic fallback
    const extracted = heuristicExtract(text);

    return NextResponse.json({
      success: true,
      data: extracted,
      message: 'Document details extracted successfully',
    });
  } catch (error) {
    console.error('Error during AI extraction:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process document text' },
      { status: 500 }
    );
  }
}
