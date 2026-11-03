export function sortMealsAlphabetically(meals) {
  if (!meals?.length) return []
  return [...meals].sort((a, b) =>
    a.strMeal.localeCompare(b.strMeal, undefined, { sensitivity: 'base' }),
  )
}
