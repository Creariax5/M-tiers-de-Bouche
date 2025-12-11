import * as pdfService from '../services/pdf.service.js';
import * as storageService from '../services/storage.service.js';

export const generateLabel = async (req, res) => {
  try {
    const pdfBuffer = await pdfService.generatePdf(req.body);
    
    // Sauvegarder dans MinIO si demandé (ou par défaut)
    // On utilise l'ID utilisateur du token
    const userId = req.user?.userId || 'anonymous';
    const fileName = await storageService.uploadLabel(pdfBuffer, userId);
    
    // Si le client demande du JSON (pour avoir l'URL)
    if (req.headers.accept === 'application/json') {
      const url = await storageService.getLabelUrl(fileName);
      return res.json({ 
        success: true, 
        url, 
        fileName 
      });
    }

    // Sinon retourner le PDF directement (comportement actuel)
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
      'Content-Disposition': 'attachment; filename="label.pdf"',
      'X-Label-File-Name': fileName
    });
    
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
  }
};
