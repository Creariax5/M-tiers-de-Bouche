import puppeteer from 'puppeteer';

export const generatePdf = async (data) => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage' // Important for Docker
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
  });
  
  try {
    const page = await browser.newPage();
    
    // Basic template for now
    const html = `
      <html>
        <body>
          <h1>${data.productName || 'Produit'}</h1>
          <ul>
            ${data.ingredients?.map(i => `<li>${i.name}: ${i.quantity}${i.unit}</li>`).join('') || ''}
          </ul>
        </body>
      </html>
    `;
    
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    return pdfBuffer;
  } finally {
    await browser.close();
  }
};
