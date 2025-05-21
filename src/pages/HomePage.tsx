import React from 'react';
import { TabContent } from '../components/TabContent';

export const HomePage: React.FC = () => {
    return(
        <main id="main" className="pb-16">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
              Converter texto em fala
            </h1>
            <p className="text-xl text-center max-w-3xl mx-auto mb-2 text-gray-600 dark:text-gray-300">
              Uma ferramenta acessível de conversão de texto em voz, projetada para pessoas com dificuldade de leitura ou deficiência visual.
              Insira texto, carregue imagens ou extraia de URLs e ouça a leitura em voz alta..
            </p>
          </div>
          
          <TabContent />
        </main>
    )
}