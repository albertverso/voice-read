import React from "react";

export const Footer: React.FC = () => {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} VoiceRead - Conversão de texto em fala acessível
              </p>
              <nav className="flex flex-wrap gap-6">
                <a href="#" className="text-primary hover:underline">Declaração de Acessibilidade</a>
                <a href="#" className="text-primary hover:underline">Política de Privacidade</a>
                <a href="#" className="text-primary hover:underline">Termos de Serviço</a>
                <a href="#" className="text-primary hover:underline">Contato</a>
              </nav>
            </div>
          </div>
        </footer>
    );
}