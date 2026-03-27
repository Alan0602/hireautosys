import { NextResponse } from "next/server";
import PDFParser from "pdf2json";

// Force Node.js runtime — pdf2json requires native Node APIs
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No resume file provided." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const text = await new Promise<string>((resolve, reject) => {
      const pdfParser = new PDFParser(null, true); // true = raw text mode

      pdfParser.on("pdfParser_dataReady", () => {
        const rawText = pdfParser.getRawTextContent();
        resolve(rawText);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdfParser.on("pdfParser_dataError", (errData: any) => {
        reject(new Error(String(errData?.parserError || errData)));
      });

      pdfParser.parseBuffer(buffer);
    });

    return NextResponse.json({ text: text.substring(0, 6000) });
  } catch (err) {
    console.error("PDF parse error:", err);
    return NextResponse.json({ error: "Failed to parse resume." }, { status: 500 });
  }
}
