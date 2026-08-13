import React from 'react';
import { createRoot } from 'react-dom/client';
import { TestableApp } from '../src/TestableApp';

// Deliberately not wrapped in <StrictMode>, for the reasons documented on TestableApp.
createRoot(document.getElementById('app') as HTMLElement).render(<TestableApp />);
