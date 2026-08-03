import { computed } from "vue";
import type { ApiFailure } from "~/types/api";
import type { CurrentUserState, SessionDocument } from "~/types/auth";
import { clearSessionMarker, hasSessionMarker, markSession, parseSessionDocument, storeReturnPath } from "~/utils/auth";
import { normalizeApiError } from "~/utils/api-problem";

const MAX_TIMER_DELAY_MS = 2_147_483_647;

let activeRefresh: Promise<SessionDocument | null> | null = null;
let expiryTimer: ReturnType<typeof setTimeout> | null = null;

function storage(): Storage | null {
  return typeof sessionStorage === "undefined" ? null : sessionStorage;
}

function origin(): string {
  return typeof window === "undefined" ? "http://localhost" : window.location.origin;
}

function malformedSessionFailure(): ApiFailure {
  return {
    title: "Account status unavailable",
    detail: "The registry returned an unexpected session response. Try again.",
    errors: [],
    retryable: true,
  };
}

function clearExpiryTimer() {
  if (expiryTimer !== null) {
    clearTimeout(expiryTimer);
    expiryTimer = null;
  }
}

export function useCurrentUser() {
  const api = useRegistryApi();
  const toast = useToast();
  const state = useState<CurrentUserState>("current-user", () => ({
    status: "loading",
    session: null,
    failure: null,
    signing_out: false,
  }));

  function setEndedSession() {
    clearExpiryTimer();
    const sessionStorage = storage();
    state.value = {
      status: sessionStorage && hasSessionMarker(sessionStorage) ? "expired" : "anonymous",
      session: null,
      failure: null,
      signing_out: false,
    };
  }

  function completeAccountDeletion() {
    clearExpiryTimer();
    const sessionStorage = storage();
    if (sessionStorage) clearSessionMarker(sessionStorage);
    state.value = {
      status: "anonymous",
      session: null,
      failure: null,
      signing_out: false,
    };
  }

  function expireAt(expiresAt: string) {
    clearExpiryTimer();
    const expectedExpiry = Date.parse(expiresAt);

    const schedule = () => {
      const remaining = expectedExpiry - Date.now();
      if (remaining <= 0) {
        setEndedSession();
        return;
      }
      expiryTimer = setTimeout(schedule, Math.min(remaining, MAX_TIMER_DELAY_MS));
    };

    schedule();
  }

  async function refresh(): Promise<SessionDocument | null> {
    if (activeRefresh) return activeRefresh;

    activeRefresh = (async () => {
      if (state.value.session === null || state.value.status === "unavailable") {
        state.value.status = "loading";
      }
      state.value.failure = null;

      try {
        const response = await api.sessionGet<unknown>("/v1/auth/session");
        const session = parseSessionDocument(response);
        if (!session) {
          state.value.status = "unavailable";
          state.value.session = null;
          state.value.failure = malformedSessionFailure();
          return null;
        }

        const sessionStorage = storage();
        if (sessionStorage) markSession(sessionStorage, session.expires_at);
        if (Date.parse(session.expires_at) <= Date.now()) {
          setEndedSession();
          return null;
        }

        state.value = {
          status: "authenticated",
          session,
          failure: null,
          signing_out: false,
        };
        expireAt(session.expires_at);
        return session;
      } catch (error) {
        const failure = normalizeApiError(error);
        if (failure.problem?.code === "authentication_required") {
          setEndedSession();
          return null;
        }

        state.value.status = "unavailable";
        state.value.failure = failure;
        return null;
      } finally {
        activeRefresh = null;
      }
    })();

    return activeRefresh;
  }

  async function initialize(): Promise<SessionDocument | null> {
    if (state.value.status !== "loading") return state.value.session;
    return refresh();
  }

  async function startSignIn(returnTo: unknown = "/packages") {
    const sessionStorage = storage();
    if (sessionStorage) storeReturnPath(sessionStorage, returnTo, origin());
    return navigateTo(api.absoluteUrl("/v1/auth/github"), { external: true });
  }

  async function signOut() {
    const session = state.value.session;
    if (!session || state.value.signing_out) return;

    state.value.signing_out = true;
    state.value.failure = null;
    try {
      await api.sessionMutation<unknown>("/v1/auth/logout", "POST", session.csrf_token);
      completeAccountDeletion();
      toast.add({
        title: "Signed out",
        description: "Your registry session has ended.",
        color: "success",
        icon: "i-lucide-circle-check",
      });
    } catch (error) {
      const failure = normalizeApiError(error);
      state.value.failure = failure;
      toast.add({
        title: failure.title,
        description: failure.detail,
        color: "error",
        icon: "i-lucide-circle-alert",
      });
    } finally {
      state.value.signing_out = false;
    }
  }

  return {
    status: computed(() => state.value.status),
    session: computed(() => state.value.session),
    user: computed(() => state.value.session?.user ?? null),
    expiresAt: computed(() => state.value.session?.expires_at ?? null),
    failure: computed(() => state.value.failure),
    signingOut: computed(() => state.value.signing_out),
    initialize,
    refresh,
    startSignIn,
    signOut,
    completeAccountDeletion,
  };
}
