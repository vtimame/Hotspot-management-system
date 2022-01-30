<template>
  <div class="admin-users-page"></div>
</template>

<script>
export default {
  layout: 'admin',
  name: 'amin-users',
  middleware: ['user-auth'],
}
</script>
