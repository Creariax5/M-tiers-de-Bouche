import { designConfig } from '../../config/designConfig';
import Logo from '../../components/ui/Logo';
import Card from '../../components/ui/Card';

/**
 * ConfigurationPage - Démo de la centralisation du design
 * 
 * Cette page montre comment TOUT est centralisé dans designConfig.js
 */
export default function ConfigurationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Configuration Design</h1>
        <p className="text-lg text-neutral-dark">
          Un seul fichier pour tout changer : <code className="bg-neutral-light px-2 py-1 rounded">src/config/designConfig.js</code>
        </p>
      </div>

      {/* Logo & Identité */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">Identité de marque</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-neutral-dark mb-2">Logo (toutes tailles)</p>
            <div className="flex gap-6 items-end flex-wrap">
              <Logo size="sm" />
              <Logo size="md" />
              <Logo size="lg" />
              <Logo size="xl" />
            </div>
          </div>

          <div>
            <p className="text-sm text-neutral-dark mb-2">Variantes</p>
            <div className="flex gap-6 items-center flex-wrap bg-stone-100 p-4 rounded">
              <div className="text-center">
                <Logo size="md" variant="main" />
                <span className="text-xs text-neutral-500">Main</span>
              </div>
              <div className="text-center bg-stone-800 p-2 rounded">
                <Logo size="md" variant="white" />
                <span className="text-xs text-white">White</span>
              </div>
              <div className="text-center">
                <Logo size="md" variant="black" />
                <span className="text-xs text-neutral-500">Black</span>
              </div>
              <div className="text-center">
                <Logo size="md" variant="secondary" />
                <span className="text-xs text-neutral-500">Secondary</span>
              </div>
              <div className="text-center">
                <Logo size="md" variant="tertiary" />
                <span className="text-xs text-neutral-500">Tertiary</span>
              </div>
              <div className="text-center bg-stone-800 p-2 rounded">
                <Logo size="md" variant="monoWhite" />
                <span className="text-xs text-white">Mono White</span>
              </div>
              <div className="text-center">
                <Logo size="md" variant="monoBlack" />
                <span className="text-xs text-neutral-500">Mono Black</span>
              </div>
            </div>
          </div>
          
          <div className="bg-neutral-light p-4 rounded-lg">
            <code className="text-sm">
              designConfig.brand.name = "{designConfig.brand.name}"
            </code>
          </div>
        </div>
      </Card>

      {/* Polices */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">Typographie</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-neutral-dark mb-2">Police principale (titres)</p>
            <p className="text-4xl font-primary">
              {designConfig.fonts.primary.name}
            </p>
            <code className="text-xs bg-neutral-light px-2 py-1 rounded">
              {designConfig.fonts.primary.family}
            </code>
          </div>
          
          <div>
            <p className="text-sm text-neutral-dark mb-2">Police secondaire (texte)</p>
            <p className="text-2xl font-secondary">
              {designConfig.fonts.secondary.name}
            </p>
            <code className="text-xs bg-neutral-light px-2 py-1 rounded">
              {designConfig.fonts.secondary.family}
            </code>
          </div>

          <div className="bg-neutral-light p-4 rounded-lg">
            <p className="text-sm font-semibold mb-2">Pour changer une police :</p>
            <code className="text-xs block">
              1. Modifiez designConfig.fonts.primary.name<br/>
              2. Modifiez designConfig.fonts.primary.family<br/>
              3. Changez l'URL Google Fonts si besoin
            </code>
          </div>
        </div>
      </Card>

      {/* Couleurs */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">Palette de couleurs</h2>
        <div className="space-y-6">
          {/* Primary */}
          <div>
            <p className="text-sm text-neutral-dark mb-2">Couleur principale</p>
            <div className="flex gap-2">
              <div className="flex-1 h-20 bg-primary-light rounded flex items-center justify-center text-white font-semibold">
                Light
              </div>
              <div className="flex-1 h-20 bg-primary rounded flex items-center justify-center text-white font-semibold">
                DEFAULT<br/>{designConfig.colors.primary.DEFAULT}
              </div>
              <div className="flex-1 h-20 bg-primary-dark rounded flex items-center justify-center text-white font-semibold">
                Dark
              </div>
            </div>
          </div>

          {/* Secondary */}
          <div>
            <p className="text-sm text-neutral-dark mb-2">Couleur secondaire</p>
            <div className="flex gap-2">
              <div className="flex-1 h-20 bg-secondary-light rounded flex items-center justify-center text-white font-semibold">
                Light
              </div>
              <div className="flex-1 h-20 bg-secondary rounded flex items-center justify-center text-white font-semibold">
                DEFAULT<br/>{designConfig.colors.secondary.DEFAULT}
              </div>
              <div className="flex-1 h-20 bg-secondary-dark rounded flex items-center justify-center text-white font-semibold">
                Dark
              </div>
            </div>
          </div>

          {/* Accent */}
          <div>
            <p className="text-sm text-neutral-dark mb-2">Couleur d'accent</p>
            <div className="flex gap-2">
              <div className="flex-1 h-20 bg-accent-light rounded flex items-center justify-center text-white font-semibold">
                Light
              </div>
              <div className="flex-1 h-20 bg-accent rounded flex items-center justify-center text-white font-semibold">
                DEFAULT<br/>{designConfig.colors.accent.DEFAULT}
              </div>
              <div className="flex-1 h-20 bg-accent-dark rounded flex items-center justify-center text-white font-semibold">
                Dark
              </div>
            </div>
          </div>

          {/* System */}
          <div>
            <p className="text-sm text-neutral-dark mb-2">Couleurs système</p>
            <div className="grid grid-cols-4 gap-2">
              <div className="h-16 bg-success rounded flex items-center justify-center text-white font-semibold text-sm">
                Success
              </div>
              <div className="h-16 bg-warning rounded flex items-center justify-center text-white font-semibold text-sm">
                Warning
              </div>
              <div className="h-16 bg-error rounded flex items-center justify-center text-white font-semibold text-sm">
                Error
              </div>
              <div className="h-16 bg-info rounded flex items-center justify-center text-white font-semibold text-sm">
                Info
              </div>
            </div>
          </div>

          <div className="bg-neutral-light p-4 rounded-lg">
            <p className="text-sm font-semibold mb-2">Pour changer une couleur :</p>
            <code className="text-xs">
              designConfig.colors.primary.DEFAULT = "#VOTRE_COULEUR"
            </code>
          </div>
        </div>
      </Card>

      {/* Espacements */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">Espacements</h2>
        <div className="space-y-2">
          {Object.entries(designConfig.spacing).map(([key, value]) => (
            <div key={key} className="flex items-center gap-4">
              <span className="w-12 text-sm font-mono">{key}</span>
              <div className="h-8 bg-accent" style={{ width: value }}></div>
              <span className="text-sm text-neutral-dark">{value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Ombres */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">Ombres</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(designConfig.shadows).map(([key, value]) => (
            <div
              key={key}
              className="h-24 bg-white rounded-lg flex items-center justify-center"
              style={{ boxShadow: value }}
            >
              <span className="font-semibold">{key}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Résumé */}
      <Card className="bg-primary text-white">
        <h2 className="text-2xl font-bold mb-4">Résumé</h2>
        <ul className="space-y-2">
          <li>Police → <code>designConfig.fonts</code></li>
          <li>Logo → <code>designConfig.brand</code></li>
          <li>Couleurs → <code>designConfig.colors</code></li>
          <li>Espacements → <code>designConfig.spacing</code></li>
          <li>Bordures → <code>designConfig.borders</code></li>
          <li>Ombres → <code>designConfig.shadows</code></li>
          <li>Animations → <code>designConfig.animations</code></li>
        </ul>
        <div className="mt-6 bg-white/10 p-4 rounded-lg">
          <p className="font-semibold mb-2">Un seul fichier à modifier :</p>
          <code className="text-sm">src/config/designConfig.js</code>
        </div>
      </Card>
    </div>
  );
}
