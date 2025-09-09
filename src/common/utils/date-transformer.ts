export function parseTimeToDate(input: string): Date {
  const regex = /^(\d+)([smhd])$/; // s = seconds, m = minutes, h = hours, d = days
  const match = input.match(regex);

  if (!match) {
    throw new Error('Invalid time format. Use like "1d", "2h", "30m", "15s".');
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  let multiplier: number;

  switch (unit) {
    case 's':
      multiplier = 1000;
      break;
    case 'm':
      multiplier = 1000 * 60;
      break;
    case 'h':
      multiplier = 1000 * 60 * 60;
      break;
    case 'd':
      multiplier = 1000 * 60 * 60 * 24;
      break;
    default:
      throw new Error('Invalid time unit');
  }

  return new Date(Date.now() + value * multiplier);
}
