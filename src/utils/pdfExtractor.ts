/**
 * Utility to extract raw text from PDF files using PDF.js in the browser.
 */

export async function extractTextFromPdf(file: File, onProgress?: (percent: number) => void): Promise<string> {
  const pdfjsLib = (window as any).pdfjsLib;
  
  if (!pdfjsLib) {
    throw new Error("PDF parsing engine is not loaded yet. Please wait a moment and try again.");
  }

  // Set up the worker source to avoid worker warning/errors and optimize performance
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

  const fileReader = new FileReader();

  return new Promise<string>((resolve, reject) => {
    fileReader.onload = async () => {
      try {
        const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
        const loadingTask = pdfjsLib.getDocument({ data: typedArray });
        
        loadingTask.onProgress = (progressData: any) => {
          if (progressData && progressData.total > 0 && onProgress) {
            const percent = Math.round((progressData.loaded / progressData.total) * 100);
            onProgress(percent);
          }
        };

        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        let extractedText = "";

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          // Join the items together with space
          const pageItems = textContent.items.map((item: any) => item.str);
          const pageText = pageItems.join(" ");
          
          extractedText += `--- PAGE ${pageNum} ---\n${pageText}\n\n`;

          if (onProgress) {
            // Update progress based on page processing
            const pagePercent = Math.round((pageNum / numPages) * 100);
            onProgress(pagePercent);
          }
        }

        if (!extractedText.trim()) {
          throw new Error("No text content could be extracted from this PDF. It might be scanned or image-only.");
        }

        resolve(extractedText);
      } catch (error: any) {
        reject(new Error(error.message || "Failed to process the PDF document. Please make sure the file is not corrupted."));
      }
    };

    fileReader.onerror = () => {
      reject(new Error("Failed to read the file. Please try again."));
    };

    fileReader.readAsArrayBuffer(file);
  });
}
