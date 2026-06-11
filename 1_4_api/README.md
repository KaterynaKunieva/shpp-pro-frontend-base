# Table Builder

Generates table markup with CRUD buttons (conditionally) by Object-like config.

## Features:

- CRUD operations using API
- Client-side sorting
- High Configurability

## Usage

### Connect

To use library connect files located in:

- assets/js/table.js
- assets/css/table.css

Table generates by provided config.

### Config Examples:

1. Full version (with CRUD): input and API-url soecified in config.

```js
const config2 = {
  parent: "#productsTable",
  columns: [
    {
      title: "Назва",
      value: "title",
      input: { type: "text" },
    },
    {
      title: "Ціна",
      value: (product) => `${product.price} ${product.currency}`,
      input: [
        {
          type: "number",
          name: "price",
          label: "Ціна",
          min: 0,
          placeholder: "min is 0",
        },
        {
          type: "select",
          name: "currency",
          label: "Валюта",
          options: ["$", "€", "₴"],
          required: false,
        },
      ],
    },
    {
      title: "Колір",
      value: (product) => getColorLabel(product.color),
      input: { type: "color", name: "color" },
    },
  ],
  apiUrl: "https://mock-api.shpp.me/kkunieva/products",
};

DataTable(config2);
```

2. Without inputs: data fetched from provided URL and delete operation is supported.

```js
const config1 = {
  parent: "#usersTable",
  columns: [
    { title: "Ім’я", value: "name" },
    { title: "Прізвище", value: "surname" },
    { title: "Вік", value: (user) => getAge(user.birthday) },
    {
      title: "Фото",
      value: (user) =>
        `<img src="${user.avatar}" alt="${user.name} ${user.surname}"/>`,
    },
  ],
  apiUrl: "https://mock-api.shpp.me/kkunieva/users",
};
DataTable(config1);
```

3. No API: data can be specified statically by array of objects as second argument. No operations available.

```js
const config0 = {
  parent: "#rawTable",
  columns: [
    { title: "Ім’я", value: "name" },
    { title: "Прізвище", value: "surname" },
    { title: "Вік", value: "age" },
  ],
};
DataTable(config0, [
  { id: 30050, name: "Вася", surname: "Петров", age: 12 },
  { id: 30051, name: "Вася", surname: "Васечкін", age: 15 },
]);
```

4. Headless: columns will render in order as in provided data. No operations available.

```js
DataTable({ parent: "#headlessTable" }, [
  { id: 30050, name: "Вася", surname: "Петров", age: 12 },
  { id: 30051, name: "Вася", surname: "Васечкін", age: 15 },
]);
```

### Notes:

- column value can be a string: a key to search field in data object; and a function: is must take as argument data object and return value to be rendered;
- to enable sorting the column must have a string as a name or input with a name and sortable type (string or number)
- input can be an object or array of objects
- name of input is a key in data

## Preview

Live demo: [Github Pages](https://katerynakunieva.github.io/shpp-pro-frontend-base/1_4_api)
