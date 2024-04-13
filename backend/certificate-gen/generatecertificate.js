const fs = require('fs');
const { PDFDocument, rgb } = require("pdf-lib");
const fontkit = require('fontkit');
const {initializeApp} = require("firebase/app");
const {getStorage,ref,uploadBytes,getDownloadURL} = require("firebase/storage");  

const firebaseConfig = {
    apiKey: "AIzaSyDoxIsof993-vbK3aqSsl1HCTSLoSN2RhQ",
    authDomain: "storage-cee65.firebaseapp.com",
    projectId: "storage-cee65",
    storageBucket: "storage-cee65.appspot.com",
    messagingSenderId: "542807162743",
    appId: "1:542807162743:web:9a500ca41c2080a1e9eb72",
    measurementId: "G-HDBML2V7R3"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const storage = getStorage()
// Register fontkit with PDFDocument

const generatePDF = async (name) => {
    const existingPdfBytes = fs.readFileSync("./template/Dark Blue and Gold Elegant Certificate of Achievement Template (1).pdf");
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
    const pdfRef = ref(storage, `${name}.pdf`);
    await uploadBytes(pdfRef, pdfBytes);
    const downloadURL = await getDownloadURL(pdfRef);

    console.log("PDF generated successfully.");
    return (downloadURL);
};

module.exports = generatePDF;
