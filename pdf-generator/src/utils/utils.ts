import jsPDF from 'jspdf';
import mammoth from 'mammoth';

export const generatePDF = async (imageFiles: any) => {
  const pdf = new jsPDF();
  const imgWidth = 210; // A4 size width in mm
  const imgHeight = 297; // A4 size height in mm

  for (let i = 0; i < imageFiles.length; i++) {
    const imageData: any = await fileToDataURL(imageFiles[i]);

    if (i > 0) pdf.addPage();
    pdf.addImage(imageData, 'JPEG', 10, 10, imgWidth - 20, imgHeight - 20);
  }

  pdf.save('images.pdf');
};

const fileToDataURL = (file: any) => {
  return new Promise((resolve) => {
    const reader: any = new FileReader();
    reader.onload = (e: any) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
};

export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

export const convertDocxToPDF = async (file: any) => {
  const reader = new FileReader();

  reader.onload = async (event: any) => {
    const arrayBuffer = event.target.result;

    // Extract text from DOCX
    const { value: textContent } = await mammoth.extractRawText({
      arrayBuffer,
    });

    // Generate PDF
    const pdf = new jsPDF();
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);

    const marginLeft = 10;
    const marginTop = 10;
    const maxWidth = 190; // A4 width - margins
    const lineHeight = 7; // Spacing between lines

    const lines = pdf.splitTextToSize(textContent, maxWidth);
    let cursorY = marginTop;

    // Add text to PDF
    lines.forEach((line: any) => {
      if (cursorY + lineHeight > 280) {
        pdf.addPage();
        cursorY = marginTop;
      }
      pdf.text(line, marginLeft, cursorY);
      cursorY += lineHeight;
    });

    pdf.save('converted-document.pdf');
  };

  reader.readAsArrayBuffer(file);
};
