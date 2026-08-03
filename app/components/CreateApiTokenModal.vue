<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { ApiFailure } from "~/types/api";
import type {
  ApiTokenDocument,
  ApiTokenFormState,
  IssuedApiTokenDocument,
  IssuedApiTokenResponse,
} from "~/types/token";
import { normalizeApiError } from "~/utils/api-problem";
import {
  apiTokenCustomExpirationMin,
  apiTokenExpiration,
  apiTokenFormErrors,
  tokenExpirationOptions,
  tokenScopeOptions,
} from "~/utils/token";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  "update:open": [open: boolean];
  created: [token: ApiTokenDocument];
  "authentication-required": [];
}>();

const api = useRegistryApi();
const auth = useCurrentUser();
const toast = useToast();
const state = reactive<ApiTokenFormState>({
  display_name: "",
  scopes: [],
  expiration: "90_days",
  custom_expires_at: "",
});
const failure = ref<ApiFailure | null>(null);
const fieldErrors = reactive<{
  display_name?: string;
  scopes?: string;
  expiration?: string;
  custom_expires_at?: string;
}>({});
const submitting = ref(false);
const issued = ref<IssuedApiTokenDocument | null>(null);
const copying = ref(false);
const copied = ref(false);
const copyFailure = ref(false);

const reset = () => {
  state.display_name = "";
  state.scopes = [];
  state.expiration = "90_days";
  state.custom_expires_at = "";
  failure.value = null;
  clearFieldErrors();
  issued.value = null;
  copying.value = false;
  copied.value = false;
  copyFailure.value = false;
};

watch(
  () => props.open,
  (open) => {
    if (open) reset();
    else issued.value = null;
  },
);

function clearFieldErrors() {
  fieldErrors.display_name = undefined;
  fieldErrors.scopes = undefined;
  fieldErrors.expiration = undefined;
  fieldErrors.custom_expires_at = undefined;
}

function setOpen(open: boolean) {
  if (!submitting.value && !issued.value) emit("update:open", open);
}

function setApiFieldError(failure: ApiFailure): boolean {
  const problem = failure.problem;
  const detail = problem?.errors?.[0]?.detail || failure.detail;

  switch (problem?.code) {
    case "invalid_display_name":
      fieldErrors.display_name = detail;
      return true;
    case "invalid_scopes":
      fieldErrors.scopes = detail;
      return true;
    case "invalid_expiration":
      if (state.expiration === "custom") fieldErrors.custom_expires_at = detail;
      else fieldErrors.expiration = detail;
      return true;
    default:
      return false;
  }
}

async function submit() {
  const session = auth.session.value;
  if (!session || submitting.value) return;

  submitting.value = true;
  failure.value = null;
  clearFieldErrors();

  try {
    const response = await api.sessionMutation<IssuedApiTokenResponse>("/v1/tokens", "POST", session.csrf_token, {
      display_name: state.display_name.trim(),
      scopes: [...state.scopes],
      expires_at: apiTokenExpiration(state),
    });
    issued.value = response.data;
    const { credential: _credential, ...token } = response.data;
    emit("created", token);
  } catch (error) {
    const normalized = normalizeApiError(error);
    if (normalized.problem?.code === "authentication_required") {
      emit("authentication-required");
      return;
    }
    if (!setApiFieldError(normalized)) failure.value = normalized;
  } finally {
    submitting.value = false;
  }
}

async function copyCredential() {
  if (!issued.value || copying.value) return;

  copying.value = true;
  copyFailure.value = false;
  try {
    await navigator.clipboard.writeText(issued.value.credential);
    copied.value = true;
    toast.add({
      title: "API token copied",
      description: "Store it in a secret manager before closing this window.",
      color: "success",
      icon: "i-lucide-copy-check",
    });
  } catch {
    copyFailure.value = true;
    copied.value = false;
  } finally {
    copying.value = false;
  }
}

function acknowledge() {
  issued.value = null;
  emit("update:open", false);
}
</script>

<template>
  <UModal
    :open="open"
    :title="issued ? 'Save your API token' : 'Create API token'"
    :description="
      issued
        ? 'This is the only time the complete credential will be shown.'
        : 'Create a scoped credential for the Rux CLI or automation.'
    "
    :dismissible="!submitting && !issued"
    :close="submitting || issued ? false : undefined"
    :ui="{ footer: 'justify-end' }"
    @update:open="setOpen"
  >
    <template #body>
      <div v-if="issued" class="space-y-4">
        <UAlert
          color="warning"
          variant="subtle"
          icon="i-lucide-triangle-alert"
          title="Copy this token now"
          description="Store it in a secret manager. Do not commit it to source control or share it in messages. If it is lost, revoke it and create another."
        />

        <div>
          <p class="mb-2 text-sm font-medium text-highlighted">API token</p>
          <div class="flex items-start gap-2 rounded-md bg-elevated p-2">
            <code
              class="min-w-0 flex-1 select-all break-all px-1 py-1 text-sm text-highlighted"
              aria-label="New API token credential"
              >{{ issued.credential }}</code
            >
            <UButton
              :label="copied ? 'Copied' : undefined"
              :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
              color="neutral"
              variant="outline"
              :loading="copying"
              :aria-label="copied ? 'API token copied' : 'Copy API token'"
              @click="copyCredential"
            />
          </div>
          <p class="mt-2 text-xs text-muted" aria-live="polite">
            {{ copied ? "Copied to the clipboard." : "The token remains selectable for manual copying." }}
          </p>
        </div>

        <UAlert
          v-if="copyFailure"
          color="error"
          variant="subtle"
          icon="i-lucide-circle-alert"
          title="Clipboard access was blocked"
          description="Select the complete token above and copy it manually before continuing."
        />
      </div>

      <UForm
        v-else
        id="create-api-token-form"
        :state="state"
        :validate="apiTokenFormErrors"
        class="space-y-5"
        @submit="submit"
      >
        <ApiProblemAlert v-if="failure" :failure="failure" @retry="submit" />

        <UAlert
          color="info"
          variant="subtle"
          icon="i-lucide-shield-check"
          title="Grant only the access this token needs"
          description="Use separate, short-lived tokens for each machine or workflow. Tokens act with your registry account permissions."
        />

        <UFormField
          name="display_name"
          label="Token name"
          description="Describe the machine or workflow that will use this token."
          :error="fieldErrors.display_name"
          required
        >
          <UInput
            v-model="state.display_name"
            class="w-full"
            autocomplete="off"
            placeholder="For example, release workflow"
            :disabled="submitting"
          />
        </UFormField>

        <UFormField
          name="scopes"
          label="Scopes"
          description="Select only the operations this token must perform."
          :error="fieldErrors.scopes"
          required
        >
          <UCheckboxGroup
            v-model="state.scopes"
            :items="tokenScopeOptions"
            value-key="value"
            label-key="label"
            description-key="description"
            :disabled="submitting"
          />
        </UFormField>

        <UFormField
          name="expiration"
          label="Expiration"
          description="Short-lived tokens reduce the impact of accidental disclosure."
          :error="fieldErrors.expiration"
          required
        >
          <USelect
            v-model="state.expiration"
            :items="tokenExpirationOptions"
            value-key="value"
            label-key="label"
            class="w-full"
            :disabled="submitting"
          />
        </UFormField>

        <UFormField
          v-if="state.expiration === 'custom'"
          name="custom_expires_at"
          label="Custom expiration"
          description="Enter a date and time in your current time zone. Token history is displayed in UTC."
          :error="fieldErrors.custom_expires_at"
          required
        >
          <UInput
            v-model="state.custom_expires_at"
            type="datetime-local"
            :min="apiTokenCustomExpirationMin()"
            class="w-full"
            :disabled="submitting"
          />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton v-if="issued" label="I've saved this token" icon="i-lucide-check" @click="acknowledge" />
      <template v-else>
        <UButton label="Cancel" color="neutral" variant="outline" :disabled="submitting" @click="setOpen(false)" />
        <UButton
          type="submit"
          form="create-api-token-form"
          label="Create token"
          icon="i-lucide-key-round"
          :loading="submitting"
          :disabled="submitting"
        />
      </template>
    </template>
  </UModal>
</template>
