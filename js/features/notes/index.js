    async function initNotes() {       const cards = Array.from(document.querySelectorAll('.property'));       const entries = cards.map((card, idx) => createNotesUI(card, getPropertySlug(card, idx + 1))).filter(Boolean); 
      const slugs = entries.map(e => e.slug);       const legacyStore = {};       try { 
        const { data } = await supabaseClient           .from(NOTES_CONFIG.table)           .select('property_slug, body') 
          .in('property_slug', slugs);         (data || []).forEach(function (row) {           legacyStore[row.property_slug] = row.body || ''; 
        });       } catch (err) {         console.error('Failed to load legacy notes from Supabase', err); 
      }       const notesStore = {};       try { 
        const { data } = await supabaseClient           .from(NOTES_CONFIG.notesByAuthorTable)           .select('property_slug, author, body') 
          .in('property_slug', slugs);         (data || []).forEach(function (row) {           if (!row.author) return; 
          notesStore[row.property_slug + '||' + row.author] = row.body || '';         });       } catch (err) { 
        console.error('Failed to load per-author notes from Supabase', err);       }       slugs.forEach(function (slug) { 
        const legacy = (legacyStore[slug] || '').trim();         const joeKey = slug + '||Joe';         if (legacy && !notesStore[joeKey]) notesStore[joeKey] = legacy; 
      });       entries.forEach(function (entry) {         const meta = entry.card.querySelector('.meta'); 
        const actions = meta ? ensureMetaActions(meta) : null;         const soldToggle = entry.panel.querySelector('.notes-sold-toggle');         const exclusiveToggle = entry.panel.querySelector('.notes-exclusive-toggle'); 
        function isSold() {           return entry.card.getAttribute('data-sold') === 'true';         } 
        function isExclusive() {           return entry.card.getAttribute('data-exclusive') === 'true';         } 
        function renderSoldPill() {           if (!meta) return;           let pill = meta.querySelector('.sold-pill'); 
          if (!isSold()) {             if (pill) pill.remove();             return; 
          }           if (!pill) {             pill = document.createElement('button'); 
            pill.type = 'button';             pill.className = 'tag sold-pill';             pill.textContent = 'Sold'; 
            pill.title = 'Mark as unsold';             pill.addEventListener('click', function () {               persistSold(false); 
            });           }           if (actions && actions.parentNode === meta) { 
            meta.insertBefore(pill, actions);           } else {             meta.appendChild(pill); 
          }         }         function renderSoldToggle() { 
          if (!soldToggle) return;           const soldHidden = isSold();           soldToggle.style.display = soldHidden ? 'none' : '';           if (exclusiveToggle) exclusiveToggle.style.marginLeft = soldHidden ? 'auto' : '';         } 
        function renderExclusivePill() {           if (!meta) return;           let pill = meta.querySelector('.exclusive-pill'); 
          if (!isExclusive()) {             if (pill) pill.remove();             return; 
          }           if (!pill) {             pill = document.createElement('button'); 
            pill.type = 'button';             pill.className = 'tag exclusive-pill';             pill.textContent = 'Exclusive'; 
            pill.title = 'Mark as non-exclusive';             pill.addEventListener('click', function () {               persistExclusive(false); 
            });           }           if (actions && actions.parentNode === meta) { 
            meta.insertBefore(pill, actions);           } else {             meta.appendChild(pill); 
          }         }         function renderExclusiveToggle() { 
          if (!exclusiveToggle) return;           exclusiveToggle.style.display = isExclusive() ? 'none' : '';         } 
        async function persistSold(nextSold) {           entry.card.setAttribute('data-sold', nextSold ? 'true' : 'false');           renderSoldPill(); 
          renderSoldToggle();           applyFilters();           try { 
            await supabaseClient               .from(NOTES_CONFIG.starTable)               .upsert( 
                { property_slug: entry.slug, sold: nextSold, updated_at: new Date().toISOString() },                 { onConflict: 'property_slug' }               ); 
          } catch (err) {             console.error('Sold save failed for', entry.slug, err);           } 
        }         async function persistExclusive(nextExclusive) {           entry.card.setAttribute('data-exclusive', nextExclusive ? 'true' : 'false'); 
          renderExclusivePill();           renderExclusiveToggle();           applyFilters(); 
          try {             await supabaseClient               .from(NOTES_CONFIG.starTable) 
              .upsert(                 { property_slug: entry.slug, exclusive: nextExclusive, updated_at: new Date().toISOString() },                 { onConflict: 'property_slug' } 
              );           } catch (err) {             console.error('Exclusive save failed for', entry.slug, err); 
          }         }         if (soldToggle) { 
          soldToggle.addEventListener('click', function () {             persistSold(true);           }); 
        }         if (exclusiveToggle) {           exclusiveToggle.addEventListener('click', function () { 
            persistExclusive(true);           });         } 
        renderSoldPill();         renderSoldToggle();         renderExclusivePill(); 
        renderExclusiveToggle();         const pills = Array.from(entry.panel.querySelectorAll('.notes-author-pill[data-author]'));         const topPills = Array.from(entry.panel.querySelectorAll('.notes-author-pill[data-author]:not(.notes-editor-pill)')); 
        const editors = Array.from(entry.panel.querySelectorAll('.notes-editor'));         const hint = entry.panel.querySelector('.notes-hint');         const saveTimers = {}; 
        function notesKey(author) {           return entry.slug + '||' + author;         } 
        function getEditor(author) {           return entry.panel.querySelector('.notes-editor[data-author="' + author + '"]');         } 
        function getInput(author) {           return entry.panel.querySelector('.notes-input[data-author="' + author + '"]');         } 
        function getTopPill(author) {           return entry.panel.querySelector('.notes-author-pill:not(.notes-editor-pill)[data-author="' + author + '"]');         } 
        function getEditorPill(author) {           return entry.panel.querySelector('.notes-editor-pill[data-author="' + author + '"]');         } 
        function hasAnyData() {           return NOTE_AUTHORS.some(function (author) {             const v = notesStore[notesKey(author)] || ''; 
            return v.trim().length > 0;           });         } 
        function isAuthorVisible(author) {           const editor = getEditor(author);           return Boolean(editor) && editor.getAttribute('aria-hidden') !== 'true'; 
        }         function anyEditorVisible() {           return NOTE_AUTHORS.some(function (author) { 
            return isAuthorVisible(author);           });         } 
        function setAuthorVisible(author, visible) {           const editor = getEditor(author);           const topPill = getTopPill(author); 
          const editorPill = getEditorPill(author);           if (!editor) return;           editor.setAttribute('aria-hidden', visible ? 'false' : 'true'); 
          if (topPill) topPill.setAttribute('data-active', visible ? 'true' : 'false');           if (editorPill) editorPill.setAttribute('data-active', visible ? 'true' : 'false');           hint.style.display = anyEditorVisible() ? 'none' : ''; 
          reorderEditors();         }         function reorderEditors() { 
          const container = entry.panel.querySelector('.notes-editors');           if (!container) return;           const ordered = NOTE_AUTHORS.slice(); 
          if (isAuthorVisible('Joe')) {             const rest = ordered.filter(function (a) { return a !== 'Joe'; });             rest.unshift('Joe'); 
            rest.forEach(function (author) {               const editor = getEditor(author);               if (editor) container.appendChild(editor); 
            });             return;           } 
          ordered.forEach(function (author) {             const editor = getEditor(author);             if (editor) container.appendChild(editor); 
          });         }         function applyPillLayout() { 
          const visibleAuthors = NOTE_AUTHORS.filter(function (author) {             return isAuthorVisible(author);           }); 
          const multiOpen = visibleAuthors.length > 1;           NOTE_AUTHORS.forEach(function (author) {             const topPill = getTopPill(author); 
            const editor = getEditor(author);             const editorPill = getEditorPill(author);             if (topPill) { 
              const hideOnTop = multiOpen && author !== 'Joe' && visibleAuthors.indexOf(author) !== -1;               topPill.style.display = hideOnTop ? 'none' : '';             } 
            if (editor) {               const head = editor.querySelector('.notes-editor-head');               if (head) head.style.display = (multiOpen && author !== 'Joe') ? '' : 'none'; 
            }             if (editorPill) {               editorPill.setAttribute('data-active', isAuthorVisible(author) ? 'true' : 'false'); 
              const v = notesStore[notesKey(author)] || '';               editorPill.setAttribute('data-has-content', v.trim() ? 'true' : 'false');             } 
          });         }         function refreshPills(applyLayout) { 
          pills.forEach(function (pill) {             const author = pill.getAttribute('data-author');             const v = notesStore[notesKey(author)] || ''; 
            pill.setAttribute('data-has-content', v.trim() ? 'true' : 'false');             pill.setAttribute('data-active', isAuthorVisible(author) ? 'true' : 'false');           }); 
          if (applyLayout !== false) applyPillLayout();         }         const defaultAuthors = NOTE_AUTHORS.filter(function (author) { 
          const v = notesStore[notesKey(author)] || '';           return v.trim().length > 0;         }); 
        if (defaultAuthors.length) {           defaultAuthors.forEach(function (author) {             setAuthorVisible(author, true); 
            const input = getInput(author);             if (input) input.value = notesStore[notesKey(author)] || '';           }); 
          entry.setExpanded(true);         } else {           editors.forEach(function (editor) { 
            editor.setAttribute('aria-hidden', 'true');           });           hint.style.display = ''; 
          entry.setExpanded(false);         }         refreshPills(true); 
        async function persistNote(author, value) {           try {             const key = notesKey(author); 
            if (value) {               const { error } = await supabaseClient                 .from(NOTES_CONFIG.notesByAuthorTable) 
                .upsert(                   { property_slug: entry.slug, author: author, body: value, updated_at: new Date().toISOString() },                   { onConflict: 'property_slug,author' } 
                );               if (error) throw error;               notesStore[key] = value; 
            } else {               const { error } = await supabaseClient                 .from(NOTES_CONFIG.notesByAuthorTable) 
                .delete()                 .eq('property_slug', entry.slug)                 .eq('author', author); 
              if (error) throw error;               delete notesStore[key];             } 
            if (author === 'Joe') {               if (value) {                 const { error } = await supabaseClient 
                  .from(NOTES_CONFIG.table)                   .upsert(                     { property_slug: entry.slug, body: value, updated_at: new Date().toISOString() }, 
                    { onConflict: 'property_slug' }                   );                 if (error) throw error; 
              } else {                 const { error } = await supabaseClient                   .from(NOTES_CONFIG.table) 
                  .delete()                   .eq('property_slug', entry.slug);                 if (error) throw error; 
              }             }           } catch (err) { 
            console.error('Notes autosave failed for', entry.slug, err);           }           refreshPills(false); 
          if (hasAnyData() || anyEditorVisible()) entry.setExpanded(true);         }         topPills.forEach(function (pill) { 
          pill.addEventListener('click', function () {             const author = pill.getAttribute('data-author');             const input = getInput(author); 
            const nextVisible = !isAuthorVisible(author);             setAuthorVisible(author, nextVisible);             if (nextVisible && input) { 
              input.value = notesStore[notesKey(author)] || '';               input.focus();             } 
            refreshPills(true);             entry.setExpanded(true);           }); 
        });         editors.forEach(function (editor) {           const pill = editor.querySelector('.notes-editor-pill'); 
          if (!pill) return;           pill.addEventListener('click', function () {             const author = pill.getAttribute('data-author'); 
            const nextVisible = !isAuthorVisible(author);             setAuthorVisible(author, nextVisible);             if (!nextVisible) { 
              const topPill = getTopPill(author);               if (topPill) topPill.style.display = '';             } 
            refreshPills(true);           });         }); 
        NOTE_AUTHORS.forEach(function (author) {           const input = getInput(author);           if (!input) return; 
          input.value = notesStore[notesKey(author)] || '';           input.addEventListener('input', function () {             const value = input.value.trim(); 
            notesStore[notesKey(author)] = value;             refreshPills(false);             if (value) entry.setExpanded(true); 
            if (saveTimers[author]) clearTimeout(saveTimers[author]);             saveTimers[author] = setTimeout(function () {               persistNote(author, value); 
            }, 500);           });         }); 
      });     } 
