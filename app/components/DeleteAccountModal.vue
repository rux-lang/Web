<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { ApiFailure } from "~/types/api";
import type { DeleteAccountFormState } from "~/types/account";
import { deleteAccountFormErrors } from "~/utils/account";
import { normalizeApiError } from "~/utils/api-problem";

const props = defineProps<{
  open: boolean;
  githubLogin: string;
}>();

const emit = defineEmits<{
  "update:open": [open: boolean];
  deleted: [];
  "authentication-required": [];
}>();

const api = useRegistryApi();
const auth = useCurrentUser();
const state = reactive<DeleteAccountFormState>({ github_login: "" });
const failure = ref<ApiFailure | null>(null);
const fieldError = ref<string | undefined>();
const submitting = ref(false);

watch(
  () => props.open,
  (open) => {
    if (open) {
      state.github_login = "";
      failure.value = null;
      fieldError.value = undefined;
    }
  },
);

function validate(value: DeleteAccountFormState) {
  return deleteAccountFormErrors(value, props.githubLogin);
}

function setOpen(open: boolean) {
  if (!submitting.value) emit("update:open", open);
}

async function submit() {
  const session = auth.session.value;
  if (!session || submitting.value) return;

  submitting.value = true;
  failure.value = null;
  fieldError.value = undefined;
  try {
    await api.sessionMutation("/v1/account", "DELETE", session.csrf_token, {
      github_login: state.github_login,
    });
    auth.completeAccountDeletion();
    emit("update:open", false);
    emit("deleted");
  } catch (error) {
    const normalized = normalizeApiError(error);
    if (normalized.problem?.code === "authentication_required") {
      emit("authentication-required");
      return;
    }
    const confirmation = normalized.problem?.errors?.find(
      (item) => item.code === "confirmation_mismatch" && item.pointer === "/github_login",
    );
    if (confirmation) fieldError.value = confirmation.detail;
    else failure.value = normalized;
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <UModal
    :open="open"
    title="Delete registry account"
    description="This permanently removes your active registry identity and access."
    :dismissible="false"
    :close="false"
    :ui="{ footer: 'justify-end' }"
    @update:open="setOpen"
  >
    <template #body>
      <UForm id="delete-account-form" :state="state" :validate="validate" class="space-y-5" @submit="submit">
        <ApiProblemAlert v-if="failure" :failure="failure" @retry="submit" />

        <UAlert color="error" variant="subtle" icon="i-lucide-triangle-alert" title="This action cannot be undone">
          <template #description>
            <ul class="list-disc space-y-1 ps-5">
              <li>Every browser session and API token will stop working.</li>
              <li>Your namespace memberships and incoming invitations will be removed.</li>
              <li>Your GitHub identity, display name, and avatar will be anonymized.</li>
              <li>Published packages, versions, downloads, and audit history will remain intact.</li>
            </ul>
          </template>
        </UAlert>

        <p class="text-sm text-muted">
          If you sign in again later, the registry will create a new account without restoring access.
        </p>

        <UFormField
          name="github_login"
          :label="`Type ${githubLogin} to confirm`"
          description="The confirmation is case-sensitive and spaces are not ignored."
          :error="fieldError"
          required
        >
          <UInput
            v-model="state.github_login"
            class="w-full"
            autocomplete="off"
            autocapitalize="none"
            :spellcheck="false"
            :disabled="submitting"
          />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton label="Cancel" color="neutral" variant="outline" :disabled="submitting" @click="setOpen(false)" />
      <UButton
        type="submit"
        form="delete-account-form"
        label="Delete account"
        icon="i-lucide-trash-2"
        color="error"
        :loading="submitting"
        :disabled="submitting"
      />
    </template>
  </UModal>
</template>
