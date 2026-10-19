(function () {
    const ui = window.SchoolUI;
    if (!ui) return;

    const { $$, $ } = ui;
    const path = location.pathname;
    const isStudent = path.includes('/student/');
    const root = isStudent ? '../' : '../';

    const toggle = $('.mobile-toggle');
    const sidebar = $('.sidebar');
    const backdrop = $('.menu-backdrop');

    if (toggle && sidebar) {
        toggle.addEventListener('click', () => {
            const open = sidebar.classList.toggle('open');

            toggle.setAttribute('aria-expanded', String(open));

            if (backdrop) {
                backdrop.classList.toggle('show', open);
            }
        });

        if (backdrop) {
            backdrop.addEventListener('click', () => {
                sidebar.classList.remove('open');
                backdrop.classList.remove('show');

                toggle.setAttribute('aria-expanded', 'false');
            });
        }

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                sidebar.classList.remove('open');
                backdrop?.classList.remove('show');

                toggle.setAttribute('aria-expanded', 'false');

                $$('.dropdown-toggle').forEach(b => {
                    b.setAttribute('aria-expanded', 'false');

                    const m = b.nextElementSibling;

                    if (m) {
                        m.hidden = true;
                    }
                });
            }
        });
    }

    $$('.dropdown-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';

            $$('.dropdown-toggle').forEach(other => {
                other.setAttribute('aria-expanded', 'false');

                if (other.nextElementSibling) {
                    other.nextElementSibling.hidden = true;
                }
            });

            btn.setAttribute('aria-expanded', String(!expanded));

            if (btn.nextElementSibling) {
                btn.nextElementSibling.hidden = expanded;
            }
        });
    });

    document.addEventListener('click', e => {
        if (!e.target.closest('.nav-group')) {
            $$('.dropdown-toggle').forEach(b => {
                b.setAttribute('aria-expanded', 'false');

                if (b.nextElementSibling) {
                    b.nextElementSibling.hidden = true;
                }
            });
        }
    });

    const current = path.split('/').pop() || 'dashboard.html';

    $$('.side-nav a').forEach(a => {
        const href = a.getAttribute('href') || '';

        if (href.split('/').pop() === current) {
            a.classList.add('active');

            const menu = a.closest('.dropdown-menu');

            if (menu) {
                menu.hidden = false;

                const parent = menu.previousElementSibling;

                if (parent) {
                    parent.setAttribute('aria-expanded', 'true');
                }
            }
        }
    });

    const date = $('.topbar-date');

    if (date) {
        date.textContent = new Date().toLocaleDateString(undefined, {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
    }

    const name = SchoolStore.getProfile().name;

    if ((document.body.dataset.page || '').startsWith('student')) {
        $$('[data-profile-name]').forEach(el => {
            el.textContent = name;
        });
    }

    const logout = $('[data-logout]');

    if (logout) {
        logout.addEventListener('click', () => {
            sessionStorage.removeItem('chisomoRole');
            location.href = '../index.html';
        });
    }

    const loader = $('.loading-overlay');

    if (loader) {
        const hide = () => {
            loader.hidden = true;
        };

        if (document.readyState === 'complete') {
            hide();
        } else {
            window.addEventListener('load', hide, {
                once: true
            });
        }

        setTimeout(hide, 1800);
    }
})();