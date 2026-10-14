    async function initRatings() {
      const cards = Array.from(document.querySelectorAll('.property'));
      const ratingsStore = {};
      const vetoStore = {};
      const saveTimers = {};
      const touchedRatings = new Set();
      const touchedVetoes = new Set();
      const isRatingsSortActive = function () {
        const key = document.getElementById('sort-by')?.value;
        return key === 'rating' || key === 'neighborhood_rating' || key === 'transit_rating' || key === 'interior_rating';
      };

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
        value.textContent = Math.round(score);
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
            const storageMetric = METRIC_UI_TO_STORAGE[metric] || metric;

            (async function () {
              try {
                let error = null;
                if (score == null || !Number.isFinite(score)) {
                  const res = await checkedQuery(supabaseClient
                    .from(NOTES_CONFIG.ratingTable)
                    .delete()
                    .eq('property_slug', entry.slug)
                    .eq('rater', rater)
                    .eq('metric', storageMetric));
                  error = res.error;
                } else {
                  const res = await checkedQuery(supabaseClient
                    .from(NOTES_CONFIG.ratingTable)
                    .upsert(
                      {
                        property_slug: entry.slug,
                        rater: rater,
                        metric: storageMetric,
                        score: score,
                        updated_at: new Date().toISOString()
                      },
                      { onConflict: 'property_slug,rater,metric' }
                    ));
                  error = res.error;
                }
                if (error) throw error;
              } catch (err) {
                reportAppError('Could not save this rating.', err);
              }
            })();
          };

          const onInput = function () {
            touchedRatings.add(key);
            const score = Number(range.value);
            renderControl(control, score);
            ratingsStore[key] = score;
            updateAggregateForCard(entry.card, entry.slug, ratingsStore);
            if (saveTimers[key]) clearTimeout(saveTimers[key]);
            saveTimers[key] = setTimeout(function () {
              persist(score);
            }, 400);
          };
          const onCommit = function () {
            if (isRatingsSortActive()) sortCards();
          };

          range.addEventListener('input', onInput);
          range.addEventListener('change', onCommit);

          if (clear) {
            clear.addEventListener('click', function () {
              touchedRatings.add(key);
              range.value = '0';
              renderControl(control, null);
              delete ratingsStore[key];
              updateAggregateForCard(entry.card, entry.slug, ratingsStore);
              if (isRatingsSortActive()) sortCards();
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
            touchedVetoes.add(key);
            const next = !Boolean(vetoStore[key]);
            vetoStore[key] = next;
            btn.classList.toggle('active', next);
            updateVetoPill(entry.card, entry.slug, vetoStore);
            applyFilters();
            (async function () {
              try {
                await checkedQuery(supabaseClient
                  .from(NOTES_CONFIG.vetoTable)
                  .upsert(
                    {
                      property_slug: entry.slug,
                      rater: rater,
                      vetoed: next,
                      updated_at: new Date().toISOString()
                    },
                    { onConflict: 'property_slug,rater' }
                  ));
              } catch (err) {
                vetoStore[key] = !next;
                btn.classList.toggle('active', !next);
                updateVetoPill(entry.card, entry.slug, vetoStore);
                applyFilters();
                reportAppError('Could not save this veto.', err);
              }
            })();
          });
        });

        renderEntry(entry);
      });

      applyFilters();
      if (isRatingsSortActive()) sortCards();

      // Hydrate from Supabase after listeners are live.
      try {
        const { data } = await checkedQuery(supabaseClient
          .from(NOTES_CONFIG.ratingTable)
          .select('property_slug, rater, metric, score')
          .in('property_slug', slugs));
        (data || []).forEach(function (row) {
          const score = Number(row.score);
          if (!Number.isFinite(score)) return;
          const metric = METRIC_STORAGE_TO_UI[row.metric] || row.metric;
          const key = ratingKey(row.property_slug, row.rater, metric);
          if (!touchedRatings.has(key)) ratingsStore[key] = score;
        });
      } catch (err) {
        reportAppError('Could not load ratings.', err);
      }

      try {
        const { data } = await checkedQuery(supabaseClient
          .from(NOTES_CONFIG.vetoTable)
          .select('property_slug, rater, vetoed')
          .in('property_slug', slugs));
        (data || []).forEach(function (row) {
          const key = vetoKey(row.property_slug, row.rater);
          if (!touchedVetoes.has(key)) vetoStore[key] = row.vetoed;
        });
      } catch (err) {
        reportAppError('Could not load vetoes.', err);
      }

      entries.forEach(renderEntry);
      applyFilters();
      if (isRatingsSortActive()) sortCards();
    }
