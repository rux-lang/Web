<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { ApiFailure } from "~/types/api";
import type { NamespaceResponse } from "~/types/namespace";
import { normalizeApiError } from "~/utils/api-problem";
import { namespaceNameErrors } from "~/utils/namespace";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  "update:open": [open: boolean];
  claimed: [namespace: string];
}>();

const api = useRegistryApi();
const auth = useCurrentUser();
const route = useRoute();
const state = reactive({ name: "" });
const failure = ref<ApiFailure | null>(null);
const fieldError = ref<string | undefined>();
const submitting = ref(false);

watch(
  () => props.open,
  (open) => {
    if (!open) return;
    state.name = "";
    failure.value = null;
    fieldError.value = undefined;
  },
);

function setOpen(open: boolean) {
  if (!submitting.value) emit("update:open", open);
}

async function recoverAuthentication(): Promise<boolean> {
  const session = await auth.refresh();
  if (session) return true;
  await navigateTo({
    path: "/packages/-/auth/sign-in",
    query: { return_to: route.fullPath },
  });
  return false;
}

async function submit() {
  const session = auth.session.value;
  if (!session || submitting.value) return;

  submitting.value = true;
  failure.value = null;
  fieldError.value = undefined;
  const name = state.name.trim();

  try {
    const response = await api.sessionMutation<NamespaceResponse>("/v1/namespaces", "POST", session.csrf_token, {
      name,
    });
    emit("update:open", false);
    emit("claimed", response.data.name);
  } catch (error) {
    const normalized = normalizeApiError(error);
    if (normalized.problem?.code === "authentication_required") {
      await recoverAuthentication();
      return;
    }
    if (normalized.problem?.code === "invalid_namespace") {
      fieldError.value = normalized.errors[0] || normalized.detail;
      return;
    }
    if (normalized.problem?.code === "namespace_conflict") {
      fieldError.value = "That namespace identity is already claimed.";
      return;
    }
    failure.value = normalized;
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <UModal
    :open="open"
    title="Claim a namespace"
    description="Choose the public identity used to publish packages. Spelling is preserved, while case and underscores do not create separate identities."
    :dismissible="!submitting"
    :close="submitting ? false : undefined"
    :ui="{ footer: 'justify-end' }"
    @update:open="setOpen"
  >
    <template #body>
      <UForm
        id="claim-namespace-form"
        :state="state"
        :validate="namespaceNameErrors"
        class="space-y-4"
        @submit="submit"
      >
        <ApiProblemAlert v-if="failure" :failure="failure" @retry="submit" />
        <UFormField
          name="name"
          label="Namespace name"
          description="Use 1–64 ASCII letters or digits separated by single hyphens or underscores."
          :error="fieldError"
          required
        >
          <UInput
            v-model="state.name"
            class="w-full"
            autocomplete="off"
            placeholder="For example, nickname or company"
            :disabled="submitting"
          />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton label="Cancel" color="neutral" variant="outline" :disabled="submitting" @click="setOpen(false)" />
      <UButton
        type="submit"
        form="claim-namespace-form"
        label="Claim namespace"
        icon="i-lucide-plus"
        :loading="submitting"
        :disabled="submitting"
      />
    </template>
  </UModal>
</template>
