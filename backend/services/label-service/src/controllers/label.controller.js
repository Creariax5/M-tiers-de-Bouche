import * as pdfService from '../services/pdf.service.js';

export const generateLabel = async (req, res) => {
  try {
    const pdfBuffer = await pdfService.generatePdf(req.body);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
      'Content-Disposition': 'attachment; filename="label.pdf"'
    });
    
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
  }
};
