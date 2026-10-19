(function () {
    const KEY = 'chisomoLearningData_v1';

    const seed = {
        students: [
            {
                id: 'stu-101',
                name: 'Tadala Banda',
                className: 'Standard 6',
                email: 'tadala@example.test',
                progress: 72
            },
            {
                id: 'stu-102',
                name: 'Chisomo Phiri',
                className: 'Standard 6',
                email: 'chisomo@example.test',
                progress: 84
            },
            {
                id: 'stu-103',
                name: 'Memory Zulu',
                className: 'Standard 5',
                email: 'memory@example.test',
                progress: 63
            },
            {
                id: 'stu-104',
                name: 'Blessings Mbewe',
                className: 'Standard 6',
                email: 'blessings@example.test',
                progress: 91
            }
        ],

        teachers: [
            {
                id: 'tea-101',
                name: 'Mrs. Grace Moyo',
                subject: 'Mathematics & Science'
            }
        ],

        classes: [
            {
                id: 'class-6',
                name: 'Standard 6',
                students: 24
            },
            {
                id: 'class-5',
                name: 'Standard 5',
                students: 28
            },
            {
                id: 'class-4',
                name: 'Standard 4',
                students: 26
            }
        ],

        lessons: [
            {
                id: 'les-1',
                title: 'Fractions Made Easy',
                subject: 'Mathematics',
                className: 'Standard 6',
                objectives: 'Understand numerators and denominators; compare simple fractions.',
                content: 'A fraction represents part of a whole. The numerator is the top number and tells us how many parts we have. The denominator is the bottom number and tells us how many equal parts make the whole. For example, 3/4 means three out of four equal parts.',
                duration: 20,
                status: 'Published',
                createdAt: '2026-09-28',
                completed: false
            },
            {
                id: 'les-2',
                title: 'Living and Non-living Things',
                subject: 'Science',
                className: 'Standard 6',
                objectives: 'Identify characteristics of living things and give local examples.',
                content: 'Living things need food, water and air. They grow, reproduce and respond to their surroundings. Examples include people, goats, maize plants and birds. Rocks and desks are non-living things.',
                duration: 25,
                status: 'Published',
                createdAt: '2026-09-26',
                completed: false
            },
            {
                id: 'les-3',
                title: 'Reading for Meaning',
                subject: 'English',
                className: 'Standard 5',
                objectives: 'Find the main idea and supporting details in a short passage.',
                content: 'Read a passage carefully. Ask yourself who or what it is about. The main idea is the most important message, while supporting details explain or give evidence for that message.',
                duration: 15,
                status: 'Published',
                createdAt: '2026-09-22',
                completed: false
            },
            {
                id: 'les-4',
                title: 'Our Community',
                subject: 'Social Studies',
                className: 'Standard 6',
                objectives: 'Describe services and responsibilities in a community.',
                content: 'A community is a group of people living or working in the same area. Schools, health centres, markets and places of worship can serve a community. Members help keep their community safe and clean.',
                duration: 18,
                status: 'Published',
                createdAt: '2026-09-18',
                completed: false
            }
        ],

        assignments: [
            {
                id: 'asg-1',
                title: 'Fractions Practice',
                subject: 'Mathematics',
                className: 'Standard 6',
                instructions: 'Write three fractions and draw a simple diagram to show each one. Explain which fraction is largest.',
                dueDate: '2026-10-16',
                totalMarks: 10,
                status: 'Published',
                createdAt: '2026-10-02'
            },
            {
                id: 'asg-2',
                title: 'My Local Environment',
                subject: 'Science',
                className: 'Standard 6',
                instructions: 'List five living things and five non-living things found near your home. Write one sentence about each group.',
                dueDate: '2026-10-19',
                totalMarks: 10,
                status: 'Published',
                createdAt: '2026-10-03'
            },
            {
                id: 'asg-3',
                title: 'A Short Story',
                subject: 'English',
                className: 'Standard 5',
                instructions: 'Write a short story of 100–150 words about helping someone in your community.',
                dueDate: '2026-10-13',
                totalMarks: 20,
                status: 'Published',
                createdAt: '2026-10-01'
            }
        ],

        submissions: [],

        quizzes: [
            {
                id: 'quiz-1',
                title: 'Fractions Quick Check',
                subject: 'Mathematics',
                className: 'Standard 6',
                status: 'Published',
                questions: [
                    {
                        q: 'Which fraction means one out of four equal parts?',
                        options: ['1/2', '1/4', '4/1', '2/4'],
                        answer: 1,
                        explanation: 'The numerator is 1 and the denominator is 4.'
                    },
                    {
                        q: 'Which fraction is larger?',
                        options: ['1/3', '1/2', 'They are equal', 'Cannot tell'],
                        answer: 1,
                        explanation: 'One half is larger than one third.'
                    },
                    {
                        q: 'What is the numerator in 3/5?',
                        options: ['5', '8', '3', '2'],
                        answer: 2,
                        explanation: 'The numerator is the top number, which is 3.'
                    }
                ]
            },
            {
                id: 'quiz-2',
                title: 'Science: Living Things',
                subject: 'Science',
                className: 'Standard 6',
                status: 'Published',
                questions: [
                    {
                        q: 'Which is a living thing?',
                        options: ['A stone', 'A desk', 'A maize plant', 'A cup'],
                        answer: 2,
                        explanation: 'A maize plant grows and carries out life processes.'
                    },
                    {
                        q: 'Which is a characteristic of living things?',
                        options: [
                            'They all have wheels',
                            'They grow',
                            'They are all made of metal',
                            'They never change'
                        ],
                        answer: 1,
                        explanation: 'Growth is one characteristic of living things.'
                    }
                ]
            },
            {
                id: 'quiz-3',
                title: 'English Reading Skills',
                subject: 'English',
                className: 'Standard 5',
                status: 'Published',
                questions: [
                    {
                        q: 'The main idea of a passage is…',
                        options: [
                            'The least important detail',
                            'The page number',
                            'The most important message',
                            'The title only'
                        ],
                        answer: 2,
                        explanation: 'The main idea tells what the passage is mostly about.'
                    }
                ]
            }
        ],

        attempts: [],

        resources: [
            {
                id: 'res-1',
                title: 'Fractions Revision Sheet',
                subject: 'Mathematics',
                type: 'Worksheet',
                description: 'Practice identifying and comparing simple fractions.',
                url: ''
            },
            {
                id: 'res-2',
                title: 'Living Things: Quick Notes',
                subject: 'Science',
                type: 'Revision notes',
                description: 'A short summary of living and non-living things.',
                url: ''
            },
            {
                id: 'res-3',
                title: 'English Reading Practice',
                subject: 'English',
                type: 'Reading',
                description: 'A simple guide to main ideas and supporting details.',
                url: ''
            },
            {
                id: 'res-4',
                title: 'Chichewa Vocabulary Practice',
                subject: 'Chichewa',
                type: 'Practice',
                description: 'Build everyday vocabulary and sentence skills.',
                url: ''
            }
        ],

        announcements: [
            {
                id: 'ann-1',
                title: 'Welcome to the new learning week',
                message: 'Remember to review your lessons and complete your assignments before their due dates.',
                date: '2026-10-05'
            },
            {
                id: 'ann-2',
                title: 'Reading corner open',
                message: 'New reading activities are available in the learning resources area.',
                date: '2026-10-03'
            }
        ],

        profile: {
            name: 'Tadala Banda',
            className: 'Standard 6',
            email: 'tadala@example.test'
        }
    };

    function clone(v) {
        return JSON.parse(JSON.stringify(v));
    }

    function load() {
        try {
            const raw = localStorage.getItem(KEY);

            if (!raw) {
                localStorage.setItem(KEY, JSON.stringify(seed));
                return clone(seed);
            }

            const parsed = JSON.parse(raw);

            return {
                ...clone(seed),
                ...parsed
            };
        } catch (e) {
            return clone(seed);
        }
    }

    let data = load();

    function save() {
        try {
            localStorage.setItem(KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            return false;
        }
    }

    function list(key) {
        return Array.isArray(data[key]) ? data[key] : [];
    }

    function add(key, item) {
        const arr = list(key);

        arr.unshift({
            ...item,
            id: item.id || `${key.slice(0, 3)}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
        });

        data[key] = arr;
        save();

        return arr[0];
    }

    function update(key, id, patch) {
        const arr = list(key);
        const i = arr.findIndex(x => x.id === id);

        if (i < 0) {
            return null;
        }

        arr[i] = {
            ...arr[i],
            ...patch
        };

        data[key] = arr;
        save();

        return arr[i];
    }

    function remove(key, id) {
        data[key] = list(key).filter(x => x.id !== id);
        save();
    }

    function getProfile() {
        return data.profile || clone(seed.profile);
    }

    function setProfile(profile) {
        data.profile = {
            ...getProfile(),
            ...profile
        };

        save();

        return data.profile;
    }

    function reset() {
        data = clone(seed);
        save();
    }

    window.SchoolStore = {
        list,
        add,
        update,
        remove,
        save,
        getProfile,
        setProfile,
        reset,
        all: () => data,
        find: (key, id) => list(key).find(x => x.id === id),
        clone
    };
})();