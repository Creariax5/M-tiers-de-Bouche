# 🐛 BUGS CORRIGÉS - US-017 Frontend Auth

**Date** : 24 octobre 2025  
**Découverte** : Tests manuels utilisateur  
**Cause racine** : ❌ Implémentation sans TDD

---

## 🔴 BUG #1 : Validation "Required" sur tous les champs

### Symptôme
Tous les champs du formulaire Register affichent "Required" même quand ils sont remplis.

### Cause
Les composants `Input` et `Button` n'utilisaient pas `React.forwardRef()`, donc React Hook Form ne pouvait pas accéder aux refs internes pour la validation.

### Code incorrect
```jsx
export function Input({ type = 'text', className = '', error = false, ...props }) {
  return <input type={type} {...props} />;
}
```

### Correction
```jsx
export const Input = React.forwardRef(({ type = 'text', className = '', error = false, ...props }, ref) => {
  return <input ref={ref} type={type} {...props} />;
});

Input.displayName = 'Input';
```

### Tests manquants
Si nous avions écrit des tests TDD :
```javascript
test('Input accepte une ref', () => {
  const ref = React.createRef();
  render(<Input ref={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLInputElement);
});

test('Button accepte une ref', () => {
  const ref = React.createRef();
  render(<Button ref={ref}>Click</Button>);
  expect(ref.current).toBeInstanceOf(HTMLButtonElement);
});
```

**Ces tests auraient échoué immédiatement** et forcé l'implémentation correcte.

---

## 🔴 BUG #2 : 404 Not Found sur "Mot de passe oublié"

### Symptôme
Clic sur "Mot de passe oublié ?" → Erreur 404 avec message non user-friendly :
```
Unexpected Application Error!
404 Not Found
```

### Cause
Route `/forgot-password` non implémentée dans le router.

### Correction
1. Créé `ForgotPasswordPage.jsx`
2. Ajouté route dans `router.jsx`
3. Message user-friendly si erreur backend

### Tests manquants
Si nous avions écrit des tests TDD :
```javascript
test('route /forgot-password existe', () => {
  const { container } = render(
    <RouterProvider router={router} />
  );
  window.history.pushState({}, '', '/forgot-password');
  expect(screen.getByText(/mot de passe oublié/i)).toBeInTheDocument();
});

test('affiche message succès après envoi email', async () => {
  api.post.mockResolvedValue({ data: { success: true } });
  
  render(<ForgotPasswordPage />);
  
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' }
  });
  fireEvent.click(screen.getByRole('button', { name: /envoyer/i }));
  
  expect(await screen.findByText(/email envoyé/i)).toBeInTheDocument();
});
```

---

## 📊 IMPACT

### Bugs trouvés
- **Bug #1** : Bloquant - formulaire inutilisable
- **Bug #2** : Critique - mauvaise UX, perte de confiance

### Temps perdu
- Implémentation initiale : 2h
- Debug bugs : 30 min
- Corrections : 20 min
- Documentation : 15 min
- **Total** : 3h05

### Si TDD avait été appliqué
- Écriture tests : 1h
- Implémentation guidée par tests : 2h
- Bugs : 0 (détectés avant)
- **Total** : 3h
- **Gain** : 5 min + 0 bugs + confiance 100%

---

## ✅ LEÇON APPRISE

### Ce qui aurait dû être fait (TDD)

**Phase RED** (30 min) :
```javascript
// tests/LoginPage.test.jsx
describe('LoginPage', () => {
  test('accepte un email valide', () => { /* ... */ });
  test('rejette un email invalide', () => { /* ... */ });
  test('soumet le formulaire', async () => { /* ... */ });
  test('affiche erreur serveur', async () => { /* ... */ });
});

// Lancer : npm test → 4 tests FAIL ❌
```

**Phase GREEN** (1h30) :
- Implémenter LoginPage.jsx pour faire passer les tests
- Lancer : npm test → 4 tests PASS ✅

**Phase REFACTOR** (30 min) :
- Nettoyer le code
- Extraire composants réutilisables
- Lancer : npm test → 4 tests PASS ✅

### Règle d'or
> **"Si tu n'as pas écrit de test, tu n'as pas terminé."**

---

## 🔧 FICHIERS MODIFIÉS

### Corrections bugs
- `frontend/src/components/ui/Input.jsx` : Ajout `React.forwardRef()`
- `frontend/src/components/ui/Button.jsx` : Ajout `React.forwardRef()`
- `frontend/src/features/auth/ForgotPasswordPage.jsx` : Nouvelle page
- `frontend/src/router.jsx` : Route `/forgot-password` ajoutée

### Documentation
- `docs/IMPORTANT_INSTRUCTIONS.md` : Ajout section "SKIP TDD"

---

## 🎯 PROCHAINES ACTIONS

### US-017 : Compléter avec tests
1. Installer Vitest + React Testing Library
2. Créer tests pour LoginPage
3. Créer tests pour RegisterPage
4. Créer tests pour ForgotPasswordPage
5. Créer tests pour authStore
6. Créer tests pour api.js
7. Atteindre 80% coverage

### US futures
- **TOUJOURS** TDD : RED → GREEN → REFACTOR
- **JAMAIS** d'implémentation sans tests
- Vérifier checklist avant commit

---

**Status** : 🟢 BUGS CORRIGÉS  
**Tests manquants** : 🔴 À créer (US-017-bis)  
**Méthodologie** : ⚠️ TDD obligatoire dès maintenant
