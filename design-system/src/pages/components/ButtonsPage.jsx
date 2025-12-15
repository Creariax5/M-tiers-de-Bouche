import React from 'react';
import Button from '../../components/ui/Button';

const ButtonsPage = () => {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-primary text-4xl text-primary mb-4">Boutons</h1>
        <p className="text-secondary text-lg">
          Éléments interactifs permettant aux utilisateurs d'effectuer des actions.
        </p>
      </header>

      <section className="space-y-8">
        {/* Primary Buttons */}
        <div className="bg-white p-8 rounded-3xl border border-neutral-light">
          <h2 className="font-primary text-xl text-primary mb-6">Variantes</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary">Primary Action</Button>
            <Button variant="secondary">Secondary Action</Button>
            <Button variant="outline">Outline Action</Button>
            <Button variant="ghost">Ghost Action</Button>
          </div>
          <div className="mt-6 bg-neutral-light p-4 rounded-lg border border-neutral-light">
            <code className="text-xs text-neutral-dark font-mono">
              {`<Button variant="primary">Primary Action</Button>`}
            </code>
          </div>
        </div>

        {/* Sizes */}
        <div className="bg-white p-8 rounded-3xl border border-neutral-light">
          <h2 className="font-primary text-xl text-primary mb-6">Tailles</h2>
          <div className="flex flex-wrap gap-4 items-end">
            <Button size="sm">Small Button</Button>
            <Button size="md">Medium Button</Button>
            <Button size="lg">Large Button</Button>
          </div>
          <div className="mt-6 bg-neutral-light p-4 rounded-lg border border-neutral-light">
            <code className="text-xs text-neutral-dark font-mono">
              {`<Button size="lg">Large Button</Button>`}
            </code>
          </div>
        </div>

        {/* States */}
        <div className="bg-white p-8 rounded-3xl border border-neutral-light">
          <h2 className="font-primary text-xl text-primary mb-6">États</h2>
          <div className="flex flex-wrap gap-4">
            <Button disabled className="opacity-50 cursor-not-allowed">Disabled</Button>
            <Button className="shadow-lg">With Shadow</Button>
            <Button className="w-full md:w-auto">Full Width on Mobile</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ButtonsPage;
