(async function () {
  try {
    initializeSupabase();
    createEditDialog();
    await loadPublishedProperties();
    const hasProperties = document.querySelector('.property');
    setAppStatus(hasProperties ? '' : 'No properties are currently published.');
    if (!hasProperties) return;
  } catch (error) {
    console.error('Could not load properties', error);
    setAppStatus('Could not load the shortlist. Check your connection and retry.', true);
    return;
  }

  for (const [name, initialize] of [
    ['property flags', initStarsAndFilters],
    ['notes', initNotes],
    ['ratings', initRatings]
  ]) {
    try {
      await initialize();
    } catch (error) {
      reportAppError('Could not load ' + name + '.', error);
    }
  }
  document.body.dataset.ready = 'true';
})();
