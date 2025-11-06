document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const themeToggleButton = document.getElementById('theme-toggle');
    const langToggleButton = document.getElementById('lang-toggle');
    const copyrightYearSpan = document.getElementById('copyright-year');
    const htmlElement = document.documentElement;
    const downloadCvLink = document.getElementById('cv-download');
    
    // Elementos para Copiar Email
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailText = document.getElementById('email-text');
    const copyToast = document.getElementById('copy-toast');

    // Variable global para almacenar las traducciones cargadas
    let translations = {};

    // --- FUNCIÓN PARA CAMBIAR IDIOMA ---
    const setLanguage = (lang) => {
        document.querySelectorAll('[data-translate-key]').forEach(element => {
            const key = element.dataset.translateKey;
            // Comprueba que la traducción exista antes de aplicarla
            if (translations[lang] && translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });

        // Lógica para la descarga del CV
        if (lang === 'en') {
            downloadCvLink.href = 'downloads/cv-tomas-english.pdf';
            downloadCvLink.setAttribute('download', 'cv-tomas-english.pdf');
        } else {
            downloadCvLink.href = 'downloads/cv-tomas-spanish.pdf';
            downloadCvLink.setAttribute('download', 'cv-tomas-spanish.pdf');
        }

        // Actualiza los 'title' para accesibilidad (A11y)
        downloadCvLink.title = translations[lang].downloadCvTitle;
        langToggleButton.title = translations[lang].langToggleTitle;
        themeToggleButton.title = translations[lang].themeToggleTitle;
        
        // Traducir título de botón copiar
        if (copyEmailBtn) {
            copyEmailBtn.title = translations[lang].copyEmailTitle;
        }

        // Actualiza los atributos de la página
        htmlElement.setAttribute('lang', lang);
        langToggleButton.textContent = lang === 'en' ? 'ES' : 'EN';
    };
    
    // --- LÓGICA PARA EL CAMBIO DE TEMA ---
    const setTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
    };

    // --- FUNCIÓN DE INICIALIZACIÓN ---
    // Esta función se ejecutará después de cargar las traducciones
    const initializeApp = () => {
        themeToggleButton.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });

        langToggleButton.addEventListener('click', () => {
            const currentLang = htmlElement.getAttribute('lang');
            const newLang = currentLang === 'en' ? 'es' : 'en';
            setLanguage(newLang);
            localStorage.setItem('language', newLang);
        });

        // Lógica para Copiar Email
        if (copyEmailBtn) {
            copyEmailBtn.addEventListener('click', () => {
                const textToCopy = emailText.textContent;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    // Éxito al copiar
                    const currentLang = htmlElement.getAttribute('lang') || 'en';
                    copyToast.textContent = translations[currentLang].copySuccess;
                    copyToast.classList.add('show');
                    
                    // Ocultar el mensaje después de 3 segundos
                    setTimeout(() => {
                        copyToast.classList.remove('show');
                    }, 3000);
                }).catch(err => {
                    console.error('Error al copiar el email: ', err);
                });
            });
        }

        // --- INICIALIZACIÓN AL CARGAR LA PÁGINA ---
        const savedTheme = localStorage.getItem('theme') || 'dark';
        const savedLang = localStorage.getItem('language') || 'en';
        
        setTheme(savedTheme);
        setLanguage(savedLang); // Esto aplica el idioma y las traducciones guardadas

        copyrightYearSpan.textContent = new Date().getFullYear();
    };

    // --- CARGAR TRADUCCIONES Y LUEGO INICIALIZAR LA APP ---
    // Usamos fetch para cargar el archivo JSON de forma asíncrona
    fetch('translations.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            translations = data; // Almacenamos las traducciones en nuestra variable
            initializeApp();    // Ahora que tenemos los datos, iniciamos la app
        })
        .catch(error => {
            console.error("Error loading translations:", error);
            // Si falla, la página aún funcionará, pero solo con el texto HTML por defecto
        });
});
