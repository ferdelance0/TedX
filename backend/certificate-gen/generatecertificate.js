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
const qr = require('qrcode');
const app = firebase;
const storage = getStorage();
async function generateQRCode(text) {
  try {
    // Generate QR code as a data URL
    const qrDataUrl = await qr.toDataURL(text);
    return qrDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
}
const generateCertificatePDF = async (eventId,name) => {
  const existingPdfBytes = fs.readFileSync(
    `./uploads/${eventId}/${eventId}.pdf`
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



const generateIDPDF = async (name, participantId) => {
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

  // Set a constant horizontal position
  const horizontalPosition = 100; // Adjust as needed

  // Calculate the vertical position for centering the text
  const pageHeight = firstPage.getHeight();
  const fontSize = 18; // Adjust the font size as needed
  const textHeight = fontSize;
  const verticalPosition = (pageHeight - textHeight) / 2;

  // Draw the text on the page
  firstPage.drawText(name, {
    x: 20,
    y: verticalPosition + 20, // Adjust vertical position as needed
    size: fontSize,
    color: rgb(0, 0, 0),
    font: font,
  });
  firstPage.drawText(position, {
    x: 20,
    y: verticalPosition - 1, // Adjust vertical position as needed
    size: fontSize,
    color: rgb(0, 0, 0.5),
    font: font,
  });

  // Generate QR code
  const qrCode = await generateQRCode(participantId); // Function to generate QR code

  // Embed QR code into PDF
  const qrImage = await pdfDoc.embedPng(qrCode);
  firstPage.drawImage(qrImage, {
    x: horizontalPosition + 30, // Adjust position as needed
    y: verticalPosition - 50, // Adjust position as needed
    width: 50,
    height: 50,
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
