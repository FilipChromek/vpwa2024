import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';

export function useAppVisibility() {
  const $q = useQuasar();
  const isVisible = ref($q.appVisible);

  watch(
    () => $q.appVisible,
    (newVisibility) => {
      isVisible.value = newVisibility;
    }
  );

  return {
    isVisible,
  };
}
