<script setup lang="ts">
/**
 * The playground's action bar.
 *
 * Presentational: it owns no source, no request and no result. The example
 * gallery arrives as a prop so the starter programs stay data in
 * `~/utils/playground-examples`, and the three actions collapse to one
 * `submit` event carrying the mode the page should post.
 *
 * Only the action in flight spins; the other two disable, because the page runs
 * one request at a time and a second click would abort the first.
 */
import { computed } from "vue";
import type { PlaygroundExample, PlaygroundMode, PlaygroundProfile } from "~/types/playground";

const props = withDefaults(
  defineProps<{
    examples: PlaygroundExample[];
    pending?: PlaygroundMode | null;
    disabled?: boolean;
  }>(),
  {
    pending: null,
    disabled: false,
  },
);

const emit = defineEmits<{ submit: [mode: PlaygroundMode] }>();

const profile = defineModel<PlaygroundProfile>("profile", { required: true });
const example = defineModel<string>("example", { required: true });

const busy = computed(() => props.pending !== null);
const blocked = computed(() => props.disabled || busy.value);
const release = computed({
  get: () => profile.value === "release",
  set: (value: boolean) => {
    profile.value = value ? "release" : "debug";
  },
});
const selected = computed(() => props.examples.find((item) => item.value === example.value) ?? null);

function submit(mode: PlaygroundMode) {
  if (blocked.value) return;
  emit("submit", mode);
}
</script>

<template>
  <!-- role="group" rather than role="toolbar": a toolbar owes the reader
       arrow-key navigation between its controls, and these are plain tab stops. -->
  <div
    role="group"
    aria-label="Playground actions"
    class="border-default bg-default flex flex-wrap items-center gap-2 rounded-md border p-2"
  >
    <USelect
      v-model="example"
      :items="examples"
      :icon="selected?.icon"
      :disabled="busy"
      placeholder="Choose an example"
      aria-label="Example program"
      class="w-full sm:w-52"
    />

    <USwitch
      v-model="release"
      :disabled="busy"
      label="Release"
      aria-label="Compile with the release profile"
      class="sm:ms-2"
    />

    <div class="ms-auto flex items-center gap-2">
      <UButton
        label="Format"
        icon="i-lucide-align-left"
        color="neutral"
        variant="ghost"
        :loading="pending === 'fmt'"
        :disabled="blocked"
        @click="submit('fmt')"
      />
      <UButton
        label="Build"
        icon="i-lucide-hammer"
        color="neutral"
        variant="subtle"
        :loading="pending === 'build'"
        :disabled="blocked"
        @click="submit('build')"
      />
      <UTooltip text="Ctrl or Cmd + Enter">
        <UButton
          label="Run"
          icon="i-lucide-play"
          color="primary"
          :loading="pending === 'run'"
          :disabled="blocked"
          @click="submit('run')"
        />
      </UTooltip>
    </div>
  </div>
</template>
