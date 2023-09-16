export enum DateTimeFormat {
  Date,
  Time,
  DateTime,
}

export function formatDateTime(
  datetimeString: string,
  format: DateTimeFormat = DateTimeFormat.DateTime,
): string {
  const date = new Date(datetimeString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const datePart = `${year}-${month}-${day}`;
  const timePart = `${hours}:${minutes}:${seconds}`;

  switch (format) {
    case DateTimeFormat.Date:
      return datePart;
    case DateTimeFormat.Time:
      return timePart;
    case DateTimeFormat.DateTime:
      return `${datePart} ${timePart}`;
  }
}
