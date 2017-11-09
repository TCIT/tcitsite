export default function toInitials(name) {
  const spaceSplit = name.split(' ');
  switch (spaceSplit.length) {
    case 2:
      return spaceSplit[0][0] + spaceSplit[1][0];
    default:
      return name[0];
  }
}
