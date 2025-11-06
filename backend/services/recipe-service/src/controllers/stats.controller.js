import { getUserStats } from '../services/stats.service.js';

export const getStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const stats = await getUserStats(userId);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
