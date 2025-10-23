# 🎨 DESIGN SYSTEM & CODE GUIDELINES
## SaaS Métiers de Bouche

---

## 🎯 PHILOSOPHIE

> **"Code minimal, maintenable et direct. Aller à l'essentiel."**

### Principes
1. **KISS** - Simplicité avant tout
2. **DRY** - Pas de duplication
3. **YAGNI** - Ne pas sur-anticiper
4. **Code qui va droit au but** - Pas de sur-ingénierie
5. **🐳 Docker uniquement** - JAMAIS d'installations locales (npm install, etc.)

---

## 💻 CODE GUIDELINES

### 📏 Règles essentielles

**Fichiers** : < 200 lignes, 1 responsabilité  
**Fonctions** : < 30 lignes, 1 seule tâche  
**Nommage** : Explicite (pas d'abbréviations)  
**Commentaires** : AUCUN (le code doit être lisible sans)  
**Exceptions** : Uniquement pour logique métier complexe (ex: réglementations INCO)

```typescript
// ✅ Code minimal et direct
const getActiveRecipes = (recipes: Recipe[]) => 
  recipes.filter(r => !r.deletedAt);

const isProfitable = (recipe: Recipe) => 
  recipe.sellingPrice > recipe.costPrice;

// ❌ Trop verbeux
const processRecipes = (recipes: Recipe[]) => {
  // 50 lignes...
};
```

---

### 🏗️ STRUCTURE

```
backend/services/recipe-service/src/
├── controllers/     # Routes
├── services/        # Logique métier
├── validators/      # Schémas Zod
└── types/           # Types TS

frontend/src/
├── features/        # Par fonctionnalité
│   └── recipes/
│       ├── components/
│       ├── hooks/
│       └── api/
├── components/ui/   # shadcn/ui
└── lib/             # Utils
```

### 📝 EXEMPLE

```typescript
// ✅ Essentiel uniquement
export const detectAllergens = async (recipeId: string) => {
  const ingredients = await getRecipeIngredients(recipeId);
  return ingredients.flatMap(i => i.allergens || []);
};

export const RecipeCard = ({ recipe, onEdit, onDelete }) => (
  <Card className="p-4">
    <RecipeInfo recipe={recipe} />
    <RecipeActions id={recipe.id} onEdit={onEdit} onDelete={onDelete} />
  </Card>
);
```

---

## 🎨 DESIGN SYSTEM

### Couleurs
```css
--primary: #2563eb;      /* Bleu */
--success: #10b981;      /* Vert */
--error: #ef4444;        /* Rouge */
--border: #e2e8f0;       /* Bordure */
```

### Typographie
```css
--font: Inter, system-ui, sans-serif;
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-xl: 1.25rem;      /* 20px */
```

### Espacements
```css
/* Système 4px */
--space-2: 0.5rem;   /* 8px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
```

### UI
- **shadcn/ui** : Composants prêts à l'emploi
- **TailwindCSS** : Styling utilitaire
- **Mobile first** : Responsive par défaut

---

## 🧪 POLITIQUE DE TESTS

### Stratégie
**Tests simples et efficaces - pas de sur-ingénierie**

```javascript
// ✅ BON : Tests de validateurs (pas de mocks)
test('email invalide rejeté', () => {
  const result = registerSchema.safeParse({ email: 'bad' });
  expect(result.success).toBe(false);
});

// ✅ BON : Tests d'intégration API (vraie DB)
test('POST /register crée un utilisateur', async () => {
  const res = await request(app)
    .post('/register')
    .send({ email: 'test@example.com', password: '123456' });
  expect(res.status).toBe(201);
});

// ❌ ÉVITER : Mocks complexes ESM (instables)
jest.mock('../lib/prisma.js'); // Difficile en ESM
```

### Règles
1. **Validateurs** : Toujours testés (Zod, logique pure)
2. **API** : Tests d'intégration avec vraie DB
3. **Calculs métier** : Tests unitaires (allergènes, nutrition, coûts)
4. **Pas de mocks** : Sauf si vraiment nécessaire
5. **CI/CD** : Tests automatiques via GitHub Actions

### Objectifs
- ✅ Coverage backend : > 60% (pragmatique)
- ✅ Validateurs : 100%
- ✅ Endpoints critiques : testés
- ✅ Calculs métier : testés

---

## ✅ CHECKLIST

### Avant commit
- [ ] Fichiers < 200 lignes
- [ ] Fonctions < 30 lignes
- [ ] Pas de commentaires (sauf réglementations)
- [ ] Validation Zod partout
- [ ] Pas de `any` TypeScript
- [ ] 🧪 Tests passent : `npm test`
- [ ] 🐳 Aucun `node_modules/` ou `package-lock.json` local committé

### 🐳 Règle Docker
**TOUJOURS utiliser Docker** :
```bash
# ✅ Bon
docker-compose up -d
docker-compose build

# ❌ Interdit
npm install
npm run dev
```

### shadcn/ui
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input form table toast
```

---

**TL;DR** : Code minimal qui va droit au but. Pas de sur-ingénierie.
