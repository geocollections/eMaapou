export function usePortalColors() {
  return reactive({
    primary: useCssVar("--color-primary"),
    heading: useCssVar("--color-heading"),
    text: useCssVar("--color-text"),
    muted: useCssVar("--color-text-muted"),
    background: useCssVar("--color-background"),
    subtle: useCssVar("--color-surface-subtle"),
    border: useCssVar("--color-border"),
    overlay: useCssVar("--color-chart-overlay"),
  });
}
