import mammoth from "mammoth";

import * as pdfjsLib from "pdfjs-dist";

// PDF Worker
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  pdfWorker;


// Read DOCX
export async function readDocx(file) {

  const arrayBuffer =
    await file.arrayBuffer();

  const result =
    await mammoth.extractRawText({
      arrayBuffer,
    });

  return result.value;
}


// Read PDF
export async function readPdf(file) {

  const arrayBuffer =
    await file.arrayBuffer();

  const pdf =
    await pdfjsLib.getDocument({
      data: arrayBuffer,
    }).promise;

  let extractedText = "";

  for (
    let pageNum = 1;
    pageNum <= pdf.numPages;
    pageNum++
  ) {

    const page =
      await pdf.getPage(pageNum);

    const content =
      await page.getTextContent();

    const pageText =
      content.items
        .map((item) => {

          if ("str" in item) {
            return item.str;
          }

          return "";

        })
        .join(" ");

    extractedText +=
      pageText + " ";
  }

  return extractedText;
}