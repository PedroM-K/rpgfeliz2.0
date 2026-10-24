// Ordem Paranormal - Homebrews
(function () {
    'use strict';

    // cores e temas de cada aba
    const THEMES = {
        'default': { hex: '#c9a055', r: 201, g: 160, b: 85 },
        'combatente': { hex: '#c0392b', r: 192, g: 57, b: 43 },
        'especialista': { hex: '#2980b9', r: 41, g: 128, b: 185 },
        'ocultista': { hex: '#8e44ad', r: 142, g: 68, b: 173 },
        'geral': { hex: '#c9a055', r: 201, g: 160, b: 85 },
        'origens': { hex: '#daa520', r: 218, g: 165, b: 32 },
        'poderes-paranormais': { hex: '#9b59b6', r: 155, g: 89, b: 182 },
        'rituais': { hex: '#8e44ad', r: 142, g: 68, b: 173 }
    };

    let currentGlow = { r: 201, g: 160, b: 85 };
    let targetGlow = { r: 201, g: 160, b: 85 };
    let glowAnimId = null;

    function animateGlow() {
        const dr = targetGlow.r - currentGlow.r;
        const dg = targetGlow.g - currentGlow.g;
        const db = targetGlow.b - currentGlow.b;

        if (Math.abs(dr) < 0.5 && Math.abs(dg) < 0.5 && Math.abs(db) < 0.5) {
            currentGlow.r = targetGlow.r;
            currentGlow.g = targetGlow.g;
            currentGlow.b = targetGlow.b;
            document.documentElement.style.setProperty('--active-accent-rgb', `${currentGlow.r}, ${currentGlow.g}, ${currentGlow.b}`);
            glowAnimId = null;
            return;
        }

        currentGlow.r += dr * 0.14;
        currentGlow.g += dg * 0.14;
        currentGlow.b += db * 0.14;

        document.documentElement.style.setProperty(
            '--active-accent-rgb',
            `${Math.round(currentGlow.r)}, ${Math.round(currentGlow.g)}, ${Math.round(currentGlow.b)}`
        );

        glowAnimId = requestAnimationFrame(animateGlow);
    }

    function updateTheme(tabKey) {
        const theme = THEMES[tabKey] || THEMES.default;
        document.documentElement.style.setProperty('--active-accent', theme.hex);
        targetGlow = { r: theme.r, g: theme.g, b: theme.b };
        if (!glowAnimId) {
            glowAnimId = requestAnimationFrame(animateGlow);
        }
    }

    // tela inicial (splash screen)
    const splashEnterBtn = document.getElementById('splashEnter');
    const splash = document.getElementById('splashScreen');

    if (splashEnterBtn && splash) {
        splashEnterBtn.addEventListener('click', () => {
            splashEnterBtn.style.pointerEvents = 'none';
            splashEnterBtn.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            splashEnterBtn.style.opacity = '0.5';
            splashEnterBtn.style.transform = 'scale(0.98)';

            splash.classList.add('fade-out');
            setTimeout(() => {
                splash.style.display = 'none';
            }, 560);
        });
    }

    // navegacao das abas principais
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            if (!target) return;

            navBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');

            updateTheme(target);

            const welcomeScreen = document.getElementById('welcomeScreen');
            if (welcomeScreen) {
                welcomeScreen.style.display = 'none';
            }

            const panel = document.getElementById(target);
            if (panel) {
                panel.classList.add('active');
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // sub-abas das trilhas
    document.querySelectorAll('.sub-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const subGroup = btn.dataset.sub;
            const targetPanel = btn.dataset.panel;

            document.querySelectorAll('.sub-btn[data-sub="' + subGroup + '"]')
                .forEach(b => b.classList.remove('active'));

            const scope = btn.closest('.element-block') || btn.closest('.tab-panel');
            if (scope) {
                scope.querySelectorAll('.trail-panel')
                    .forEach(p => p.classList.remove('active'));
            }

            btn.classList.add('active');
            const panel = document.getElementById(targetPanel);
            if (panel) panel.classList.add('active');
        });
    });

    // abrir e fechar cards de habilidade
    window.toggleCard = function (header) {
        const card = header.closest('.ability-card');
        if (!card) return;

        const body = card.querySelector('.ability-body');
        const isOpen = card.classList.contains('open');

        if (isOpen) {
            // fechar
            if (body) {
                body.style.maxHeight = body.scrollHeight + 'px';
                body.offsetHeight;
                body.style.maxHeight = '0px';
            }
            card.classList.remove('open');
        } else {
            // abrir
            card.classList.add('open');
            if (body) {
                body.style.maxHeight = body.scrollHeight + 'px';
                setTimeout(() => {
                    if (card.classList.contains('open')) {
                        body.style.maxHeight = 'none';
                    }
                }, 400);
            }
        }
    };

    window.toggleElementBlock = function (header) {
        const block = header.closest('.element-block');
        if (!block) return;

        const grid = block.querySelector('.recipe-grid');
        const isCollapsed = block.classList.contains('collapsed');

        if (isCollapsed) {
            block.classList.remove('collapsed');
            if (grid) {
                grid.style.maxHeight = '0px';
                grid.offsetHeight;
                grid.style.maxHeight = (grid.scrollHeight + 30) + 'px';
                setTimeout(() => {
                    if (!block.classList.contains('collapsed')) {
                        grid.style.maxHeight = 'none';
                    }
                }, 400);
            }
        } else {
            if (grid) {
                grid.style.maxHeight = grid.scrollHeight + 'px';
                grid.offsetHeight;
                grid.style.maxHeight = '0px';
            }
            block.classList.add('collapsed');
        }
    };

    // abre o primeiro card por padrao
    document.querySelectorAll('.trail-panel').forEach(panel => {
        const firstCard = panel.querySelector('.abilities-grid .ability-card');
        if (firstCard && !firstCard.classList.contains('open')) {
            firstCard.classList.add('open');
            const body = firstCard.querySelector('.ability-body');
            if (body) body.style.maxHeight = 'none';
        }
    });

    // iluminacao do mouse nos cards
    document.addEventListener('mousemove', (e) => {
        const target = e.target.closest('.ability-card, .recipe-card, .ritual-card, .info-card');
        if (target) {
            const rect = target.getBoundingClientRect();
            target.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            target.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }
    }, { passive: true });

    // botao de voltar ao topo
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'occult-scroll-top';
    scrollTopBtn.id = 'occultScrollTop';
    scrollTopBtn.setAttribute('aria-label', 'Retornar ao Topo');
    scrollTopBtn.setAttribute('title', 'Retornar ao Topo');
    scrollTopBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 350) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // sistema de busca (ctrl+k)
    const searchableIndex = [];
    let selectedResultIndex = 0;
    let currentFilterCategory = 'all';

    function normalizeText(str) {
        return (str || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    }

    // monta o indice de busca
    function buildCompendiumIndex() {
        searchableIndex.length = 0;

        // habilidades
        document.querySelectorAll('.ability-card').forEach((card, idx) => {
            const nameEl = card.querySelector('.ability-name');
            const badgeEl = card.querySelector('.nex-badge');
            const bodyEl = card.querySelector('.ability-body');
            const trailPanel = card.closest('.trail-panel');
            const tabPanel = card.closest('.tab-panel');

            const title = nameEl ? nameEl.textContent.trim() : '';
            if (!title) return;

            const badge = badgeEl ? badgeEl.textContent.trim() : 'HABILIDADE';
            const body = bodyEl ? bodyEl.textContent.replace(/\s+/g, ' ').trim() : '';

            const tabId = tabPanel ? tabPanel.id : 'geral';
            const trailId = trailPanel ? trailPanel.id : '';

            const tabBtn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
            const trailBtn = trailId ? document.querySelector(`.sub-btn[data-panel="${trailId}"]`) : null;

            const tabName = tabBtn ? tabBtn.textContent.trim() : (tabId.charAt(0).toUpperCase() + tabId.slice(1));
            const trailName = trailBtn ? trailBtn.textContent.trim() : '';

            searchableIndex.push({
                id: 'ab_' + idx,
                type: 'ability',
                title: title,
                badge: badge,
                body: body,
                tabId: tabId,
                tabName: tabName,
                trailId: trailId,
                trailName: trailName,
                element: card,
                category: getCategoryKey(tabId, 'ability'),
                accentColor: getCategoryColor(tabId),
                normTitle: normalizeText(title),
                normBadge: normalizeText(badge),
                normBody: normalizeText(body),
                normTrail: normalizeText(trailName),
                normTab: normalizeText(tabName)
            });
        });

        // rituais
        document.querySelectorAll('.ritual-card').forEach((card, idx) => {
            const titleEl = card.querySelector('h4');
            const firstStatEl = card.querySelector('.ritual-stat');
            const allStats = Array.from(card.querySelectorAll('.ritual-stat')).map(s => s.textContent.trim()).join(' | ');
            const tabPanel = card.closest('.tab-panel');
            const trailPanel = card.closest('.trail-panel');

            const title = titleEl ? titleEl.textContent.trim() : 'Ritual';
            const body = card.textContent.replace(/\s+/g, ' ').trim();
            const tabId = tabPanel ? tabPanel.id : 'rituais';
            const trailId = trailPanel ? trailPanel.id : '';

            const trailBtn = trailId ? document.querySelector(`.sub-btn[data-panel="${trailId}"]`) : null;
            const trailName = trailBtn ? trailBtn.textContent.trim() : 'Rituais';
            const badgeText = firstStatEl ? firstStatEl.textContent.trim() : 'RITUAL';

            searchableIndex.push({
                id: 'rit_' + idx,
                type: 'ritual',
                title: title,
                badge: badgeText,
                body: body,
                tabId: tabId,
                tabName: 'Rituais',
                trailId: trailId,
                trailName: trailName,
                element: card,
                category: 'rituais',
                accentColor: '#b890e0',
                normTitle: normalizeText(title),
                normBadge: normalizeText(allStats + ' ritual'),
                normBody: normalizeText(body + ' ' + allStats),
                normTrail: normalizeText(trailName),
                normTab: 'rituais'
            });
        });

        // itens e modificacoes
        document.querySelectorAll('.recipe-card, .mod-block').forEach((card, idx) => {
            const titleEl = card.querySelector('h5');
            const title = titleEl ? titleEl.textContent.trim() : 'Item';
            if (title === 'Em construção.') return;

            const tabPanel = card.closest('.tab-panel');
            const trailPanel = card.closest('.trail-panel');
            const elemBlock = card.closest('.element-block');
            const elemHeader = elemBlock ? elemBlock.querySelector('.element-block-header span') : null;

            const tabId = tabPanel ? tabPanel.id : 'especialista';
            const trailId = trailPanel ? trailPanel.id : '';
            const trailBtn = trailId ? document.querySelector(`.sub-btn[data-panel="${trailId}"]`) : null;

            const blockName = elemHeader ? elemHeader.textContent.trim() : '';
            const trailName = trailBtn ? trailBtn.textContent.trim() : blockName;
            const body = card.textContent.replace(/\s+/g, ' ').trim();

            searchableIndex.push({
                id: 'item_' + idx,
                type: 'item',
                title: title,
                badge: blockName || 'ITEM / MOD',
                body: body,
                tabId: tabId,
                tabName: 'Especialista',
                trailId: trailId,
                trailName: trailName,
                element: card,
                category: 'item',
                accentColor: '#4ec099',
                normTitle: normalizeText(title),
                normBadge: normalizeText(blockName),
                normBody: normalizeText(body),
                normTrail: normalizeText(trailName),
                normTab: 'especialista'
            });
        });

        // intencoes
        document.querySelectorAll('.intention-item').forEach((card, idx) => {
            const quoteEl = card.querySelector('.quote');
            const title = quoteEl ? quoteEl.textContent.trim() : 'Intenção Monstruosa';
            const tabPanel = card.closest('.tab-panel');
            const trailPanel = card.closest('.trail-panel');
            const tabId = tabPanel ? tabPanel.id : 'combatente';
            const trailId = trailPanel ? trailPanel.id : '';

            searchableIndex.push({
                id: 'int_' + idx,
                type: 'lore',
                title: title,
                badge: 'INTENÇÃO',
                body: card.textContent.replace(/\s+/g, ' ').trim(),
                tabId: tabId,
                tabName: 'Combatente',
                trailId: trailId,
                trailName: 'Monstruoso',
                element: card,
                category: 'combatente',
                accentColor: '#1a7a5a',
                normTitle: normalizeText(title),
                normBadge: 'intencao',
                normBody: normalizeText(card.textContent),
                normTrail: 'monstruoso',
                normTab: 'combatente'
            });
        });
    }

    function getCategoryKey(tabId, type) {
        if (type === 'ritual' || tabId === 'rituais') return 'rituais';
        if (tabId === 'combatente') return 'combatente';
        if (tabId === 'especialista') return 'especialista';
        if (tabId === 'ocultista') return 'ocultista';
        if (tabId === 'geral' || tabId === 'origens') return 'geral';
        return 'all';
    }

    function getCategoryColor(tabId) {
        const t = THEMES[tabId];
        return t ? t.hex : THEMES.default.hex;
    }

    // cria o botao de busca na navbar e o modal
    function setupSuperiorSearchSystem() {
        const mainNav = document.querySelector('.main-nav');
        if (!mainNav || document.getElementById('searchTriggerBtn')) return;

        // botao na navbar
        const searchNavRow = document.createElement('div');
        searchNavRow.className = 'search-nav-row';
        searchNavRow.innerHTML = `
            <button type="button" class="search-trigger-btn" id="searchTriggerBtn" aria-label="Abrir busca no compêndio">
                <svg class="search-trigger-icon" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <span class="search-trigger-text">Buscar habilidades, rituais, regras, NEX, itens...</span>
                <span class="search-shortcut-badge"><kbd>Ctrl</kbd><kbd>K</kbd></span>
            </button>
        `;
        mainNav.appendChild(searchNavRow);

        // modal
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'searchModalOverlay';
        modalOverlay.className = 'search-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="search-modal" role="dialog" aria-modal="true" aria-label="Busca no Compêndio">
                <div class="search-modal-header">
                    <svg class="search-modal-icon" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input type="text" id="searchModalInput" class="search-modal-input" placeholder="Digite para buscar em todo o compêndio..." autocomplete="off" spellcheck="false" />
                    <button type="button" id="searchModalClear" class="search-modal-clear" aria-label="Limpar campo">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    <button type="button" id="searchModalClose" class="search-modal-close" aria-label="Fechar busca">
                        <kbd>ESC</kbd>
                    </button>
                </div>
                
                <div class="search-modal-filters">
                    <button type="button" class="search-filter-chip active" data-filter="all">Todos</button>
                    <button type="button" class="search-filter-chip" data-filter="combatente">Combatente</button>
                    <button type="button" class="search-filter-chip" data-filter="especialista">Especialista</button>
                    <button type="button" class="search-filter-chip" data-filter="ocultista">Ocultista</button>
                    <button type="button" class="search-filter-chip" data-filter="rituais">Rituais</button>
                    <button type="button" class="search-filter-chip" data-filter="item">Itens &amp; Mods</button>
                    <button type="button" class="search-filter-chip" data-filter="geral">Geral &amp; Origens</button>
                </div>

                <div class="search-modal-body">
                    <div id="searchResultsList" class="search-results-list"></div>
                </div>

                <div class="search-modal-footer">
                    <div class="search-footer-hint">
                        <span class="key-hint"><kbd>&uarr;</kbd><kbd>&darr;</kbd> Navegar</span>
                        <span class="key-hint"><kbd>&crarr;</kbd> Acessar</span>
                        <span class="key-hint"><kbd>ESC</kbd> Fechar</span>
                    </div>
                    <div id="searchTotalCount" class="search-total-count">Compêndio Carregado</div>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);

        bindSearchEvents();
        renderEmptyState();
    }

    function bindSearchEvents() {
        const triggerBtn = document.getElementById('searchTriggerBtn');
        const overlay = document.getElementById('searchModalOverlay');
        const input = document.getElementById('searchModalInput');
        const clearBtn = document.getElementById('searchModalClear');
        const closeBtn = document.getElementById('searchModalClose');
        const filterChips = document.querySelectorAll('.search-filter-chip');

        // abre o modal
        function openSearchModal() {
            overlay.classList.add('active');
            input.focus();
            input.select();
        }

        // fecha o modal
        function closeSearchModal() {
            overlay.classList.remove('active');
        }

        triggerBtn.addEventListener('click', openSearchModal);
        closeBtn.addEventListener('click', closeSearchModal);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeSearchModal();
        });

        // atalhos de teclado (ctrl+k, /, esc)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                if (overlay.classList.contains('active')) {
                    closeSearchModal();
                } else {
                    openSearchModal();
                }
            } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                e.preventDefault();
                openSearchModal();
            } else if (e.key === 'Escape' && overlay.classList.contains('active')) {
                closeSearchModal();
            }
        });

        // input de busca
        input.addEventListener('input', () => {
            const q = input.value.trim();
            if (q.length > 0) {
                clearBtn.style.display = 'flex';
            } else {
                clearBtn.style.display = 'none';
            }
            performSearch(q);
        });

        clearBtn.addEventListener('click', () => {
            input.value = '';
            clearBtn.style.display = 'none';
            renderEmptyState();
            input.focus();
        });

        // navegacao por setas e enter
        input.addEventListener('keydown', (e) => {
            const items = document.querySelectorAll('.search-result-item');
            if (items.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedResultIndex = (selectedResultIndex + 1) % items.length;
                updateSelectedResult(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedResultIndex = (selectedResultIndex - 1 + items.length) % items.length;
                updateSelectedResult(items);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (items[selectedResultIndex]) {
                    items[selectedResultIndex].click();
                }
            }
        });

        // filtros de categoria
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                filterChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                currentFilterCategory = chip.dataset.filter;
                performSearch(input.value.trim());
            });
        });
    }

    function updateSelectedResult(items) {
        items.forEach((it, idx) => {
            if (idx === selectedResultIndex) {
                it.classList.add('selected');
                it.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                it.classList.remove('selected');
            }
        });
    }

    // consultas rapidas quando nao tem busca
    function renderEmptyState() {
        const resultsContainer = document.getElementById('searchResultsList');
        const countLabel = document.getElementById('searchTotalCount');
        if (!resultsContainer) return;

        countLabel.textContent = `${searchableIndex.length} itens catalogados`;

        resultsContainer.innerHTML = `
            <div class="search-empty-state">
                <div class="search-empty-title">&mdash; Consultas Rápidas &mdash;</div>
                <div class="search-empty-desc">Selecione uma consulta frequente ou digite qualquer termo:</div>
                <div class="search-quick-queries">
                    <button type="button" class="search-quick-tag" data-query="Restrição Celestial">Restrição Celestial</button>
                    <button type="button" class="search-quick-tag" data-query="Tropa de Choque">Tropa de Choque</button>
                    <button type="button" class="search-quick-tag" data-query="NEX 50%">NEX 50%</button>
                    <button type="button" class="search-quick-tag" data-query="Sangue">Sangue</button>
                    <button type="button" class="search-quick-tag" data-query="Morte">Morte</button>
                    <button type="button" class="search-quick-tag" data-query="Energia">Energia</button>
                    <button type="button" class="search-quick-tag" data-query="Potencializar">Potencializar</button>
                    <button type="button" class="search-quick-tag" data-query="Atormentado">Atormentado</button>
                    <button type="button" class="search-quick-tag" data-query="Infiltrador">Infiltrador</button>
                    <button type="button" class="search-quick-tag" data-query="Esotérico">Esotérico</button>
                </div>
            </div>
        `;

        resultsContainer.querySelectorAll('.search-quick-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const query = tag.dataset.query;
                const input = document.getElementById('searchModalInput');
                const clearBtn = document.getElementById('searchModalClear');
                if (input) {
                    input.value = query;
                    if (clearBtn) clearBtn.style.display = 'flex';
                    performSearch(query);
                    input.focus();
                }
            });
        });
    }

    // busca e pontuacao
    function performSearch(rawQuery) {
        const resultsContainer = document.getElementById('searchResultsList');
        const countLabel = document.getElementById('searchTotalCount');
        if (!resultsContainer) return;

        if (!rawQuery || rawQuery.length === 0) {
            renderEmptyState();
            return;
        }

        const query = normalizeText(rawQuery);
        const tokens = query.split(/\s+/).filter(Boolean);

        // filtra os itens
        const matches = [];

        for (let i = 0; i < searchableIndex.length; i++) {
            const item = searchableIndex[i];

            // categoria
            if (currentFilterCategory !== 'all') {
                if (currentFilterCategory === 'rituais' && item.category !== 'rituais') continue;
                if (currentFilterCategory === 'combatente' && item.category !== 'combatente') continue;
                if (currentFilterCategory === 'especialista' && item.category !== 'especialista') continue;
                if (currentFilterCategory === 'ocultista' && item.category !== 'ocultista') continue;
                if (currentFilterCategory === 'item' && item.category !== 'item') continue;
                if (currentFilterCategory === 'geral' && item.category !== 'geral') continue;
            }

            // precisa bater com todos os termos digitados
            let matchAllTokens = true;
            let score = 0;

            for (let t = 0; t < tokens.length; t++) {
                const tok = tokens[t];
                let tokenMatched = false;

                if (item.normTitle.includes(tok)) {
                    tokenMatched = true;
                    score += (item.normTitle === tok ? 100 : (item.normTitle.startsWith(tok) ? 50 : 30));
                }
                if (item.normBadge.includes(tok)) {
                    tokenMatched = true;
                    score += 25;
                }
                if (item.normTrail.includes(tok)) {
                    tokenMatched = true;
                    score += 20;
                }
                if (item.normTab.includes(tok)) {
                    tokenMatched = true;
                    score += 15;
                }
                if (item.normBody.includes(tok)) {
                    tokenMatched = true;
                    score += 10;
                }

                if (!tokenMatched) {
                    matchAllTokens = false;
                    break;
                }
            }

            if (matchAllTokens) {
                matches.push({ item, score });
            }
        }

        // ordena por score
        matches.sort((a, b) => b.score - a.score);

        // renderiza os cards
        if (matches.length === 0) {
            countLabel.textContent = '0 resultados encontrados';
            resultsContainer.innerHTML = `
                <div class="search-no-results">
                    Nenhum registro encontrado para "<strong>${escapeHtml(rawQuery)}</strong>".
                    <div style="margin-top: 8px; font-size: 0.9rem; opacity: 0.7;">Tente pesquisar por palavras-chave como NEX, nome do ritual, classe ou trilha.</div>
                </div>
            `;
            return;
        }

        countLabel.textContent = `${matches.length} ${matches.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}`;

        // limita a 40 itens pra tela nao travar
        const displayLimit = Math.min(matches.length, 40);
        let html = '';

        for (let i = 0; i < displayLimit; i++) {
            const { item } = matches[i];
            const path = item.trailName ? `${item.tabName} &rsaquo; ${item.trailName}` : item.tabName;
            const highlightedTitle = highlightMatches(item.title, tokens);
            const snippet = extractSnippet(item.body, tokens);

            html += `
                <div class="search-result-item ${i === 0 ? 'selected' : ''}" data-index="${i}" style="--item-accent: ${item.accentColor}">
                    <div class="search-item-header">
                        <span class="search-item-path">${path}</span>
                        <span class="search-item-badge">${escapeHtml(item.badge)}</span>
                    </div>
                    <div class="search-item-title">${highlightedTitle}</div>
                    ${snippet ? `<div class="search-item-snippet">${snippet}</div>` : ''}
                </div>
            `;
        }

        resultsContainer.innerHTML = html;
        selectedResultIndex = 0;

        // clique no resultado
        const resultElements = resultsContainer.querySelectorAll('.search-result-item');
        resultElements.forEach((el, idx) => {
            el.addEventListener('click', () => {
                navigateToSearchResult(matches[idx].item);
            });
        });
    }

    // vai ate o item selecionado e abre o card
    function navigateToSearchResult(item) {
        const overlay = document.getElementById('searchModalOverlay');
        if (overlay) overlay.classList.remove('active');

        // abre a aba
        if (item.tabId) {
            const navBtn = document.querySelector(`.nav-btn[data-tab="${item.tabId}"]`);
            if (navBtn && !navBtn.classList.contains('active')) {
                navBtn.click();
            }
        }

        // ativa a trilha
        if (item.trailId) {
            const subBtn = document.querySelector(`.sub-btn[data-panel="${item.trailId}"]`);
            if (subBtn && !subBtn.classList.contains('active')) {
                subBtn.click();
            }
        }

        // abre o card se tiver fechado
        const targetElement = item.element;
        if (targetElement) {
            if (targetElement.classList.contains('ability-card') && !targetElement.classList.contains('open')) {
                const header = targetElement.querySelector('.ability-header');
                if (header) window.toggleCard(header);
            }

            // abre bloco se tiver colapsado
            const parentBlock = targetElement.closest('.element-block.collapsible.collapsed');
            if (parentBlock) {
                const blockHeader = parentBlock.querySelector('.element-block-header');
                if (blockHeader) window.toggleElementBlock(blockHeader);
            }

            // scroll suave ate o item
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // pisca o card pra destacar
                targetElement.classList.remove('search-target-highlight');
                void targetElement.offsetWidth;
                targetElement.classList.add('search-target-highlight');
                setTimeout(() => {
                    targetElement.classList.remove('search-target-highlight');
                }, 2600);
            }, 80);
        }
    }

    // destaca o termo com mark
    function highlightMatches(text, tokens) {
        if (!text) return '';
        let escapedText = escapeHtml(text);
        tokens.forEach(tok => {
            if (tok.length === 0) return;
            const regex = new RegExp('(' + escapeRegExp(tok) + ')', 'gi');
            escapedText = escapedText.replace(regex, '<mark class="search-highlight">$1</mark>');
        });
        return escapedText;
    }

    // pega um trecho do texto com o termo
    function extractSnippet(text, tokens) {
        if (!text) return '';
        const norm = normalizeText(text);
        let bestIndex = -1;

        for (let i = 0; i < tokens.length; i++) {
            const idx = norm.indexOf(tokens[i]);
            if (idx !== -1 && (bestIndex === -1 || idx < bestIndex)) {
                bestIndex = idx;
            }
        }

        if (bestIndex === -1) {
            return escapeHtml(text.slice(0, 110)) + (text.length > 110 ? '...' : '');
        }

        const start = Math.max(0, bestIndex - 35);
        const end = Math.min(text.length, bestIndex + 85);
        let snippet = text.slice(start, end);

        if (start > 0) snippet = '...' + snippet;
        if (end < text.length) snippet = snippet + '...';

        return highlightMatches(snippet, tokens);
    }

    function escapeHtml(str) {
        return (str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // cores dos elementos no texto
    function applyElementColors() {
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
    }

    // init
    function init() {
        buildCompendiumIndex();
        setupSuperiorSearchSystem();
        applyElementColors();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
