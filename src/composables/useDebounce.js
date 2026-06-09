import { ref, watch } from "vue";

export const useDebounce = (source, delay = 500) => {
  const debouncedValue = ref(source.value);

  watch(source, (newValue, oldValue, onCleanup) => {
    const timer = setTimeout(() => {
      debouncedValue.value = newValue;
    }, delay);

    onCleanup(() => {
      clearTimeout(timer);
    });
  });

  return debouncedValue;
};
