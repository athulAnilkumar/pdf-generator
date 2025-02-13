import jsPDF from 'jspdf';

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
