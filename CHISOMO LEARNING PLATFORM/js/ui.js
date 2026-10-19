(function () {
    const $ = (s, root = document) => root.querySelector(s);

    const $$ = (s, root = document) =>
        Array.from(root.querySelectorAll(s));

    function toast(message, type = 'success') {
        let region = $('.toast-region');

        if (!region) {
            region = document.createElement('div');
            region.className = 'toast-region';
            region.setAttribute('aria-live', 'polite');
            region.setAttribute('aria-atomic', 'false');

            document.body.append(region);
        }

        const item = document.createElement('div');
        item.className = 'toast ' + type;
        item.textContent = message;

        region.append(item);

        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(8px)';

            setTimeout(() => item.remove(), 250);
        }, 3500);
    }

    function esc(value = '') {
        return String(value).replace(/[&<>"']/g, c => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[c]));
    }

    function formatDate(date) {
        if (!date) {
            return 'No date';
        }

        const d = new Date(date + 'T12:00:00');

        return Number.isNaN(d.getTime())
            ? date
            : d.toLocaleDateString(undefined, {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
    }

    function today() {
        return new Date().toISOString().slice(0, 10);
    }

    function badge(status) {
        const s = String(status || 'Pending').toLowerCase();

        const cls = [
            'completed',
            'published',
            'submitted',
            'marked'
        ].includes(s)
            ? 'success'
            : [
                'pending',
                'draft',
                'in progress'
            ].includes(s)
                ? 'warning'
                : [
                    'overdue',
                    'rejected'
                ].includes(s)
                    ? 'danger'
                    : 'info';

        return `<span class="badge ${cls}">${esc(status || 'Pending')}</span>`;
    }

    function empty(title, desc) {
        return `<div class="empty-state"><img src="${basePath()}assets/images/empty-books.svg" alt=""><h3>${esc(title)}</h3><p>${esc(desc)}</p></div>`;
    }

    function basePath() {
        return location.pathname.includes('/student/') ||
            location.pathname.includes('/teacher/')
            ? '../'
            : '';
    }

    function confirmAction(message) {
        return window.confirm(message);
    }

    window.SchoolUI = {
        $,
        $$,
        toast,
        esc,
        formatDate,
        today,
        badge,
        empty,
        basePath,
        confirmAction
    };
})();