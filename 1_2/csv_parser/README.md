# City Population Enricher (Functional Programming)

A CSV data processor and a text enrichment engine using Functional Programming (FP) principles in JavaScript.

## Task Overview

- Accept raw CSV content containing city names, populations, and coordinates.
- Parse and clean the data using a declarative approach.
- Identify the Top-N most populated cities.
- Return a closure-based function that searches for these city names in any input text and appends their ranking and population data.

## Technical Requirements

- No Loops or Recursion: All iterations are handled via array methods (map, filter, sort, reduce).
- Closure: Parsed data is encapsulated within the returned function to avoid redundant processing.
- Immutability: Original data sources remain unchanged throughout the transformation pipeline.
- Grammar Logic: Proper Ukrainian pluralization for population counts (person/people).

## Processing Pipeline

The useCsv function executes the following sequence:

- Split: The CSV string is divided into an array of lines.
- Filter: Comments (lines starting with #) and empty lines are removed.
- Map: String rows are converted into objects: {x, y, city, population}.
- Sort: Cities are ranked by population in descending order.
- Slice: Only the top-tier cities (default is 10) are retained.
- Reduce: The array is transformed into an associative object for O(1) lookup speed.
- Replace: The final function uses a regular expression with a callback to enrich the target text.

## Usage Example

```
const csvData = `  48.30,32.16,Кропивницький,200000,
  49.15,28.41,Вінниця,356665,
  44.38,34.33,Алушта,31440`;

const enrichText = useCsv(csvData, ",", 4, "#", 10);

const input = "Я була в таких містах як Вінниця та АЛУШТА.";
console.log(enrichText(input)); // Я була в таких містах як Вінниця (1 місце в ТОП-10 найбільших міст України, населення 356665 людей) та АЛУШТА.
```

## Preview

Live demo: [Github Pages](https://katerynakunieva.github.io/shpp-pro-frontend-base/1_2/csv_parser)
