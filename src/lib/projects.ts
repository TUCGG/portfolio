/** order 오름차순, 같으면 id 오름차순. getCollection 순서는 보장되지 않아서 항상 이걸 거친다. */
export function sortProjects<T extends {id: string; data: {order: number}}>(entries: T[]): T[] {
  return entries.toSorted((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id));
}
