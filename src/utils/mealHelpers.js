export function parseIngredients(meal) {
  if (!meal) return []

  const items = []
  for (let i = 1; i <= 20; i += 1) {
    const ingredient = meal[`strIngredient${i}`]?.trim()
    const measure = meal[`strMeasure${i}`]?.trim()
    if (ingredient) {
      items.push({
        ingredient,
        measure: measure || '',
      })
    }
  }
  return items
}
