/**
 * Shared client behaviour for both forms.
 *
 * Progressive enhancement: the <form> has a real `action` and `method`, so a
 * no-JS submit still reaches the endpoint. This handler upgrades it to fetch
 * so errors render inline instead of on a blank page.
 *
 * Never logs field values — plan §11.1 forbids PII in client logs.
 */

interface Options {
  formId: string;
  submitId: string;
  statusId: string;
  errorsId: string;
  redirectTo: string;
}

/** Attribution captured from the URL. Non-PII only. Plan §15.3. */
function fillAttribution(form: HTMLFormElement) {
  const params = new URLSearchParams(window.location.search);
  const set = (name: string, value: string) => {
    const field = form.elements.namedItem(name);
    if (field instanceof HTMLInputElement) field.value = value.slice(0, 200);
  };

  set("landingPage", window.location.pathname);
  set("referrer", document.referrer);
  set("utmSource", params.get("utm_source") ?? "");
  set("utmMedium", params.get("utm_medium") ?? "");
  set("utmCampaign", params.get("utm_campaign") ?? "");
  set("utmContent", params.get("utm_content") ?? "");
  set("utmTerm", params.get("utm_term") ?? "");
}

export function attachFormHandler(options: Options) {
  const form = document.getElementById(
    options.formId,
  ) as HTMLFormElement | null;
  const submit = document.getElementById(
    options.submitId,
  ) as HTMLButtonElement | null;
  const status = document.getElementById(options.statusId);
  const errors = document.getElementById(options.errorsId);
  if (!form || !submit || !status || !errors) return;

  fillAttribution(form);

  let pending = false;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    // Duplicate-submit guard. Plan §11.2.
    if (pending) return;

    errors.hidden = true;
    errors.textContent = "";

    if (!form.checkValidity()) {
      errors.hidden = false;
      errors.textContent =
        "Some required details are missing or invalid. Please check the highlighted fields.";
      errors.focus();
      form.reportValidity();
      return;
    }

    pending = true;
    submit.disabled = true;
    submit.setAttribute("aria-busy", "true");
    status.textContent = "Sending…";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { accept: "application/json" },
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (response.ok && result.ok) {
        // Only redirect once the internal notification actually succeeded —
        // the endpoint returns ok:false if it did not. Plan §19.2.
        status.textContent = "Sent. Redirecting…";
        window.location.assign(options.redirectTo);
        return;
      }

      errors.hidden = false;
      errors.textContent =
        result.error ?? "Something went wrong. Please try again in a moment.";
      errors.focus();
      status.textContent = "";
    } catch {
      errors.hidden = false;
      errors.textContent =
        "The request could not be sent. Please check your connection and try again.";
      errors.focus();
      status.textContent = "";
    } finally {
      pending = false;
      submit.disabled = false;
      submit.removeAttribute("aria-busy");
      // Turnstile tokens are single-use; reset so a retry gets a fresh one.
      const turnstile = (window as { turnstile?: { reset: () => void } })
        .turnstile;
      turnstile?.reset();
    }
  });
}
