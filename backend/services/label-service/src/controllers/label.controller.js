import * as pdfService from '../services/pdf.service.js';
import * as storageService from '../services/storage.service.js';
import * as labelService from '../services/label.service.js';

export const previewLabel = async (req, res) => {
  try {
    const html = pdfService.generateHtml(req.body);
    res.send(html);
  } catch (error) {
    console.error('Preview Error:', error);
    res.status(500).json({ error: 'Failed to generate preview', details: error.message });
  }
};

export const generateLabel = async (req, res) => {
  try {
    const pdfBuffer = await pdfService.generatePdf(req.body);
    
    // Sauvegarder dans MinIO si demandé (ou par défaut)
    // On utilise l'ID utilisateur du token (converti en String pour Prisma)
    const userId = req.user?.userId ? String(req.user.userId) : 'anonymous';
    const fileName = await storageService.uploadLabel(pdfBuffer, userId);
    
    // Sauvegarder les métadonnées en base de données
    if (userId !== 'anonymous') {
      await labelService.createLabel({
        userId,
        productName: req.body.productName || 'Produit sans nom',
        fileName,
        format: req.body.format || 'A4',
        template: req.body.template || 'default'
      });
    }
    
    // Si le client demande du JSON (pour avoir le fileName)
    if (req.headers.accept === 'application/json') {
      console.log('📄 [GENERATE] Retour JSON avec fileName:', fileName);
      return res.json({ 
        success: true, 
        fileName 
      });
    }

    // Sinon retourner le PDF directement (comportement actuel)
    console.log('📄 [GENERATE] Retour PDF direct');
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
      'Content-Disposition': 'inline; filename="label.pdf"',
      'X-Label-File-Name': fileName
    });
    
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const labels = await labelService.getLabelsByUser(userId);
    
    // Ajouter les URLs signées pour chaque label
    const labelsWithUrls = await Promise.all(labels.map(async (label) => {
      const url = await storageService.getLabelUrl(label.fileName);
      return { ...label, url };
    }));
    
    res.json(labelsWithUrls);
  } catch (error) {
    console.error('History Error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

export const viewLabel = async (req, res) => {
  try {
    const fileName = req.params.fileName;
    console.log('📄 [VIEW] Demande de visualisation:', fileName);
    console.log('📄 [VIEW] User:', req.user.userId);
    
    // Récupérer le PDF depuis MinIO
    const pdfBuffer = await storageService.downloadLabel(fileName);
    console.log('📄 [VIEW] PDF récupéré, taille:', pdfBuffer.length, 'bytes');
    
    // Retourner le PDF avec Content-Disposition: inline
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
      'Content-Disposition': 'inline; filename="label.pdf"',
      'Cache-Control': 'no-cache'
    });
    
    console.log('📄 [VIEW] Headers envoyés, envoi du buffer...');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('📄 [VIEW] Erreur:', error);
    res.status(500).json({ error: 'Failed to view PDF', details: error.message });
  }
};
