export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useCurrentUser();
  await auth.initialize();

  if (auth.status.value === "anonymous" || auth.status.value === "expired") {
    return navigateTo({
      path: "/packages/-/auth/sign-in",
      query: { return_to: to.fullPath },
    });
  }
});
