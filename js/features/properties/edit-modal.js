	    function createEditDialog() {
	      if (editDialog) return editDialog;
	      const dialog = document.createElement('dialog');
	      dialog.className = 'edit-dialog';
	      dialog.id = 'edit-dialog';
	      dialog.innerHTML =
	        '<form class="edit-form" id="edit-form" method="dialog">' +
	          '<div class="edit-head">Edit Published Property</div>' +
	          '<div class="edit-body">' +
	            '<div class="edit-grid">' +
	              '<div class="edit-field"><label>English Name</label><input name="title_en" required></div>' +
	              '<div class="edit-field"><label>Japanese Name</label><input name="title_ja"></div>' +
	              '<div class="edit-field"><label>Price (¥M)</label><input name="price_m" type="number" step="0.01" min="0"></div>' +
	              '<div class="edit-field"><label>Walk Min</label><input name="walk_min" type="number" step="1" min="0"></div>' +
	              '<div class="edit-field"><label>Train Min</label><input name="train_min" type="number" step="1" min="0"></div>' +
	              '<div class="edit-field"><label>Layout</label><input name="layout"></div>' +
	              '<div class="edit-field"><label>Size (m²)</label><input name="sqm" type="number" step="0.01" min="0"></div>' +
	              '<div class="edit-field"><label>Ward</label><input name="ward"></div>' +
	              '<div class="edit-field"><label>Station Name</label><input name="station_name"></div>' +
	              '<div class="edit-field"><label>Station Line</label><input name="station_line"></div>' +
	              '<div class="edit-field"><label>Display Date</label><input name="display_date"></div>' +
	              '<div class="edit-field"><label>Source URL</label><input name="source_url" type="text"></div>' +
	              '<div class="edit-field edit-field--full"><label>Google Maps URL <span class="edit-hint">(paste to auto-fill coordinates)</span></label><input name="maps_url" type="text" placeholder="https://maps.google.com/..."></div>' +
	              '<div class="edit-field"><label>Latitude</label><input name="latitude" type="number" step="any"></div>' +
	              '<div class="edit-field"><label>Longitude</label><input name="longitude" type="number" step="any"></div>' +
	            '</div>' +
	            '<details class="edit-advanced">' +
	              '<summary>Advanced (Read-only)</summary>' +
	              '<div class="edit-grid">' +
	                '<div class="edit-field"><label>External ID</label><input name="external_id" readonly></div>' +
	                '<div class="edit-field"><label>Source</label><input name="source" readonly></div>' +
	                '<div class="edit-field"><label>Source Listing ID</label><input name="source_listing_id" readonly></div>' +
	                '<div class="edit-field"><label>Status</label><input name="status" readonly></div>' +
	                '<div class="edit-field"><label>Presented At (UTC)</label><input name="presented_at" readonly></div>' +
	                '<div class="edit-field"><label>Approved At (UTC)</label><input name="approved_at" readonly></div>' +
	                '<div class="edit-field"><label>Rejected At (UTC)</label><input name="rejected_at" readonly></div>' +
	                '<div class="edit-field"><label>Published At (UTC)</label><input name="published_at" readonly></div>' +
	                '<div class="edit-field"><label>Rejection Reason</label><input name="rejection_reason" readonly></div>' +
	                '<div class="edit-field"><label>Created At (UTC)</label><input name="created_at" readonly></div>' +
	              '</div>' +
	            '</details>' +
	            '<div class="edit-msg" id="edit-msg"></div>' +
	          '</div>' +
	          '<div class="edit-actions">' +
	            '<button type="button" class="edit-cancel">Cancel</button>' +
	            '<button type="submit" class="edit-save">Save</button>' +
	          '</div>' +
	        '</form>';
	      document.body.appendChild(dialog);
	      editDialog = dialog;

	      const form = dialog.querySelector('#edit-form');
	      const msg = dialog.querySelector('#edit-msg');
	      const cancel = dialog.querySelector('.edit-cancel');
	      const save = dialog.querySelector('.edit-save');
	      cancel.addEventListener('click', function () {
	        dialog.close();
	      });

	      form.elements.maps_url.addEventListener('change', function () {
	        var val = this.value.trim();
	        var m = val.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
	               || val.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
	        if (m) {
	          form.elements.latitude.value  = m[1];
	          form.elements.longitude.value = m[2];
	        }
	      });

		      form.addEventListener('submit', async function (e) {
	        e.preventDefault();
	        msg.classList.remove('ok');
	        msg.textContent = '';
	        save.disabled = true;
		        try {
		          const externalId = form.elements.external_id.value;
		          const walkMin = parseIntOrNull(form.elements.walk_min.value);
		          const trainMin = parseIntOrNull(form.elements.train_min.value);
		          const wardClean = cleanWard(form.elements.ward.value);
		          const payload = {
		            title_en: form.elements.title_en.value.trim(),
		            title_ja: form.elements.title_ja.value.trim(),
		            price_m: parseFloatOrNull(form.elements.price_m.value),
		            walk_min: walkMin,
		            train_min: trainMin,
		            total_transit_min: walkMin != null && trainMin != null ? walkMin + trainMin : null,
		            layout: form.elements.layout.value.trim(),
		            sqm: parseFloatOrNull(form.elements.sqm.value),
		            ward: wardClean || null,
		            station_name: form.elements.station_name.value.trim(),
		            station_line: form.elements.station_line.value.trim(),
		            display_date: form.elements.display_date.value.trim(),
			            source_url: normalizeSourceUrl(form.elements.source_url.value),
		            latitude:  parseFloatOrNull(form.elements.latitude.value),
		            longitude: parseFloatOrNull(form.elements.longitude.value),
		          };
		          const { data, error } = await supabaseClient.rpc('update_published_property', {
		            p_external_id: externalId,
		            p_title_en: payload.title_en,
		            p_title_ja: payload.title_ja,
		            p_price_m: payload.price_m,
		            p_walk_min: payload.walk_min,
		            p_train_min: payload.train_min,
		            p_layout: payload.layout,
		            p_sqm: payload.sqm,
		            p_ward: payload.ward,
		            p_station_name: payload.station_name,
		            p_station_line: payload.station_line,
		            p_display_date: payload.display_date,
		            p_source_url: payload.source_url,
		            p_latitude:  payload.latitude,
		            p_longitude: payload.longitude,
		          });
		          if (error) throw error;
		          if (!data) throw new Error('Update did not match a published row');
		          updateCardDOM(externalId, payload);
		          var card = document.querySelector('[data-external-id="' + externalId + '"]');
		          if (card) {
		            card.dataset.lat = payload.latitude  != null ? String(payload.latitude)  : '';
		            card.dataset.lng = payload.longitude != null ? String(payload.longitude) : '';
		            if (typeof refreshMarker === 'function') refreshMarker(externalId);
		          }
		          msg.textContent = 'Saved';
	          msg.classList.add('ok');
	          setTimeout(function () { dialog.close(); }, 400);
	        } catch (err) {
	          msg.textContent = String(err.message || err);
	        } finally {
	          save.disabled = false;
	        }
	      });

	      if (!editHandlersBound) {
	        document.addEventListener('click', function (e) {
	          const btn = e.target.closest('.edit-btn');
	          if (!btn) return;
	          e.preventDefault();
	          const card = btn.closest('.property');
	          const externalId = btn.getAttribute('data-external-id') || card?.getAttribute('data-external-id') || '';
	          if (externalId) openEditDialog(externalId);
	        });
	        editHandlersBound = true;
	      }
	      return dialog;
	    }

	    async function openEditDialog(externalId) {
	      const dialog = createEditDialog();
	      const form = dialog.querySelector('#edit-form');
	      const msg = dialog.querySelector('#edit-msg');
	      msg.classList.remove('ok');
	      msg.textContent = '';
	      const BASE_SELECT = 'external_id,source,source_listing_id,status,title_en,title_ja,price_m,walk_min,train_min,total_transit_min,layout,sqm,ward,source_url,station_name,station_line,display_date,presented_at,approved_at,rejected_at,published_at,rejection_reason,created_at';
	      let result = await supabaseClient
	        .from('properties')
	        .select(BASE_SELECT + ',latitude,longitude')
	        .eq('external_id', externalId)
	        .single();
	      if (result.error) {
	        result = await supabaseClient
	          .from('properties')
	          .select(BASE_SELECT)
	          .eq('external_id', externalId)
	          .single();
	      }
	      const { data, error } = result;
	      if (error) {
	        console.error('openEditDialog fetch failed', error);
	        msg.textContent = error.message;
	        dialog.showModal();
	        return;
	      }
	      form.elements.title_en.value = data.title_en || '';
	      form.elements.title_ja.value = data.title_ja || '';
	      form.elements.price_m.value = data.price_m == null ? '' : data.price_m;
	      form.elements.walk_min.value = data.walk_min == null ? '' : data.walk_min;
	      form.elements.train_min.value = data.train_min == null ? '' : data.train_min;
	      form.elements.layout.value = data.layout || '';
	      form.elements.sqm.value = data.sqm == null ? '' : data.sqm;
	      form.elements.ward.value = data.ward || '';
	      form.elements.station_name.value = data.station_name || '';
	      form.elements.station_line.value = data.station_line || '';
	      form.elements.display_date.value = data.display_date || '';
	      form.elements.source_url.value = data.source_url || '';
	      form.elements.external_id.value = data.external_id || '';
	      form.elements.source.value = data.source || '';
	      form.elements.source_listing_id.value = data.source_listing_id || '';
	      form.elements.status.value = data.status || '';
	      form.elements.presented_at.value = data.presented_at || '';
	      form.elements.approved_at.value = data.approved_at || '';
	      form.elements.rejected_at.value = data.rejected_at || '';
	      form.elements.published_at.value = data.published_at || '';
	      form.elements.rejection_reason.value = data.rejection_reason || '';
	      form.elements.created_at.value = data.created_at || '';
	      form.elements.maps_url.value  = '';
	      form.elements.latitude.value  = data.latitude  == null ? '' : data.latitude;
	      form.elements.longitude.value = data.longitude == null ? '' : data.longitude;
	      dialog.showModal();
	    }
