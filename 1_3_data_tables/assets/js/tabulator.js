const users = [
  { id: 30050, name: 'Вася', surname: 'Петров', age: 12 },
  { id: 30051, name: 'Вася', surname: 'Васечкін', age: 15 },
];

new Tabulator("#usersTable", {
  data: users,
  layout: "fitColumns",
  columns: [
    { title: "Ім’я", field: "name" },
    { title: "Прізвище", field: "surname" },
    { title: "Вік", field: "age" },
  ],
});