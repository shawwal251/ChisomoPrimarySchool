document.addEventListener('DOMContentLoaded', () => { 
    const loader = document.querySelector('.loading-overlay'); 
    const hide = () => { if (loader) loader.hidden = true }; 
        if (document.readyState === 'complete') hide(); 
            else window.addEventListener('load', hide, { once: true }); 
            
    setTimeout(hide, 1500); 
    
    document.querySelectorAll('[data-role]').forEach(a => a.addEventListener('click', () => sessionStorage.setItem('chisomoRole', a.dataset.role))); });