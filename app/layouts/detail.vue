<template>
  <VApp class="flex min-h-dvh flex-col">
    <AppBar />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </VApp>
</template>
