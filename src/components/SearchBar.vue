<template>
  <input type="text" :value="modelValue" placeholder="Search movie title..."
    class="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
    @input="$emit('update:modelValue', $event.target.value)" />

  <!-- <button type="submit" :disabled="loading || !modelValue.trim()"
      class="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-700">
      {{ loading ? 'searching' : 'search' }}
    </button> -->

</template>
<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  }
})

// const emit = defineEmits(['update:modelValue', 'search'])

</script>
