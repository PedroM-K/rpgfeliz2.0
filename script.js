// some o splash
        document.getElementById('splashEnter').addEventListener('click', () => {
            const splash = document.getElementById('splashScreen');
            splash.classList.add('fade-out');
            setTimeout(() => { splash.style.display = 'none'; }, 700);
        });

        // troca aba
        const navBtns = document.querySelectorAll('.nav-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.tab;
                navBtns.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                const panel = document.getElementById(target);
                if (panel) panel.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });

        // sub-nav
        document.querySelectorAll('.sub-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const subGroup = btn.dataset.sub;
                const targetPanel = btn.dataset.panel;

                document.querySelectorAll('.sub-btn[data-sub="' + subGroup + '"]')
                    .forEach(b => b.classList.remove('active'));

                const parentTab = btn.closest('.tab-panel');
                parentTab.querySelectorAll('.trail-panel')
                    .forEach(p => p.classList.remove('active'));

                btn.classList.add('active');
                const panel = document.getElementById(targetPanel);
                if (panel) panel.classList.add('active');
            });
        });

        // accordion
        function toggleCard(header) {
            const card = header.closest('.ability-card');
            card.classList.toggle('open');
        }

        // accordion elem
        function toggleElementBlock(header) {
            header.closest('.element-block').classList.toggle('collapsed');
        }

        // abre o primeiro de cada trilha
        document.querySelectorAll('.trail-panel').forEach(panel => {
            const firstCard = panel.querySelector('.abilities-grid .ability-card');
            if (firstCard && !firstCard.classList.contains('open')) {
                firstCard.classList.add('open');
            }
        });

        // cor nos elementos
        (function () {
            const defs = [
                [/\bSangue\b/gi, '#c0392b'],
                [/\bMorte\b/gi, '#c0c0c0'],
                [/\bConhecimento\b/gi, '#c9a055'],
                [/\bEnergia\b/gi, '#9b59b6']
            ];
            const sel = [
                '.ability-body p', '.ability-body li',
                '.trail-intro p',
                '.info-card p', '.info-card li',
                '.ritual-card p',
                '.lore-block p', '.lore-block h5',
                '.recipe-card p',
                '.intention-item p',
                '.mod-block p', '.mod-block h5',
                '.element-block-header'
            ].join(', ');
            const highlight = el => {
                let h = el.innerHTML;
                defs.forEach(([re, col]) => {
                    h = h.replace(re, m => '<span style="color:' + col + ';font-weight:600">' + m + '</span>');
                });
                el.innerHTML = h;
            };
            document.querySelectorAll(
                '#c-mons-intro, #c-contemplacao, #c-transmissao, #c-ruptura, #c-intencao, #c-esquecimento, #c-adaptacao, #c-medo'
            ).forEach(painel => painel.querySelectorAll(sel).forEach(highlight));
            const esoterico = document.getElementById('e-esoterico');
            if (esoterico) esoterico.querySelectorAll('.element-block-header').forEach(highlight);
        })();



        