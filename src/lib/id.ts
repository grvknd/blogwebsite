
export async function nextNumericId(resourceUrl: string): Promise<number> {
  const res = await fetch(resourceUrl);
  if (!res.ok) throw new Error(`GET ${resourceUrl} failed: ${res.status}`);
  const list = (await res.json()) as Array<{ id: number }>;
  const max = list.reduce((m, item) => (item.id > m ? item.id : m), 0);
  return max + 1;
}


export function makeStringId(prefix = ""): string {
  const rand = Math.random().toString(36).slice(2, 8);
  const ts = Date.now().toString(36);
  return `${prefix}${ts}${rand}`;
}