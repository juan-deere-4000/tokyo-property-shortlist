    async function initRatings() {
      const cards = Array.from(document.querySelectorAll('.property'));
      const ratingsStore = {};
      const vetoStore = {};
      const saveTimers = {};

      const entries = cards
        .map((card, idx) => createRatingsUI(card, getPropertySlug(card, idx + 1)))
        .filter(Boolean);
      const slugs = entries.map(function (e) { return e.slug; });

      function renderControl(control, score) {
        const value = control.querySelector('.rating-value');
        const clear = control.querySelector('.rating-clear');
        if (score == null || !Number.isFinite(score)) {
          value.textContent = '—';
          if (clear) {
            clear.style.visibility = 'hidden';
            clear.style.pointerEvents = 'none';
          }
          return;
        }
        value.textContent = score.toFixed(1);
        if (clear) {
          clear.style.visibility = 'visible';
          clear.style.pointerEvents = 'auto';
        }
      }

      function renderEntry(entry) {
        const controls = Array.from(entry.panel.querySelectorAll('.rating-control'));
        controls.forEach(function (control) {
          const rater = control.getAttribute('data-rater');
          const metric = control.getAttribute('data-metric');
          const range = control.querySelector('.rating-range');
          const key = ratingKey(entry.slug, rater, metric);
          const existing = ratingsStore[key];
          if (typeof existing === 'number' && Number.isFinite(existing)) {
            range.value = String(existing);
            renderControl(control, existing);
          } else {
            renderControl(control, null);
          }
        });
        updateAggregateForCard(entry.card, entry.slug, ratingsStore);

        const vetoButtons = Array.from(entry.panel.querySelectorAll('.veto-btn'));
        vetoButtons.forEach(function (btn) {
          const rater = btn.getAttribute('data-rater');
          const key = vetoKey(entry.slug, rater);
          btn.classList.toggle('active', Boolean(vetoStore[key]));
        });
        updateVetoPill(entry.card, entry.slug, vetoStore);
      }

      // Bind listeners immediately so controls are never inert.
      entries.forEach(function (entry) {
        const controls = Array.from(entry.panel.querySelectorAll('.rating-control'));
        controls.forEach(function (control) {
          const rater = control.getAttribute('data-rater');
          const metric = control.getAttribute('data-metric');
          const range = control.querySelector('.rating-range');
          const clear = control.querySelector('.rating-clear');
          const key = ratingKey(entry.slug, rater, metric);

          const persist = function (score) {
            if (score == null || !Number.isFinite(score)) delete ratingsStore[key];
            else ratingsStore[key] = score;

            (async function () {
              try {
                let error = null;
                if (score == null || !Number.isFinite(score)) {
                  const res = await supabaseClient
                    .from(NOTES_CONFIG.ratingTable)
                    .delete()
                    .eq('property_slug', entry.slug)
                    .eq('rater', rater)
                    .eq('metric', metric);
                  error = res.error;
                } else {
                  const res = await supabaseClient
                    .from(NOTES_CONFIG.ratingTable)
                    .upsert(
                      {
                        property_slug: entry.slug,
                        rater: rater,
                        metric: metric,
                        score: score,
                        updated_at: new Date().toISOString()
                      },
                      { onConflict: 'property_slug,rater,metric' }
                    );
                  error = res.error;
                }
                if (error) throw error;
              } catch (err) {
                console.error('Rating save failed', entry.slug, rater, metric, err);
              }
            })();
          };

          const onChange = function () {
            const score = Number(range.value);
            renderControl(control, score);
            ratingsStore[key] = score;
            updateAggregateForCard(entry.card, entry.slug, ratingsStore);
            if (saveTimers[key]) clearTimeout(saveTimers[key]);
            saveTimers[key] = setTimeout(function () {
              persist(score);
            }, 400);
          };

          range.addEventListener('input', onChange);
          range.addEventListener('change', onChange);

          if (clear) {
            clear.addEventListener('click', function () {
              range.value = '0';
              renderControl(control, null);
              delete ratingsStore[key];
              updateAggregateForCard(entry.card, entry.slug, ratingsStore);
              if (saveTimers[key]) clearTimeout(saveTimers[key]);
              saveTimers[key] = setTimeout(function () {
                persist(null);
              }, 250);
            });
          }
        });

        const vetoButtons = Array.from(entry.panel.querySelectorAll('.veto-btn'));
        vetoButtons.forEach(function (btn) {
          const rater = btn.getAttribute('data-rater');
          const key = vetoKey(entry.slug, rater);
          btn.addEventListener('click', function () {
            const next = !Boolean(vetoStore[key]);
            vetoStore[key] = next;
            btn.classList.toggle('active', next);
            updateVetoPill(entry.card, entry.slug, vetoStore);
            applyFilters();
            (async function () {
              try {
                await supabaseClient
                  .from(NOTES_CONFIG.vetoTable)
                  .upsert(
                    {
                      property_slug: entry.slug,
                      rater: rater,
                      vetoed: next,
                      updated_at: new Date().toISOString()
                    },
                    { onConflict: 'property_slug,rater' }
                  );
              } catch (err) {
                console.error('Veto save failed', entry.slug, rater, err);
              }
            })();
          });
        });

        renderEntry(entry);
      });

      applyFilters();
      if (document.getElementById('sort-by')?.value === 'score') sortCards();

      // Hydrate from Supabase after listeners are live.
      try {
        const { data } = await supabaseClient
          .from(NOTES_CONFIG.ratingTable)
          .select('property_slug, rater, metric, score')
          .in('property_slug', slugs);
        (data || []).forEach(function (row) {
          const score = Number(row.score);
          if (!Number.isFinite(score)) return;
          ratingsStore[ratingKey(row.property_slug, row.rater, row.metric)] = score;
        });
      } catch (err) {
        console.error('Failed to load ratings from Supabase', err);
      }

      try {
        const { data } = await supabaseClient
          .from(NOTES_CONFIG.vetoTable)
          .select('property_slug, rater, vetoed')
          .in('property_slug', slugs);
        (data || []).forEach(function (row) {
          vetoStore[vetoKey(row.property_slug, row.rater)] = row.vetoed;
        });
      } catch (err) {
        console.error('Failed to load vetoes from Supabase', err);
      }

      entries.forEach(renderEntry);
      applyFilters();
      if (document.getElementById('sort-by')?.value === 'score') sortCards();
    }
