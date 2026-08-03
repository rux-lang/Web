<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { ApiFailure } from "~/types/api";
import type { NamespaceInvitation, NamespaceInvitationResponse, NamespaceRole } from "~/types/namespace";
import { normalizeApiError } from "~/utils/api-problem";
import { invitationErrors, namespaceApiPath, namespaceRoleOptions } from "~/utils/namespace";

const props = defineProps<{
  open: boolean;
  namespace: string;
}>();

const emit = defineEmits<{
  "update:open": [open: boolean];
  invited: [invitation: NamespaceInvitation];
  "authentication-required": [];
}>();

const api = useRegistryApi();
const auth = useCurrentUser();
const state = reactive<{ github_login: string; role: NamespaceRole }>({
  github_login: "",
  role: "maintainer",
});
const failure = ref<ApiFailure | null>(null);
const fieldError = ref<string | undefined>();
const submitting = ref(false);

watch(
  () => props.open,
  (open) => {
    if (!open) return;
    state.github_login = "";
    state.role = "maintainer";
    failure.value = null;
    fieldError.value = undefined;
  },
);

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
    const response = await api.sessionMutation<NamespaceInvitationResponse>(
      `${namespaceApiPath(props.namespace)}/invitations`,
      "POST",
      session.csrf_token,
      {
        github_login: state.github_login.trim(),
        role: state.role,
      },
    );
    emit("update:open", false);
    emit("invited", response.data);
  } catch (error) {
    const normalized = normalizeApiError(error);
    if (normalized.problem?.code === "authentication_required") {
      emit("authentication-required");
      return;
    }
    if (
      [
        "invalid_github_login",
        "user_not_found",
        "namespace_member_exists",
        "invitation_pending",
        "cannot_invite_self",
      ].includes(normalized.problem?.code ?? "")
    ) {
      fieldError.value = normalized.errors[0] || normalized.detail;
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
    title="Invite a namespace member"
    :description="`Invite an existing registry user to ${namespace}. The invitation expires after seven days.`"
    :dismissible="!submitting"
    :close="submitting ? false : undefined"
    :ui="{ footer: 'justify-end' }"
    @update:open="setOpen"
  >
    <template #body>
      <UForm
        id="invite-namespace-member-form"
        :state="state"
        :validate="invitationErrors"
        class="space-y-4"
        @submit="submit"
      >
        <ApiProblemAlert v-if="failure" :failure="failure" @retry="submit" />
        <UFormField
          name="github_login"
          label="GitHub login"
          description="The user must already have signed in to the registry."
          :error="fieldError"
          required
        >
          <UInput
            v-model="state.github_login"
            class="w-full"
            autocomplete="off"
            placeholder="octocat"
            :disabled="submitting"
          />
        </UFormField>
        <UFormField name="role" label="Role" required>
          <USelect
            v-model="state.role"
            :items="namespaceRoleOptions"
            value-key="value"
            label-key="label"
            class="w-full"
            :disabled="submitting"
          />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton label="Cancel" color="neutral" variant="outline" :disabled="submitting" @click="setOpen(false)" />
      <UButton
        type="submit"
        form="invite-namespace-member-form"
        label="Send invitation"
        icon="i-lucide-send"
        :loading="submitting"
        :disabled="submitting"
      />
    </template>
  </UModal>
</template>
