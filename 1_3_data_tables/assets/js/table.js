function DataTable(config, data) {
  const root = document.querySelector(config.parent);
  if (!root) {
    return;
  }
  const table = document.createElement("table");
  table.classList.add("data_table");
  root.appendChild(table);

  let columnIds = []; // ordered column ids ("value" from config object) 

  if (config.columns?.length > 0) {
    setColsAmount(config.columns.length);
    head();
  }
  if (data?.length > 0) {
    setColsAmount(Object.values(data[0]).length);
    body();
  }

  function setColsAmount(amount) {
    if (columnIds.length === 0 && amount > 0) {
      table.style.setProperty("--cols-amount", amount);
    }
  }

  function head() {
    const thead = document.createElement("thead");
    thead.classList.add("data_table_head");
    table.appendChild(thead);
    const tr = createRow();
    thead.appendChild(tr);
    for (let i = 0; i < config.columns.length; i++) {
      const column = config.columns[i];
      columnIds[i] = column?.value;
      const th = document.createElement("th");
      th.classList.add("data_table_cell");
      th.innerText = column.title;
      tr.appendChild(th);
    }
  }

  function body() {
    const tbody = document.createElement("tbody");
    tbody.classList.add("data_table_body");
    for (let rowData of data) {
      const tr = createRow();
      fillRow(tr, rowData);
      tbody.append(tr);
    }
    table.appendChild(tbody);
  }

  function createRow() {
    const tr = document.createElement("tr");
    tr.classList.add("data_table_row")
    return tr;
  }

  function fillRow(tr, rowData) {
    if (columnIds.length === 0) { // table without head
      Object.values(rowData).forEach(data => addCol(tr, data));
      return;
    }
    for (let columnId of columnIds) {
      addCol(tr, rowData[columnId]);
    }
  }

  function addCol(tr, text) {
    const td = document.createElement("td");
    td.classList.add("data_table_cell")
    td.innerText = text ?? "";
    tr.appendChild(td);
  }
}

const configBase = {
  parent: '#table1',
  columns: [
    { title: 'Ім’я', value: 'name' },
    { title: 'Прізвище', value: 'surname' },
    { title: 'Вік', value: 'age' },
  ]
};

const dataBase = [
  { id: 1, name: 'Іван', surname: 'Петров', age: 25 },
  { id: 2, name: 'Марія', surname: 'Іваненко', age: 31 },
];

DataTable(configBase, dataBase);

const configEmptyBody = {
  parent: '#table2',
  columns: [
    { title: 'Ім’я', value: 'name' },
    { title: 'Вік', value: 'age' }
  ]
};

const dataEmptyBody = [];

DataTable(configEmptyBody, dataEmptyBody);

const configNoColumns = {
  parent: '#table3',
  columns: []
};

const dataNoColumns = [
  { name: 'Іван', age: 25 }
];

DataTable(configNoColumns, dataNoColumns);

const configMissingFields = {
  parent: '#table4',
  columns: [
    { title: 'Ім’я', value: 'name' },
    { title: 'Прізвище', value: 'surname' },
    { title: 'Вік', value: 'age' }
  ]
};

const dataMissingFields = [
  { name: 'Іван' },
  { surname: 'Петров' },
  { age: 40 }
];

DataTable(configMissingFields, dataMissingFields);

const configManyCols = {
  parent: '#table5',
  columns: Array.from({ length: 20 }, (_, i) => ({
    title: `Col ${i + 1}`,
    value: `col${i + 1}`
  }))
};

const dataManyCols = [
  Object.fromEntries(
    Array.from({ length: 20 }, (_, i) => [
      `col${i + 1}`,
      `Value ${i + 1}`
    ])
  )
];

DataTable(configManyCols, dataManyCols);

const configBig = {
  parent: '#table6',
  columns: [
    { title: 'ID', value: 'id' },
    { title: 'Name', value: 'name' }
  ]
};

const dataBig = Array.from({ length: 500 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`
}));

DataTable(configBig, dataBig);

const configOneCol = {
  parent: '#table7',
  columns: [
    { title: 'Name', value: 'name' }
  ]
};

const dataOneCol = [
  { name: 'Іван' },
  { name: 'Марія' },
  { name: 'Петро' }
];

DataTable(configOneCol, dataOneCol);

const configLongText = {
  parent: '#table8',
  columns: [
    { title: 'Description', value: 'desc' }
  ]
};

const dataLongText = [
  {
    desc: 'Lorem ipsum dolor sit amet '.repeat(20)
  }
];

DataTable(configLongText, dataLongText);

const configSpecial = {
  parent: '#table9',
  columns: [
    { title: 'Text', value: 'text' }
  ]
};

const dataSpecial = [
  { text: '<b>bold</b>' },
  { text: '<script>alert(1)</script>' },
  { text: 'A & B & C' }
];

DataTable(configSpecial, dataSpecial);

const configTypes = {
  parent: '#table10',
  columns: [
    { title: 'Value', value: 'value' }
  ]
};

const dataTypes = [
  { value: null },
  { value: undefined },
  { value: 0 },
  { value: false },
  { value: Number.NaN },
  { value: '' }
];

DataTable(configTypes, dataTypes);
