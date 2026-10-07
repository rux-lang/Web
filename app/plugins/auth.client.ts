// Only the registry reads the session, so the probe waits until a visitor is
// under /packages. Asking on every page answered each anonymous docs or blog
// visit with a 401, which the browser logs as a console error.
export default defineNuxtPlugin(() => {
  const auth = useCurrentUser();
  const probe = (path: string) => {
    if (/^\/packages(\/|$)/.test(path)) void auth.initialize();
  };
  const router = useRouter();
  probe(router.currentRoute.value.path);
  router.beforeEach((to) => probe(to.path));
});
