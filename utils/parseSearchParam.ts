export default (search: string | null): string | null => {
  return (
    search
      ?.split(' ')
      .map((s) => {
        if (
          !s.startsWith('-') &&
          s.includes('-') &&
          !s.startsWith('"') &&
          !s.endsWith('"')
        )
          return `"${s}"`
        return s
      })
      .join(' ') ?? null
  )
}
