export function createSnapshotName(name: string) {
  const date = new Date()
    .toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .split("/")
    .reverse()
    .join("");

  const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h24",
  });

  return `${date}_${time}_${name}`;
}
