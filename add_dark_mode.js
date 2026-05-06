const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

const replacements = [
  ['bg-slate-50 ', 'bg-slate-50 dark:bg-slate-900 '],
  ['bg-slate-50/', 'bg-slate-50 dark:bg-slate-900/'],
  ['bg-white', 'bg-white dark:bg-slate-800'],
  ['bg-slate-100', 'bg-slate-100 dark:bg-slate-700/50'],
  ['bg-slate-200/50', 'bg-slate-200/50 dark:bg-slate-800/50'],
  ['text-slate-900', 'text-slate-900 dark:text-slate-50'],
  ['text-slate-800', 'text-slate-800 dark:text-slate-200'],
  ['text-slate-500', 'text-slate-500 dark:text-slate-400'],
  ['text-slate-400', 'text-slate-400 dark:text-slate-500'],
  ['text-slate-300', 'text-slate-300 dark:text-slate-600'],
  ['border-slate-200', 'border-slate-200 dark:border-slate-700'],
  ['border-slate-100', 'border-slate-100 dark:border-slate-700/50'],
  ['border-slate-50', 'border-slate-50 dark:border-slate-800'],
  ['shadow-2xl shadow-slate-200', 'shadow-2xl shadow-slate-200 dark:shadow-slate-900'],
  ['bg-slate-800 hover:bg-slate-900 text-white', 'bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white'],
];

// Reemplazos de las etiquetas <button> o fondos especiales
for (const [find, replace] of replacements) {
  content = content.split(find).join(replace);
}

// Add state and icons for dark mode
// 1. Add Moon and Sun to lucide-react imports
if (!content.includes('Moon,')) {
  content = content.replace('Loader2,', 'Loader2,\n  Moon,\n  Sun,');
}

// 2. Add isDarkMode state inside App component
if (!content.includes('isDarkMode')) {
  const stateInjection = `
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
`;
  content = content.replace('const [loadingData, setLoadingData] = useState(true);', 'const [loadingData, setLoadingData] = useState(true);\n' + stateInjection);
}

// 3. Add the toggle button in the header
if (!content.includes('setIsDarkMode')) {
  const buttonHtml = `
             <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm flex items-center justify-center"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
`;
  content = content.replace('<div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-xl shadow-sm">', buttonHtml + '\n             <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-xl shadow-sm">');
}

fs.writeFileSync('src/App.jsx', content, 'utf8');
console.log('App.jsx updated for Dark Mode!');
