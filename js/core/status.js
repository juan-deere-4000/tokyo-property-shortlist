function setAppStatus(message, isError, reloadRetry = true) {
  const status = document.getElementById('app-status');
  if (!status) return;
  status.hidden = !message;
  status.classList.toggle('error', Boolean(isError));
  status.setAttribute('role', isError ? 'alert' : 'status');
  status.querySelector('.app-status-message').textContent = message || '';
  status.querySelector('.app-retry').hidden = !isError || !reloadRetry;
}

function reportAppError(message, error) {
  console.error(message, error);
  setAppStatus(message + ' Check your connection and try again.', true, !message.includes('save'));
}

// Supabase resolves HTTP/database failures as { error }; it does not throw them.
async function checkedQuery(request) {
  // Bound transport retries too, so an unavailable project cannot leave loading forever.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  let result;
  try {
    result = await request.abortSignal(controller.signal);
  } finally {
    clearTimeout(timer);
  }
  if (result.error) throw result.error;
  return result;
}

document.querySelector('.app-retry').addEventListener('click', function () {
  window.location.reload();
});
