// jest.config.js
module.exports = {
    preset: 'next/jest', // Utilise le preset Next.js pour Jest
    testEnvironment: 'jsdom', // Utiliser l'environnement de test jsdom (simule un navigateur)
    transform: {
      '^.+\\.(js|ts|jsx|tsx)$': 'babel-jest', // Utilise babel pour transformer les fichiers JS/TS
    },
    setupFilesAfterEnv: [
      '@testing-library/jest-dom/extend-expect', // Ajoute des matchers supplémentaires pour le DOM
    ],
    moduleDirectories: ['node_modules', '<rootDir>/'], // Permet à Jest de résoudre les modules comme dans Next.js
    testPathIgnorePatterns: ['/node_modules/', '/.next/'], // Ignore les dossiers node_modules et .next lors des tests
  };
  