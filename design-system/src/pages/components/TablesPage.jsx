import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const TablesPage = () => {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-primary text-primary mb-2">Tables</h1>
        <p className="text-secondary font-secondary">Composants pour l'affichage de données tabulaires.</p>
      </div>

      <Card title="Tableau Simple">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Jean Dupont</TableCell>
              <TableCell>Chef Pâtissier</TableCell>
              <TableCell><Badge variant="success">Actif</Badge></TableCell>
              <TableCell className="text-right text-secondary">Modifier</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Marie Martin</TableCell>
              <TableCell>Commis</TableCell>
              <TableCell><Badge variant="warning">En pause</Badge></TableCell>
              <TableCell className="text-right text-secondary">Modifier</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Pierre Durand</TableCell>
              <TableCell>Plongeur</TableCell>
              <TableCell><Badge variant="error">Absent</Badge></TableCell>
              <TableCell className="text-right text-secondary">Modifier</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      <Card title="Tableau Ingrédients (Exemple Métier)">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ingrédient</TableHead>
              <TableHead>Fournisseur</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Prix / Kg</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Farine T55</TableCell>
              <TableCell>Moulins de Paris</TableCell>
              <TableCell>25 kg</TableCell>
              <TableCell>0.85 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Beurre AOP</TableCell>
              <TableCell>Isigny</TableCell>
              <TableCell className="text-red-600 font-bold">2 kg</TableCell>
              <TableCell>8.50 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Sucre Semoule</TableCell>
              <TableCell>Metro</TableCell>
              <TableCell>10 kg</TableCell>
              <TableCell>1.20 €</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default TablesPage;
