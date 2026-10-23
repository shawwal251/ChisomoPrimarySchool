(function () {
    const ui = window.SchoolUI;
    if (!ui) return;

    const {
        $,
        $$,
        esc,
        toast,
        formatDate,
        badge,
        empty,
        confirmAction
    } = ui;

    const store = window.SchoolStore;
    const page = document.body.dataset.page || '';

    const subjects = [
        'Mathematics',
        'English',
        'Chichewa',
        'Science',
        'Social Studies',
        'Creative Arts'
    ];

    document.querySelectorAll('[data-filter-subject]').forEach(sel => {
        const first = sel.querySelector('option')?.outerHTML
            || '<option value="">All subjects</option>';

        sel.innerHTML = first
            + subjects.map(s => `<option value="${s}">${s}</option>`).join('');
    });

    function setText(sel, val) {
        const el = $(sel);
        if (el) el.textContent = val;
    }

    function renderStudentDashboard() {
        const p = store.getProfile(),
            lessons = store.list('lessons'),
            assignments = store.list('assignments'),
            attempts = store.list('attempts'),
            completed = lessons.filter(l => l.completed).length,
            pending = assignments.filter(a =>
                !store.list('submissions').some(
                    s => s.assignmentId === a.id && s.studentName === p.name
                )
            ).length,
            avg = attempts.length
                ? Math.round(
                    attempts.reduce((a, b) => a + b.percentage, 0)
                    / attempts.length
                )
                : 0;

        setText('[data-metric="subjects"]', subjects.length);
        setText('[data-metric="lessons"]', completed);
        setText('[data-metric="assignments"]', pending);
        setText(
            '[data-metric="average"]',
            attempts.length ? avg + '%' : '—'
        );

        const lp = $('[data-lesson-list]');

        if (lp) {
            lp.innerHTML = lessons
                .filter(l => l.status === 'Published')
                .slice(0, 3)
                .map(l => `
                    <article class="subject-card">
                        <div class="avatar">
                            ${l.subject === 'Mathematics'
                                ? '+'
                                : l.subject === 'Science'
                                    ? 'L'
                                    : 'R'}
                        </div>

                        <div style="flex:1">
                            <div class="between wrap">
                                <h3>${esc(l.title)}</h3>
                                ${badge(
                                    l.completed
                                        ? 'Completed'
                                        : 'Ready to learn'
                                )}
                            </div>

                            <p>
                                ${esc(l.subject)} · ${l.duration || 20} min
                            </p>

                            <a
                                class="btn btn-light btn-small"
                                href="lesson-details.html?id=${encodeURIComponent(l.id)}"
                            >
                                Open lesson →
                            </a>
                        </div>
                    </article>
                `)
                .join('')
                || empty(
                    'No lessons yet',
                    'Your teacher will add lessons here.'
                );
        }

        const ap = $('[data-upcoming-list]');

        if (ap) {
            ap.innerHTML = assignments
                .slice(0, 3)
                .map(a => `
                    <div class="activity-item">
                        <div class="avatar gold">A</div>

                        <div style="flex:1">
                            <p>
                                <strong>${esc(a.title)}</strong>
                            </p>

                            <small>
                                ${esc(a.subject)} · Due ${formatDate(a.dueDate)}
                            </small>
                        </div>

                        ${badge(
                            new Date(a.dueDate + 'T23:59:59') < new Date()
                                ? 'Overdue'
                                : 'Pending'
                        )}
                    </div>
                `)
                .join('');
        }
    }

    function renderLessons() {
        const container = $('[data-lessons-grid]');
        if (!container) return;

        const q = ($('[data-search]')?.value || '').toLowerCase();
        const subject = $('[data-filter-subject]')?.value || '';

        const items = store.list('lessons').filter(
            l => l.status === 'Published'
                && (`${l.title} ${l.subject} ${l.content}`)
                    .toLowerCase()
                    .includes(q)
                && (!subject || l.subject === subject)
        );

        container.innerHTML = items.length
            ? items.map(l => `
                <article class="panel">
                    <div class="between">
                        <div class="avatar">
                            ${l.subject === 'Mathematics'
                                ? '+'
                                : l.subject === 'Science'
                                    ? 'L'
                                    : 'R'}
                        </div>

                        ${badge(
                            l.completed ? 'Completed' : 'Available'
                        )}
                    </div>

                    <p class="eyebrow" style="margin-top:1rem">
                        ${esc(l.subject)} · ${l.duration || 20} min
                    </p>

                    <h2 style="margin:.3rem 0">
                        ${esc(l.title)}
                    </h2>

                    <p class="muted small">
                        ${esc(l.objectives || l.content).slice(0, 120)}
                        ${(l.objectives || l.content).length > 120 ? '…' : ''}
                    </p>

                    <a
                        class="btn btn-primary"
                        style="margin-top:1rem"
                        href="lesson-details.html?id=${encodeURIComponent(l.id)}"
                    >
                        ${l.completed ? 'Review lesson' : 'Start learning'} →
                    </a>
                </article>
            `).join('')
            : empty(
                'No matching lessons',
                'Try another search or subject filter.'
            );
    }

    function renderLessonDetails() {
        const el = $('[data-lesson-detail]');
        if (!el) return;

        const id = new URLSearchParams(location.search).get('id');
        const l = store.find('lessons', id) || store.list('lessons')[0];

        if (!l) {
            el.innerHTML = empty(
                'Lesson not found',
                'Return to the lessons page to choose another lesson.'
            );
            return;
        }

        document.title = l.title + ' | Chisomo Learning';

        el.innerHTML = `
            <div class="between wrap">
                <div>
                    <p class="eyebrow">
                        ${esc(l.subject)} · ${l.duration || 20} minutes
                    </p>

                    <h1 class="page-title">
                        ${esc(l.title)}
                    </h1>

                    <p class="page-subtitle">
                        ${esc(l.className || 'Primary school')}
                    </p>
                </div>

                ${badge(l.completed ? 'Completed' : 'In progress')}
            </div>

            <section class="panel stack">
                <div>
                    <h2>Learning objectives</h2>

                    <p class="muted" style="margin-top:.4rem">
                        ${esc(
                            l.objectives
                            || 'Understand the key ideas in this lesson.'
                        )}
                    </p>
                </div>

                <hr class="divider">

                <div>
                    <h2>Let's learn</h2>

                    <p style="margin-top:.6rem;line-height:1.9;white-space:pre-line">
                        ${esc(l.content)}
                    </p>
                </div>

                <div class="notice">
                    ! <strong>Remember:</strong>
                    Read the lesson carefully, then explain one thing you
                    learned in your own words.
                </div>

                <div class="form-actions">
                    <a class="btn btn-light" href="lessons.html">
                        ← All lessons
                    </a>

                    <button
                        class="btn btn-primary"
                        data-complete-lesson="${esc(l.id)}"
                    >
                        ${l.completed
                            ? 'Mark as not completed'
                            : 'Mark lesson complete ✓'}
                    </button>
                </div>
            </section>

            <section class="panel">
                <h2>Check your understanding</h2>

                <p class="muted" style="margin:.4rem 0 1rem">
                    Try a short quiz related to your learning.
                </p>

                <a class="btn btn-gold" href="quizzes.html">
                    Explore quizzes →
                </a>
            </section>
        `;

        const btn = $('[data-complete-lesson]');

        btn?.addEventListener('click', () => {
            store.update('lessons', l.id, {
                completed: !l.completed
            });

            toast(
                l.completed
                    ? 'Lesson marked incomplete.'
                    : 'Great work! Lesson completed.'
            );

            renderLessonDetails();
        });
    }

    function renderAssignments() {
        const el = $('[data-assignment-list]');
        if (!el) return;

        const p = store.getProfile();
        const q = ($('[data-search]')?.value || '').toLowerCase();
        const submissions = store.list('submissions');

        const items = store.list('assignments').filter(
            a => a.status === 'Published'
                && (`${a.title} ${a.subject}`).toLowerCase().includes(q)
        );

        el.innerHTML = items.length
            ? items.map(a => {
                const sub = submissions.find(
                    s => s.assignmentId === a.id
                        && s.studentName === p.name
                );

                const overdue = !sub
                    && new Date(a.dueDate + 'T23:59:59') < new Date();

                return `
                    <article class="panel stack">
                        <div class="between wrap">
                            <div>
                                <p class="eyebrow">
                                    ${esc(a.subject)}
                                </p>

                                <h2 style="font-size:1.1rem;margin:.25rem 0">
                                    ${esc(a.title)}
                                </h2>
                            </div>

                            ${badge(
                                sub
                                    ? 'Submitted'
                                    : overdue
                                        ? 'Overdue'
                                        : 'Pending'
                            )}
                        </div>

                        <p class="muted">
                            ${esc(a.instructions)}
                        </p>

                        <div class="between wrap small">
                            <span>
                                Due ${formatDate(a.dueDate)}
                            </span>

                            <span>
                                ${a.totalMarks} marks
                            </span>
                        </div>

                        ${sub
                            ? `
                                <div class="notice success">
                                    Submitted on ${formatDate(sub.submittedAt)}.
                                    ${sub.feedback
                                        ? `Teacher feedback: ${esc(sub.feedback)}`
                                        : 'Your work is saved in this demo.'}
                                </div>
                            `
                            : `
                                <form
                                    data-submit-assignment="${esc(a.id)}"
                                    class="stack"
                                >
                                    <div class="field">
                                        <label for="response-${esc(a.id)}">
                                            Your answer
                                        </label>

                                        <textarea
                                            id="response-${esc(a.id)}"
                                            name="response"
                                            required
                                            minlength="10"
                                            placeholder="Write your answer here…"
                                        ></textarea>
                                    </div>

                                    <button
                                        class="btn btn-primary"
                                        type="submit"
                                    >
                                        Submit assignment
                                    </button>
                                </form>
                            `}
                    </article>
                `;
            }).join('')
            : empty(
                'No assignments found',
                'There are no matching assignments right now.'
            );

        $$('[data-submit-assignment]').forEach(form => {
            form.addEventListener('submit', e => {
                e.preventDefault();

                const response = new FormData(form)
                    .get('response')
                    .trim();

                if (response.length < 10) {
                    toast(
                        'Please write a little more before submitting.',
                        'error'
                    );
                    return;
                }

                const a = store.find(
                    'assignments',
                    form.dataset.submitAssignment
                );

                store.add('submissions', {
                    assignmentId: a.id,
                    assignmentTitle: a.title,
                    studentName: p.name,
                    response,
                    submittedAt: ui.today(),
                    status: 'Submitted',
                    mark: null,
                    feedback: ''
                });

                toast('Assignment submitted successfully.');
                renderAssignments();
            });
        });
    }

    function renderQuizzes() {
        const el = $('[data-quiz-list]');
        if (!el) return;

        const attempts = store.list('attempts');

        const items = store.list('quizzes').filter(
            q => q.status === 'Published'
        );

        el.innerHTML = items.map(q => {
            const done = attempts.filter(
                a => a.quizId === q.id
                    && a.studentName === store.getProfile().name
            );

            return `
                <article class="panel stack">
                    <div class="between">
                        <div class="avatar purple">Q</div>

                        ${badge(done.length ? 'Attempted' : 'Ready')}
                    </div>

                    <p class="eyebrow">
                        ${esc(q.subject)}
                    </p>

                    <h2 style="font-size:1.1rem">
                        ${esc(q.title)}
                    </h2>

                    <p class="muted small">
                        ${q.questions.length} questions ·
                        ${q.questions.length * 2}–${q.questions.length * 3}
                        minutes
                    </p>

                    <div class="between wrap">
                        <span class="small muted">
                            ${done.length
                                ? `Best score: ${Math.max(
                                    ...done.map(d => d.percentage)
                                )}%`
                                : 'Test what you know'}
                        </span>

                        <a
                            class="btn btn-primary btn-small"
                            href="quiz.html?id=${encodeURIComponent(q.id)}"
                        >
                            ${done.length ? 'Try again' : 'Start quiz'} →
                        </a>
                    </div>
                </article>
            `;
        }).join('')
            || empty(
                'No quizzes available',
                'Your teacher has not published a quiz yet.'
            );
    }

    function renderQuiz() {
        const el = $('[data-quiz-container]');
        if (!el) return;

        const id = new URLSearchParams(location.search).get('id');
        const quiz = store.find('quizzes', id) || store.list('quizzes')[0];

        if (!quiz) {
            el.innerHTML = empty(
                'Quiz unavailable',
                'Return to quizzes and choose another activity.'
            );
            return;
        }

        let current = 0;
        const answers = {};

        function draw() {
            const q = quiz.questions[current];

            el.innerHTML = `
                <div class="between wrap">
                    <div>
                        <p class="eyebrow">
                            ${esc(quiz.subject)} · Question ${current + 1}
                            of ${quiz.questions.length}
                        </p>

                        <h1 class="page-title">
                            ${esc(quiz.title)}
                        </h1>
                    </div>

                    <span class="badge info">
                        ${Math.round(
                            (current / quiz.questions.length) * 100
                        )}% complete
                    </span>
                </div>

                <div class="progress">
                    <span style="width:${
                        ((current + 1) / quiz.questions.length) * 100
                    }%"></span>
                </div>

                <form data-answer-form class="question-card stack">
                    <h2 style="font-size:1.2rem">
                        ${esc(q.q)}
                    </h2>

                    <div class="stack">
                        ${q.options.map((o, i) => `
                            <label class="quiz-option">
                                <input
                                    type="radio"
                                    name="answer"
                                    value="${i}"
                                    ${answers[current] === i ? 'checked' : ''}
                                    required
                                >

                                <span>${esc(o)}</span>
                            </label>
                        `).join('')}
                    </div>

                    <div class="between wrap">
                        <button
                            type="button"
                            class="btn btn-light"
                            data-prev
                            ${current === 0 ? 'disabled' : ''}
                        >
                            ← Previous
                        </button>

                        ${current < quiz.questions.length - 1
                            ? `
                                <button
                                    type="button"
                                    class="btn btn-primary"
                                    data-next
                                >
                                    Next question →
                                </button>
                            `
                            : `
                                <button
                                    type="submit"
                                    class="btn btn-gold"
                                >
                                    Submit quiz ✓
                                </button>
                            `}
                    </div>
                </form>
            `;

            const form = $('[data-answer-form]', el);

            form.addEventListener('change', e => {
                if (e.target.name === 'answer') {
                    answers[current] = Number(e.target.value);
                }
            });

            $('[data-prev]', el)?.addEventListener('click', () => {
                current = Math.max(0, current - 1);
                draw();
            });

            $('[data-next]', el)?.addEventListener('click', () => {
                const v = form.querySelector(
                    'input[name="answer"]:checked'
                );

                if (!v) {
                    toast(
                        'Choose an answer before continuing.',
                        'error'
                    );
                    return;
                }

                answers[current] = Number(v.value);
                current++;
                draw();
            });

            form.addEventListener('submit', e => {
                e.preventDefault();

                const v = form.querySelector(
                    'input[name="answer"]:checked'
                );

                if (v) {
                    answers[current] = Number(v.value);
                }

                if (Object.keys(answers).length !== quiz.questions.length) {
                    toast(
                        'Please answer every question before submitting.',
                        'error'
                    );
                    return;
                }

                const correct = quiz.questions.reduce(
                    (n, q, i) => n + (answers[i] === q.answer ? 1 : 0),
                    0
                );

                const percentage = Math.round(
                    correct / quiz.questions.length * 100
                );

                store.add('attempts', {
                    quizId: quiz.id,
                    quizTitle: quiz.title,
                    subject: quiz.subject,
                    studentName: store.getProfile().name,
                    correct,
                    total: quiz.questions.length,
                    percentage,
                    answers: {
                        ...answers
                    },
                    completedAt: ui.today()
                });

                el.innerHTML = `
                    <section
                        class="panel stack"
                        style="text-align:center;align-items:center;padding:2rem"
                    >
                        <div
                            class="avatar green"
                            style="width:74px;height:74px;font-size:2rem;border-radius:50%"
                        >
                            ${percentage >= 70 ? 'Awesome!' : 'Try Again!'}
                        </div>

                        <p class="eyebrow">
                            Quiz complete
                        </p>

                        <h1 class="page-title">
                            You scored ${percentage}%
                        </h1>

                        <p class="muted">
                            You answered ${correct} out of
                            ${quiz.questions.length} questions correctly.
                        </p>

                        <div
                            class="progress"
                            style="width:min(400px,100%);height:12px"
                        >
                            <span
                                style="width:${percentage}%;background:${
                                    percentage >= 70
                                        ? 'var(--green)'
                                        : 'var(--blue)'
                                }"
                            ></span>
                        </div>

                        <p>
                            ${percentage >= 70
                                ? 'Excellent effort! Keep up the good work.'
                                : 'Good attempt. Review the lesson and try again.'}
                        </p>

                        <div
                            class="stack"
                            style="width:100%;max-width:600px;text-align:left;margin-top:1rem"
                        >
                            <h2>Review your answers</h2>

                            ${quiz.questions.map((q, i) => `
                                <div class="question-card">
                                    <p>
                                        <strong>
                                            ${i + 1}. ${esc(q.q)}
                                        </strong>
                                    </p>

                                    <p class="small" style="margin-top:.4rem">
                                        Your answer:
                                        ${esc(q.options[answers[i]])}
                                        ${answers[i] === q.answer ? '✓' : '✗'}
                                    </p>

                                    <p class="small muted">
                                        Correct answer:
                                        ${esc(q.options[q.answer])}
                                    </p>

                                    <p class="small">
                                        ${esc(
                                            q.explanation
                                            || 'Review this concept in your lesson.'
                                        )}
                                    </p>
                                </div>
                            `).join('')}
                        </div>

                        <div class="row wrap">
                            <a class="btn btn-primary" href="quizzes.html">
                                Back to quizzes
                            </a>

                            <a class="btn btn-light" href="results.html">
                                View results
                            </a>
                        </div>
                    </section>
                `;
            });
        }

        draw();
    }

    function renderResults() {
        const el = $('[data-results]');
        if (!el) return;

        const attempts = store.list('attempts').filter(
            a => a.studentName === store.getProfile().name
        );

        const avg = attempts.length
            ? Math.round(
                attempts.reduce((n, a) => n + a.percentage, 0)
                / attempts.length
            )
            : 0;

        setText(
            '[data-result-average]',
            attempts.length ? avg + '%' : '—'
        );

        setText('[data-result-count]', attempts.length);

        el.innerHTML = attempts.length
            ? `
                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Quiz</th>
                                <th>Subject</th>
                                <th>Score</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${attempts.map(a => `
                                <tr>
                                    <td>
                                        <strong>${esc(a.quizTitle)}</strong>
                                    </td>

                                    <td>${esc(a.subject)}</td>

                                    <td>
                                        ${a.correct}/${a.total}
                                        (${a.percentage}%)
                                    </td>

                                    <td>${formatDate(a.completedAt)}</td>

                                    <td>
                                        ${badge(
                                            a.percentage >= 70
                                                ? 'Completed'
                                                : 'Review suggested'
                                        )}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `
            : empty(
                'Your results will appear here',
                'Complete a quiz to start building your learning history.'
            );
    }

    function renderResources() {
        const el = $('[data-resource-list]');
        if (!el) return;

        const q = ($('[data-search]')?.value || '').toLowerCase();
        const subject = $('[data-filter-subject]')?.value || '';

        const list = store.list('resources').filter(
            r => (`${r.title} ${r.subject} ${r.description}`)
                .toLowerCase()
                .includes(q)
                && (!subject || r.subject === subject)
        );

        el.innerHTML = list.length
            ? list.map(r => `
                <article class="panel resource-card">
                    <div class="avatar">
                        ${r.type === 'Worksheet'
                            ? 'M'
                            : r.subject === 'Science'
                                ? 'S'
                                : 'R'}
                    </div>

                    <div style="flex:1">
                        <p class="eyebrow">
                            ${esc(r.subject)} · ${esc(r.type)}
                        </p>

                        <h3>${esc(r.title)}</h3>

                        <p>${esc(r.description)}</p>

                        ${r.url
                            ? `
                                <a
                                    class="btn btn-light btn-small"
                                    href="${esc(r.url)}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Open resource ↗
                                </a>
                            `
                            : `
                                <span class="badge info">
                                    On-platform revision notes
                                </span>
                            `}
                    </div>
                </article>
            `).join('')
            : empty(
                'No resources found',
                'Try another search or subject.'
            );
    }

    function renderProfile() {
        const form = $('[data-profile-form]');
        if (!form) return;

        const p = store.getProfile();

        ['name', 'className', 'email'].forEach(k => {
            const i = form.elements[k];
            if (i) i.value = p[k] || '';
        });

        form.addEventListener('submit', e => {
            e.preventDefault();

            const fd = new FormData(form);

            const profile = {
                name: String(fd.get('name')).trim(),
                className: String(fd.get('className')).trim(),
                email: String(fd.get('email')).trim()
            };

            if (!profile.name) {
                toast('Please enter your name.', 'error');
                return;
            }

            store.setProfile(profile);
            toast('Demo profile updated.');

            $$('[data-profile-name]').forEach(el => {
                el.textContent = profile.name;
            });
        });
    }

    function renderTeacherDashboard() {
        const lessons = store.list('lessons'),
            assignments = store.list('assignments'),
            students = store.list('students'),
            subs = store.list('submissions');

        setText('[data-tmetric="classes"]', store.list('classes').length);
        setText('[data-tmetric="students"]', students.length);

        setText(
            '[data-tmetric="lessons"]',
            lessons.filter(l => l.status === 'Published').length
        );

        setText(
            '[data-tmetric="pending"]',
            subs.filter(s => s.status === 'Submitted' && s.mark == null).length
        );

        const el = $('[data-teacher-recent]');

        if (el) {
            el.innerHTML = assignments
                .slice(0, 4)
                .map(a => `
                    <div class="activity-item">
                        <div class="avatar gold">A</div>

                        <div style="flex:1">
                            <p>
                                <strong>${esc(a.title)}</strong>
                            </p>

                            <small>
                                ${esc(a.className)} · Due ${formatDate(a.dueDate)}
                            </small>
                        </div>

                        ${badge(a.status)}
                    </div>
                `)
                .join('');
        }
    }

    function renderTeacherLessons() {
        const el = $('[data-teacher-lessons]');
        if (!el) return;

        const q = ($('[data-search]')?.value || '').toLowerCase();

        const items = store.list('lessons').filter(
            l => `${l.title} ${l.subject} ${l.className}`
                .toLowerCase()
                .includes(q)
        );

        el.innerHTML = items.length
            ? `
                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Lesson</th>
                                <th>Class</th>
                                <th>Duration</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${items.map(l => `
                                <tr>
                                    <td>
                                        <strong>${esc(l.title)}</strong>
                                        <br>
                                        <small class="muted">
                                            ${esc(l.subject)}
                                        </small>
                                    </td>

                                    <td>${esc(l.className)}</td>

                                    <td>${l.duration || 20} min</td>

                                    <td>${badge(l.status)}</td>

                                    <td>
                                        <div class="row wrap">
                                            <button
                                                class="btn btn-light btn-small"
                                                data-edit-lesson="${esc(l.id)}"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                class="btn btn-danger btn-small"
                                                data-delete-lesson="${esc(l.id)}"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `
            : empty(
                'No lessons yet',
                'Create a lesson to share learning materials with students.'
            );

        $$('[data-delete-lesson]').forEach(b => {
            b.onclick = () => {
                if (
                    confirmAction(
                        'Delete this lesson? This cannot be undone.'
                    )
                ) {
                    store.remove('lessons', b.dataset.deleteLesson);
                    toast('Lesson deleted.');
                    renderTeacherLessons();
                }
            };
        });

        $$('[data-edit-lesson]').forEach(b => {
            b.onclick = () => {
                location.href = 'create-lesson.html?id='
                    + encodeURIComponent(b.dataset.editLesson);
            };
        });
    }

    function fillOptions(sel, values, selected) {
        if (!sel) return;

        sel.innerHTML = values.map(v => `
            <option
                value="${esc(v)}"
                ${v === selected ? 'selected' : ''}
            >
                ${esc(v)}
            </option>
        `).join('');
    }

    function renderLessonForm() {
        const form = $('[data-lesson-form]');
        if (!form) return;

        fillOptions(form.elements.subject, subjects, 'Mathematics');

        fillOptions(
            form.elements.className,
            store.list('classes').map(c => c.name),
            'Standard 6'
        );

        const id = new URLSearchParams(location.search).get('id');
        const old = id ? store.find('lessons', id) : null;

        if (old) {
            setText('[data-form-title]', 'Edit lesson');

            Object.keys(old).forEach(k => {
                if (form.elements[k]) {
                    form.elements[k].value = old[k];
                }
            });
        }

        form.addEventListener('submit', e => {
            e.preventDefault();

            const fd = new FormData(form);

            const item = {
                title: String(fd.get('title')).trim(),
                subject: fd.get('subject'),
                className: fd.get('className'),
                objectives: String(fd.get('objectives')).trim(),
                content: String(fd.get('content')).trim(),
                duration: Number(fd.get('duration')) || 20,
                status: fd.get('status'),
                createdAt: old?.createdAt || ui.today(),
                completed: old?.completed || false
            };

            if (!item.title || !item.content) {
                toast('Complete the required lesson fields.', 'error');
                return;
            }

            if (old) {
                store.update('lessons', old.id, item);
            } else {
                store.add('lessons', item);
            }

            toast(old ? 'Lesson updated.' : 'Lesson saved.');
            location.href = 'lessons.html';
        });
    }

    function renderTeacherAssignments() {
        const el = $('[data-teacher-assignments]');
        if (!el) return;

        const q = ($('[data-search]')?.value || '').toLowerCase();

        const items = store.list('assignments').filter(
            a => `${a.title} ${a.subject} ${a.className}`
                .toLowerCase()
                .includes(q)
        );

        el.innerHTML = items.length
            ? `
                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Assignment</th>
                                <th>Class</th>
                                <th>Due date</th>
                                <th>Submissions</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${items.map(a => {
                                const n = store.list('submissions').filter(
                                    s => s.assignmentId === a.id
                                ).length;

                                return `
                                    <tr>
                                        <td>
                                            <strong>${esc(a.title)}</strong>
                                            <br>
                                            <small class="muted">
                                                ${esc(a.subject)}
                                            </small>
                                        </td>

                                        <td>${esc(a.className)}</td>

                                        <td>${formatDate(a.dueDate)}</td>

                                        <td>${n}</td>

                                        <td>
                                            <button
                                                class="btn btn-light btn-small"
                                                data-view-submissions="${esc(a.id)}"
                                            >
                                                Review work
                                            </button>

                                            <button
                                                class="btn btn-danger btn-small"
                                                data-delete-assignment="${esc(a.id)}"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>

                <div
                    data-submission-review
                    class="stack"
                    style="margin-top:1rem"
                ></div>
            `
            : empty(
                'No assignments yet',
                'Create your first assignment.'
            );

        $$('[data-delete-assignment]').forEach(b => {
            b.onclick = () => {
                if (
                    confirmAction(
                        'Delete this assignment and its associated submissions?'
                    )
                ) {
                    store.remove(
                        'assignments',
                        b.dataset.deleteAssignment
                    );

                    store.all().submissions = store.list('submissions').filter(
                        s => s.assignmentId !== b.dataset.deleteAssignment
                    );

                    store.save();
                    toast('Assignment deleted.');
                    renderTeacherAssignments();
                }
            };
        });

        $$('[data-view-submissions]').forEach(b => {
            b.onclick = () => {
                showSubmissions(b.dataset.viewSubmissions);
            };
        });
    }

    function showSubmissions(id) {
        const a = store.find('assignments', id);
        const el = $('[data-submission-review]');

        if (!el) return;

        const subs = store.list('submissions').filter(
            s => s.assignmentId === id
        );

        el.innerHTML = `
            <section class="panel stack">
                <div class="between wrap">
                    <h2>Submissions: ${esc(a.title)}</h2>

                    <span class="badge info">
                        ${subs.length} received
                    </span>
                </div>

                ${subs.length
                    ? subs.map(s => `
                        <article class="question-card stack">
                            <div class="between wrap">
                                <strong>${esc(s.studentName)}</strong>
                                ${badge(s.status)}
                            </div>

                            <p style="white-space:pre-wrap">
                                ${esc(s.response)}
                            </p>

                            <p class="small muted">
                                Submitted ${formatDate(s.submittedAt)}
                            </p>

                            <form
                                data-mark-form="${esc(s.id)}"
                                class="form-grid"
                            >
                                <div class="field">
                                    <label>
                                        Mark (out of ${a.totalMarks})
                                    </label>

                                    <input
                                        type="number"
                                        name="mark"
                                        min="0"
                                        max="${a.totalMarks}"
                                        value="${s.mark ?? ''}"
                                        required
                                    >
                                </div>

                                <div class="field">
                                    <label>Feedback</label>

                                    <input
                                        name="feedback"
                                        value="${esc(s.feedback || '')}"
                                        placeholder="Helpful feedback"
                                    >
                                </div>

                                <div
                                    class="form-actions"
                                    style="grid-column:1/-1"
                                >
                                    <button
                                        class="btn btn-primary"
                                        type="submit"
                                    >
                                        Save review
                                    </button>
                                </div>
                            </form>
                        </article>
                    `).join('')
                    : empty(
                        'No submissions yet',
                        'Student responses will appear here after they submit their work.'
                    )}
            </section>
        `;

        $$('[data-mark-form]').forEach(f => {
            f.addEventListener('submit', e => {
                e.preventDefault();

                const fd = new FormData(f);
                const mark = Number(fd.get('mark'));

                if (
                    !Number.isFinite(mark)
                    || mark < 0
                    || mark > a.totalMarks
                ) {
                    toast('Enter a valid mark.', 'error');
                    return;
                }

                store.update('submissions', f.dataset.markForm, {
                    mark,
                    feedback: String(fd.get('feedback')).trim(),
                    status: 'Marked'
                });

                toast('Submission reviewed and saved.');
                showSubmissions(id);
            });
        });
    }

    function renderAssignmentForm() {
        const form = $('[data-assignment-form]');
        if (!form) return;

        fillOptions(form.elements.subject, subjects, 'Mathematics');

        fillOptions(
            form.elements.className,
            store.list('classes').map(c => c.name),
            'Standard 6'
        );

        form.elements.dueDate.min = ui.today();

        form.addEventListener('submit', e => {
            e.preventDefault();

            const fd = new FormData(form);

            const item = {
                title: String(fd.get('title')).trim(),
                subject: fd.get('subject'),
                className: fd.get('className'),
                instructions: String(fd.get('instructions')).trim(),
                dueDate: fd.get('dueDate'),
                totalMarks: Number(fd.get('totalMarks')),
                status: fd.get('status'),
                createdAt: ui.today()
            };

            if (
                !item.title
                || !item.instructions
                || !item.dueDate
                || item.totalMarks < 1
            ) {
                toast(
                    'Please complete all required fields correctly.',
                    'error'
                );
                return;
            }

            store.add('assignments', item);
            toast('Assignment created successfully.');
            location.href = 'assignments.html';
        });
    }

    function renderClasses() {
        const el = $('[data-classes]');
        if (!el) return;

        el.innerHTML = store.list('classes')
            .map(c => `
                <article class="panel stack">
                    <div class="between">
                        <div class="avatar">C</div>
                        ${badge('Active')}
                    </div>

                    <h2>${esc(c.name)}</h2>

                    <p class="muted">
                        ${c.students} learners · Primary school
                    </p>

                    <div class="between">
                        <span class="small">
                            Subjects: ${subjects.length}
                        </span>

                        <a
                            class="btn btn-light btn-small"
                            href="students.html?class=${encodeURIComponent(c.name)}"
                        >
                            View students →
                        </a>
                    </div>
                </article>
            `)
            .join('');
    }

    function renderStudents() {
        const el = $('[data-students]');
        if (!el) return;

        const q = ($('[data-search]')?.value || '').toLowerCase();
        const cls = new URLSearchParams(location.search).get('class') || '';

        const students = store.list('students').filter(
            s => (`${s.name} ${s.className} ${s.email}`)
                .toLowerCase()
                .includes(q)
                && (!cls || s.className === cls)
        );

        el.innerHTML = students.length
            ? `
                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Class</th>
                                <th>Progress</th>
                                <th>Learning status</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${students.map(s => `
                                <tr>
                                    <td>
                                        <div class="row">
                                            <div class="avatar">
                                                ${esc(
                                                    s.name.split(' ')
                                                        .map(x => x[0])
                                                        .join('')
                                                        .slice(0, 2)
                                                )}
                                            </div>

                                            <div>
                                                <strong>${esc(s.name)}</strong>
                                                <br>
                                                <small class="muted">
                                                    ${esc(s.email)}
                                                </small>
                                            </div>
                                        </div>
                                    </td>

                                    <td>${esc(s.className)}</td>

                                    <td>
                                        <div class="row">
                                            <div
                                                class="progress"
                                                style="width:100px"
                                            >
                                                <span
                                                    style="width:${s.progress}%"
                                                ></span>
                                            </div>

                                            ${s.progress}%
                                        </div>
                                    </td>

                                    <td>
                                        ${badge(
                                            s.progress >= 80
                                                ? 'On track'
                                                : s.progress >= 60
                                                    ? 'Making progress'
                                                    : 'Needs support'
                                        )}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `
            : empty(
                'No students found',
                'Try changing the search term or class filter.'
            );
    }

    function renderReports() {
        const attempts = store.list('attempts');
        const subs = store.list('submissions');
        const students = store.list('students');

        setText('[data-report-attempts]', attempts.length);
        setText('[data-report-submissions]', subs.length);
        setText('[data-report-students]', students.length);

        const el = $('[data-report-subjects]');

        if (el) {
            const by = {};

            attempts.forEach(a => {
                by[a.subject] ??= [];
                by[a.subject].push(a.percentage);
            });

            const subjectsWithData = Object.keys(by);

            el.innerHTML = subjectsWithData.length
                ? subjectsWithData.map(s => {
                    const avg = Math.round(
                        by[s].reduce((a, b) => a + b, 0) / by[s].length
                    );

                    return `
                        <div class="chart-row">
                            <span>${esc(s)}</span>

                            <div class="progress">
                                <span style="width:${avg}%"></span>
                            </div>

                            <strong>${avg}%</strong>
                        </div>
                    `;
                }).join('')
                : empty(
                    'No quiz data yet',
                    'Student quiz results will populate these charts.'
                );
        }

        const subEl = $('[data-report-submissions-list]');

        if (subEl) {
            subEl.innerHTML = subs.length
                ? subs.slice(0, 6).map(s => `
                    <div class="activity-item">
                        <div class="avatar green">✓</div>

                        <div style="flex:1">
                            <p>
                                <strong>${esc(s.assignmentTitle)}</strong>
                            </p>

                            <small>
                                ${esc(s.studentName)} ·
                                ${formatDate(s.submittedAt)}
                            </small>
                        </div>

                        ${badge(s.status)}
                    </div>
                `).join('')
                : empty(
                    'No submissions yet',
                    'Submitted assignments will appear here.'
                );
        }
    }

    function renderQuizManagement() {
        const el = $('[data-teacher-quizzes]');
        if (!el) return;

        const quizzes = store.list('quizzes');

        el.innerHTML = quizzes.map(q => `
            <article class="panel stack">
                <div class="between">
                    <div class="avatar purple">Q</div>
                    ${badge(q.status)}
                </div>

                <p class="eyebrow">
                    ${esc(q.subject)} · ${esc(q.className)}
                </p>

                <h2 style="font-size:1.1rem">
                    ${esc(q.title)}
                </h2>

                <p class="muted small">
                    ${q.questions.length} questions
                </p>

                <div class="row wrap">
                    <button
                        class="btn btn-light btn-small"
                        data-edit-quiz="${esc(q.id)}"
                    >
                        Edit quiz
                    </button>

                    <button
                        class="btn btn-danger btn-small"
                        data-delete-quiz="${esc(q.id)}"
                    >
                        Delete
                    </button>
                </div>
            </article>
        `).join('')
            || empty('No quizzes', 'Create a quiz for your learners.');

        $$('[data-delete-quiz]').forEach(b => {
            b.onclick = () => {
                if (confirmAction('Delete this quiz?')) {
                    store.remove('quizzes', b.dataset.deleteQuiz);
                    toast('Quiz deleted.');
                    renderQuizManagement();
                }
            };
        });

        $$('[data-edit-quiz]').forEach(b => {
            b.onclick = () => {
                location.href = 'create-quiz.html?id='
                    + encodeURIComponent(b.dataset.editQuiz);
            };
        });
    }

    function renderQuizForm() {
        const form = $('[data-quiz-form]');
        if (!form) return;

        fillOptions(form.elements.subject, subjects, 'Mathematics');

        fillOptions(
            form.elements.className,
            store.list('classes').map(c => c.name),
            'Standard 6'
        );

        const id = new URLSearchParams(location.search).get('id');
        const old = id ? store.find('quizzes', id) : null;

        let questions = old
            ? store.clone(old.questions)
            : [
                {
                    q: '',
                    options: ['', '', '', ''],
                    answer: 0,
                    explanation: ''
                }
            ];

        if (old) {
            form.elements.title.value = old.title;
            form.elements.subject.value = old.subject;
            form.elements.className.value = old.className;
            form.elements.status.value = old.status;

            setText('[data-form-title]', 'Edit quiz');
        }

        const holder = $('[data-question-builders]');

        function draw() {
            holder.innerHTML = questions.map((q, i) => `
                <section
                    class="question-builder"
                    data-question-index="${i}"
                >
                    <div class="between">
                        <h3>Question ${i + 1}</h3>

                        <button
                            type="button"
                            class="btn btn-danger btn-small"
                            data-remove-question="${i}"
                            ${questions.length === 1 ? 'disabled' : ''}
                        >
                            Remove
                        </button>
                    </div>

                    <div class="field">
                        <label>Question text</label>

                        <textarea data-q-text="${i}" required>${esc(q.q)}</textarea>
                    </div>

                    <div class="grid grid-2">
                        ${q.options.map((o, j) => `
                            <div class="field">
                                <label>
                                    Option ${String.fromCharCode(65 + j)}
                                </label>

                                <input
                                    data-q-option="${i}-${j}"
                                    value="${esc(o)}"
                                    required
                                >
                            </div>
                        `).join('')}
                    </div>

                    <div class="form-grid">
                        <div class="field">
                            <label>Correct answer</label>

                            <select data-q-answer="${i}">
                                ${q.options.map((o, j) => `
                                    <option
                                        value="${j}"
                                        ${q.answer === j ? 'selected' : ''}
                                    >
                                        Option ${String.fromCharCode(65 + j)}
                                    </option>
                                `).join('')}
                            </select>
                        </div>

                        <div class="field">
                            <label>Explanation (optional)</label>

                            <input
                                data-q-explanation="${i}"
                                value="${esc(q.explanation || '')}"
                            >
                        </div>
                    </div>
                </section>
            `).join('');

            $$('[data-remove-question]', holder).forEach(b => {
                b.onclick = () => {
                    questions.splice(
                        Number(b.dataset.removeQuestion),
                        1
                    );

                    draw();
                };
            });
        }

        draw();

        $('[data-add-question]')?.addEventListener('click', () => {
            questions.push({
                q: '',
                options: ['', '', '', ''],
                answer: 0,
                explanation: ''
            });

            draw();
        });

        form.addEventListener('submit', e => {
            e.preventDefault();

            questions = questions.map((q, i) => ({
                ...q,

                q: $(`[data-q-text="${i}"]`, holder)
                    .value.trim(),

                options: q.options.map((_, j) =>
                    $(`[data-q-option="${i}-${j}"]`, holder)
                        .value.trim()
                ),

                answer: Number(
                    $(`[data-q-answer="${i}"]`, holder).value
                ),

                explanation: $(`[data-q-explanation="${i}"]`, holder)
                    .value.trim()
            }));

            if (questions.some(q => !q.q || q.options.some(o => !o))) {
                toast(
                    'Complete each question and all four answer options.',
                    'error'
                );
                return;
            }

            const fd = new FormData(form);

            const item = {
                title: String(fd.get('title')).trim(),
                subject: fd.get('subject'),
                className: fd.get('className'),
                status: fd.get('status'),
                questions
            };

            if (!item.title) {
                toast('Enter a quiz title.', 'error');
                return;
            }

            if (old) {
                store.update('quizzes', old.id, item);
            } else {
                store.add('quizzes', item);
            }

            toast(old ? 'Quiz updated.' : 'Quiz created.');
            location.href = 'quizzes.html';
        });
    }

    const handlers = {
        'student-dashboard': renderStudentDashboard,
        'student-lessons': renderLessons,
        'student-lesson-detail': renderLessonDetails,
        'student-assignments': renderAssignments,
        'student-quizzes': renderQuizzes,
        'student-quiz': renderQuiz,
        'student-results': renderResults,
        'student-resources': renderResources,
        'student-profile': renderProfile,
        'teacher-dashboard': renderTeacherDashboard,
        'teacher-lessons': renderTeacherLessons,
        'teacher-lesson-form': renderLessonForm,
        'teacher-assignments': renderTeacherAssignments,
        'teacher-assignment-form': renderAssignmentForm,
        'teacher-classes': renderClasses,
        'teacher-students': renderStudents,
        'teacher-reports': renderReports,
        'teacher-quizzes': renderQuizManagement,
        'teacher-quiz-form': renderQuizForm
    };

    if (handlers[page]) handlers[page]();

    $$('[data-search]').forEach(i => {
        i.addEventListener('input', () => {
            if (page === 'student-lessons') renderLessons();
            if (page === 'student-assignments') renderAssignments();
            if (page === 'student-resources') renderResources();
            if (page === 'teacher-lessons') renderTeacherLessons();
            if (page === 'teacher-assignments') renderTeacherAssignments();
            if (page === 'teacher-students') renderStudents();
        });
    });

    $$('[data-filter-subject]').forEach(i => {
        i.addEventListener('change', () => {
            if (page === 'student-lessons') renderLessons();
            if (page === 'student-resources') renderResources();
        });
    });

    const reset = $('[data-reset-demo]');

    reset?.addEventListener('click', () => {
        if (
            confirmAction(
                'Reset all local demo data to the original sample records? Your locally created records will be removed.'
            )
        ) {
            store.reset();
            toast('Demo data reset.');
            location.reload();
        }
    });
})();
