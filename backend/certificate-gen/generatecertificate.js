const fs = require("fs");
const { PDFDocument, rgb } = require("pdf-lib");
const fontkit = require("fontkit");
const firebase = require('../certificate-gen/firebase')
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");

const app = firebase;
const storage = getStorage();

const generateCertificatePDF = async (name) => {
  const existingPdfBytes = fs.readFileSync(
    "./template/Dark Blue and Gold Elegant Certificate of Achievement Template (1).pdf"
  );
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Load the downloaded font file
  const fontBytes = fs.readFileSync("./template/FjallaOne-Regular.ttf");

  // Embed the font into the PDF document
  const font = await pdfDoc.embedFont(fontBytes);

  // Calculate the width of the text
  const fontSize = 55; // Adjust the font size as needed
  const nameWidth = font.widthOfTextAtSize(name, fontSize);

  // Calculate the horizontal position for centering the text
  const pageWidth = firstPage.getWidth();
  const horizontalPosition = (pageWidth - nameWidth) / 2;

  // Calculate the vertical position for centering the text
  const pageHeight = firstPage.getHeight();
  const textHeight = fontSize;
  const verticalPosition = (pageHeight - textHeight) / 2;

  // Draw the text on the page
  firstPage.drawText(name, {
    x: horizontalPosition,
    y: verticalPosition + 20, // Adjust vertical position as needed
    size: fontSize,
    color: rgb(0, 0, 0),
    font: font,
  });

  // Save the modified PDF
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync("output.pdf", pdfBytes);
  const pdfRef = ref(storage, `Certs/${name}.pdf`);
  await uploadBytes(pdfRef, pdfBytes);
  const downloadURL = await getDownloadURL(pdfRef);
  console.log(downloadURL)
  

  console.log("PDF generated successfully.");
  return downloadURL;
};


const generateIDPDF = async (name) => {
  const position = "Attendee";
  const existingPdfBytes = fs.readFileSync(
    "./template/White Creative Business Card Template.pdf"
  );
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Load the downloaded font file
  const fontBytes = fs.readFileSync("./template/FjallaOne-Regular.ttf");

  // Embed the font into the PDF document
  const font = await pdfDoc.embedFont(fontBytes);

  // Calculate the width of the text
  const fontSize = 18; // Adjust the font size as needed
  const nameWidth = font.widthOfTextAtSize(name, fontSize);

  // Calculate the horizontal position for centering the text
  const pageWidth = firstPage.getWidth();
  const horizontalPosition = (pageWidth - nameWidth) / 2 - 60;

  // Calculate the vertical position for centering the text
  const pageHeight = firstPage.getHeight();
  const textHeight = fontSize;
  const verticalPosition = (pageHeight - textHeight) / 2;

  // Draw the text on the page
  firstPage.drawText(name, {
    x: horizontalPosition,
    y: verticalPosition + 20, // Adjust vertical position as needed
    size: fontSize,
    color: rgb(0, 0, 0),
    font: font,
  });
  firstPage.drawText(position, {
    x: horizontalPosition,
    y: verticalPosition - 1, // Adjust vertical position as needed
    size: fontSize,
    color: rgb(0, 0, 0.5),
    font: font,
  });

  // Save the modified PDF
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync("output.pdf", pdfBytes);
  const pdfRef = ref(storage, `ID/${name}.pdf`);
  await uploadBytes(pdfRef, pdfBytes);
  const downloadURL = await getDownloadURL(pdfRef);

  console.log("PDF generated successfully.");
  return downloadURL;
};

module.exports = { generateCertificatePDF, generateIDPDF };
