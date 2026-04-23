export const getDisplayName = (name: string) => {
  const [first, last] = name.split(" ");
  const full = last ? `${first} ${last}` : first;
  return full.length > 17 ? full.slice(0, 17) + "..." : full;
};