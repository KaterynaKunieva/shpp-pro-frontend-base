import DataTable from './table.js';

function getAge(date) {
  const from = new Date(date);
  const to = new Date();

  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  return `${years}y. ${months}m.`;
}

function getColorLabel(color) {
  return `<span class="color_label" style="background-color: ${color};"></span>`
}

// no api
const config0 = {
  parent: '#rawTable',
  columns: [
    { title: 'Ім’я', value: 'name' },
    { title: 'Прізвище', value: 'surname' },
    { title: 'Вік', value: 'age' },
  ]
};
DataTable(config0, [
  { id: 30050, name: 'Вася', surname: 'Петров', age: 12 },
  { id: 30051, name: 'Вася', surname: 'Васечкін', age: 15 },
]);

// no body 
DataTable({
  parent: '#emptyTable',
  columns: [
    { title: 'Ім’я', value: 'name' },
    { title: 'Прізвище', value: 'surname' },
    { title: 'Вік', value: 'age' },
  ]
});

// no head
DataTable({ parent: '#headlessTable' }, [
  { id: 30050, name: 'Вася', surname: 'Петров', age: 12 },
  { id: 30051, name: 'Вася', surname: 'Васечкін', age: 15 },
]);

// api and no inputs (just delete btn)
const config1 = {
  parent: '#usersTable',
  columns: [
    { title: 'Ім’я', value: 'name' },
    { title: 'Прізвище', value: 'surname' },
    { title: 'Вік', value: (user) => getAge(user.birthday) },
    { title: 'Фото', value: (user) => `<img src="${user.avatar}" alt="${user.name} ${user.surname}"/>` }
  ],
  apiUrl: "https://mock-api.shpp.me/kkunieva/users"
};
DataTable(config1);

// api and CRUD operations
const config2 = {
  parent: '#productsTable',
  columns: [
    {
      title: 'Назва',
      value: 'title',
      input: { type: 'text' }
    },
    {
      title: 'Ціна',
      value: (product) => `${product.price} ${product.currency}`,
      input: [
        { type: 'number', name: 'price', label: 'Ціна', min: 0, placeholder: "min is 0" },
        { type: 'select', name: 'currency', label: 'Валюта', options: ['$', '€', '₴'], required: false }
      ]
    },
    {
      title: 'Колір',
      value: (product) => getColorLabel(product.color),
      input: { type: 'color', name: 'color' }
    },
  ],
  apiUrl: "https://mock-api.shpp.me/kkunieva/products"
};

DataTable(config2);