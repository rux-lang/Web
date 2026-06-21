<script setup>
import { ref, computed, onMounted } from "vue";
import { ICONS, profileFor } from "../osProfiles.js";

// Live status is read from the Rux API at runtime. The API stores the latest
// build/test/deploy conclusion per operating system, fed by GitHub Actions
// `workflow_job` webhooks. In dev we go through the Vite proxy (see
// vite.server.proxy in config.mts) so requests stay same-origin and avoid the
// API's CORS allowlist.
const API_BASE = import.meta.env.DEV
  ? "/api/registry"
  : "https://api.rux-lang.dev";
const API_URL = `${API_BASE}/workflows`;
const REPO_ACTIONS = "https://github.com/rux-lang/Rux/actions";

const STATUS_TEXT = {
  success: "Success",
  failure: "Failed",
  skipped: "Not run",
  unknown: "Not run",
};

const STATUS_CLASS = {
  success: "",
  failure: "status-check-fail",
  skipped: "status-check-skip",
  unknown: "status-check-skip",
};

const workflows = ref([]);
const loading = ref(true);
const error = ref(null);

function toConclusion(value) {
  switch (value) {
    case "success":
      return "success";
    case "skipped":
      return "skipped";
    case null:
    case undefined:
    case "":
      return "unknown";
    default:
      // failure, cancelled, timed_out, action_required, neutral, …
      return "failure";
  }
}

function latestTimestamp(w) {
  const stamps = [w.buildCompleted, w.testCompleted, w.deployCompleted]
    .filter(Boolean)
    .sort();
  return stamps.length ? stamps[stamps.length - 1] : null;
}

// The API drives the list of operating systems; each row becomes one card,
// enriched with a logo/arch/color from the matching profile.
const platforms = computed(() =>
  workflows.value.map((w) => {
    const profile = profileFor(w.name);
    return {
      key: w.name,
      name: w.name,
      arch: profile.arch,
      color: profile.color,
      icon: ICONS[profile.icon] ?? ICONS.generic,
      runUrl: `${REPO_ACTIONS}?query=branch%3Amain`,
      build: toConclusion(w.buildConclusion),
      tests: toConclusion(w.testConclusion),
      deploy: toConclusion(w.deployConclusion),
      buildAt: w.buildCompleted,
      testsAt: w.testCompleted,
      deployAt: w.deployCompleted,
      updatedAt: latestTimestamp(w),
    };
  }),
);

function summary(stage) {
  const known = platforms.value.filter((p) => p[stage] !== "unknown");
  if (!known.length) return "N/A";
  const ok = known.filter((p) => p[stage] === "success").length;
  return `${ok}/${known.length}`;
}

const buildsSummary = computed(() => summary("build"));
const testsSummary = computed(() => summary("tests"));
const deploysSummary = computed(() => summary("deploy"));

const failingCount = computed(
  () =>
    platforms.value.filter(
      (p) =>
        p.build === "failure" ||
        p.tests === "failure" ||
        p.deploy === "failure",
    ).length,
);

const hasData = computed(() => workflows.value.length > 0);

const latestRun = computed(() => {
  const stamps = platforms.value
    .map((p) => p.updatedAt)
    .filter(Boolean)
    .sort();
  return stamps.length ? stamps[stamps.length - 1] : null;
});

const banner = computed(() => {
  if (!hasData.value) {
    return {
      state: "snapshot",
      title: "Live CI status unavailable",
      detail:
        "No workflow results have been reported yet. Open Actions to check the latest runs.",
    };
  }
  if (failingCount.value > 0) {
    const n = failingCount.value;
    return {
      state: "degraded",
      title: `${n} platform${n === 1 ? "" : "s"} reporting failures`,
      detail: `Last checked ${relativeTime(latestRun.value)} on the main branch`,
    };
  }
  return {
    state: "operational",
    title: "All monitored systems operational",
    detail: `Last checked ${relativeTime(latestRun.value)} on the main branch`,
  };
});

function relativeTime(iso) {
  if (!iso) return "recently";
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const min = Math.round(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} minute${min === 1 ? "" : "s"} ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day} day${day === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

onMounted(async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    workflows.value = await response.json();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div v-if="loading" class="status-loading">Loading live status…</div>

  <div v-else-if="error" class="status-overall is-snapshot">
    <span class="status-pulse"></span>
    <div>
      <strong>Couldn't reach the status service</strong>
      <span>{{ error }}</span>
    </div>
    <a
      href="https://github.com/rux-lang/Rux/actions?query=branch%3Amain"
      target="_blank"
      rel="noopener noreferrer"
    >
      View all runs
    </a>
  </div>

  <div v-else-if="!hasData" class="status-overall is-snapshot">
    <span class="status-pulse"></span>
    <div>
      <strong>{{ banner.title }}</strong>
      <span>{{ banner.detail }}</span>
    </div>
    <a
      href="https://github.com/rux-lang/Rux/actions?query=branch%3Amain"
      target="_blank"
      rel="noopener noreferrer"
    >
      View all runs
    </a>
  </div>

  <div v-else>
    <div class="status-summary">
      <div class="status-summary-card">
        <div class="status-summary-value">{{ platforms.length }}</div>
        <div class="status-summary-label">supported operating systems</div>
      </div>
      <div class="status-summary-card">
        <div class="status-summary-value">{{ buildsSummary }}</div>
        <div class="status-summary-label">successful compiler builds</div>
      </div>
      <div class="status-summary-card">
        <div class="status-summary-value">{{ testsSummary }}</div>
        <div class="status-summary-label">successful compiler tests</div>
      </div>
      <div class="status-summary-card">
        <div class="status-summary-value">{{ deploysSummary }}</div>
        <div class="status-summary-label">successful compiler deployments</div>
      </div>
    </div>

    <div class="status-overall" :class="`is-${banner.state}`">
      <span class="status-pulse"></span>
      <div>
        <strong>{{ banner.title }}</strong>
        <span>{{ banner.detail }}</span>
      </div>
      <a
        href="https://github.com/rux-lang/Rux/actions?query=branch%3Amain"
        target="_blank"
        rel="noopener noreferrer"
      >
        View all runs
      </a>
    </div>

    <ul class="status-legend" aria-label="Status legend">
      <li><span class="status-legend-dot is-success"></span>Success</li>
      <li><span class="status-legend-dot is-failure"></span>Failed</li>
      <li><span class="status-legend-dot is-skipped"></span>Not run</li>
    </ul>

    <h2 id="platform-matrix" tabindex="-1">Platform Matrix</h2>

    <div class="status-grid">
      <a
        v-for="p in platforms"
        :key="p.key"
        class="status-card"
        :href="p.runUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="status-card-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </span>
        <div class="status-card-head">
          <span
            class="status-os-mark"
            :style="{ color: p.color }"
            aria-hidden="true"
            v-html="p.icon"
          ></span>
          <div>
            <h3>{{ p.name }}</h3>
            <!-- <p>{{ p.arch }}</p> -->
          </div>
        </div>
        <div class="status-check" :class="STATUS_CLASS[p.build]">
          <span
            >Build<small v-if="p.buildAt">{{
              relativeTime(p.buildAt)
            }}</small></span
          >
          <strong>{{ STATUS_TEXT[p.build] }}</strong>
        </div>
        <div class="status-check" :class="STATUS_CLASS[p.tests]">
          <span
            >Tests<small v-if="p.testsAt">{{
              relativeTime(p.testsAt)
            }}</small></span
          >
          <strong>{{ STATUS_TEXT[p.tests] }}</strong>
        </div>
        <div class="status-check" :class="STATUS_CLASS[p.deploy]">
          <span
            >Deploy<small v-if="p.deployAt">{{
              relativeTime(p.deployAt)
            }}</small></span
          >
          <strong>{{ STATUS_TEXT[p.deploy] }}</strong>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.status-loading {
  padding: 2rem 0;
  color: var(--vp-c-text-2);
}

/* Stack the phase label over its elapsed-time line. */
.status-check span {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.status-check small {
  color: var(--vp-c-text-3);
  font-size: 11px;
  line-height: 1.2;
}
</style>
