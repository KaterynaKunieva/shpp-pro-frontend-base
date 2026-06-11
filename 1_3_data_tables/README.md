# DataTable Library

The goal was to implement a reusable `DataTable(config, data)` function that renders styled tables dynamically based on a configuration object and a data array. The implementation supports multiple independent tables on the same page and any number of columns.

## Preview

Live demo: [Github Pages](https://katerynakunieva.github.io/shpp-pro-frontend-base/1_3_data_tables)

## Usage

```js
const config = {
  parent: "#usersTable",
  columns: [
    { title: "Name", value: "name" },
    { title: "Age", value: "age" },
  ],
};

const data = [
  { name: "John", age: 25 },
  { name: "Jane", age: 30 },
];

DataTable(config, data);
```

## Preview

Live demo: [Github Pages](https://katerynakunieva.github.io/shpp-pro-frontend-base/1_3_data_tables)
