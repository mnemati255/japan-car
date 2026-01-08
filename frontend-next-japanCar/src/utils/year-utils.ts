const eras = [
  { name: '令和', start: 2019 },
  { name: '平成', start: 1989 },
];

function getJapaneseYear(year: number) {
  for (const era of eras) {
    if (year >= era.start) {
      return `${era.name} ${year - era.start + 1}`;
    }
  }
  return year;
}

export function getEraYears() {
  const years: { title: string; value: string }[] = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 1989; year--) {
    years.push({
      title: `${year} (${getJapaneseYear(year)})`,
      value: year.toString(),
    });
  }

  return years;
}
