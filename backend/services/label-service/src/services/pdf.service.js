import puppeteer from 'puppeteer';
import { defaultTemplate } from '../templates/default.template.js';
import { classicTemplate } from '../templates/classic.template.js';
import { modernTemplate } from '../templates/modern.template.js';
import { minimalistTemplate } from '../templates/minimalist.template.js';

const templates = {
  default: defaultTemplate,
  classic: classicTemplate,
  modern: modernTemplate,
  minimalist: minimalistTemplate
};

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
    
    // Sélectionner le template (défaut si non trouvé)
    const templateName = data.template || 'default';
    const templateFn = templates[templateName] || defaultTemplate;
    
    const html = templateFn(data);
    
    await page.setContent(html);
    
    // Format étiquette (ex: 100x150mm ou A4)
    // Pour l'instant on reste sur A4 ou format personnalisé si fourni
    const pdfBuffer = await page.pdf({ 
      format: data.format || 'A4',
      printBackground: true
    });
    
    return pdfBuffer;
  } finally {
    await browser.close();
  }
};

