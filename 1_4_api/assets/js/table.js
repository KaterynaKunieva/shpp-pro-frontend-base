async function DataTable(config, data = []) {

  const context = {
    config: {
      ...config,
      columns: normalizeColumns(config.columns, data),
    },
    state: {
      data,
      sort: {
        column: null,
        direction: 1, // 1 = desc; -1 = asc;
      }
    }
  };

  let tableCreator;

  if (config.apiUrl) {
    const api = createApi(config.apiUrl);
    context.state.data = await api.fetchAll();
    context.config.columns = normalizeColumns(config.columns, context.state.data);
    const actions = useActions(api, async () => {
      context.state.data = await api.fetchAll();
      tableCreator.renderContent();
    });
    tableCreator = useTable({
      ...context,
      doCreate: (row) => actions.execute(() => api.createRow(row)),
      doUpdate: (id, row) => actions.execute(() => api.updateRow(id, row)),
      doDelete: (id) => actions.execute(() => api.deleteRow(id)),
    });
  } else {
    tableCreator = useTable({
      ...context,
    });
  }

  tableCreator.renderTable();

}

function normalizeColumns(columns, data) {

  function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }

  function getSelectOptionsFromData(select) {
    return data
      .map(line => line[select?.name])
      .filter(Boolean)
      .filter(onlyUnique);
  }

  function normalizeInput(input, column) {
    const normalized = {
      ...input,
      value: input.value ?? "",
      label: input.label ?? column?.title ?? "",
      name: input.name ?? (typeof column?.value === "string" ? column?.value : "")
    }
    if (input?.type === "select") {
      return { ...normalized, options: [...normalized.options, ...getSelectOptionsFromData(normalized)] };
    }
    return normalized;
  }

  return columns?.map(column => {
    const newCol = column;

    // input config
    const columnInput = newCol.input;
    if (columnInput) {
      if (Array.isArray(columnInput)) {
        newCol.input = columnInput.map((input) => normalizeInput(input, column));
      } else {
        newCol.input = normalizeInput(columnInput, column);
      }
    }

    // value to function
    const columnValue = newCol.value;
    if (typeof columnValue === "string") {
      newCol.value = (rowData) => rowData[columnValue];
    }

    return newCol;
  }) || [];
}

function useActions(api, reload) {
  async function execute(requestFn) {
    try {
      await requestFn();
      await reload();
    } catch (e) {
      console.error(e);
    }
  }

  return { execute };
}

function useDom() {

  function headCell(tr, text) {
    const th = document.createElement("th");
    th.classList.add("data_table_cell");
    th.innerText = text;
    tr.appendChild(th);
    return th;
  }

  function row() {
    const tr = document.createElement("tr");
    tr.classList.add("data_table_row")
    return tr;
  }

  function bodyCell(tr, content) {
    const td = document.createElement("td");
    td.classList.add("data_table_cell")
    td.innerHTML = content ?? "";
    tr.appendChild(td);
    return td;
  }

  function createForm(root, table, doCreate, inputs) {

    // toggling creation form
    const button = document.createElement("button");
    button.classList.add("data_table_add", "data_table_btn");
    button.innerText = "Add";
    button.setAttribute("formnovalidate", "");
    root.prepend(button);

    const showCreateForm = () => {
      table.classList.add("show_create_form");
      button.innerText = "Cancel";
    }

    const hideCreateForm = () => {
      table.classList.remove("show_create_form");
      button.innerText = "Add";
      table.querySelectorAll(".data_table_input").forEach(input => input.value = "");
    }

    button.addEventListener("click", () => {
      if (table.classList.contains("show_create_form")) {
        hideCreateForm();
      } else {
        showCreateForm();
      }
    });

    // row-form with creation inputs
    const form = row();
    const helper = useFormHelper(form);
    table.querySelector("tbody").prepend(form);

    // submit handler
    async function onSubmit(e) {
      e.preventDefault();
      if (!helper.validateData()) {
        return;
      }
      doCreate(helper.getBody());
      hideCreateForm();
    }

    // creation inputs
    form.classList.add("data_table_create_form");
    inputs.getColumnInputs().forEach(inputConfig => {
      const td = bodyCell(form, "");
      form.appendChild(td);
      inputs.createInputs(td, inputConfig, onSubmit);
    });

    // creation submit 
    const submit = document.createElement("button");
    submit.classList.add("data_table_btn", "data_table_submit");
    submit.setAttribute("formnovalidate", "");
    submit.innerText = "Create";
    const td = bodyCell(form, "");
    td.appendChild(submit);
    submit.addEventListener("click", (e) => {
      e.target.disabled = true;
      onSubmit(e);
      e.target.disabled = false;
    });
  }

  return {
    headCell,
    row,
    bodyCell,
    createForm,
  }
}

function useTable({ config, state, doCreate, doUpdate, doDelete }) {

  const dom = useDom();
  const sorter = createSorter();
  const inputs = inputsManager(state);
  const root = document.querySelector(config.parent);
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");

  function setColsAmount(amount) {
    const currentAmount = Number.parseInt(table.style.getPropertyValue("--cols-amount"));
    if (amount > 0 && (Number.isNaN(currentAmount) || currentAmount <= 0)) {
      if (!!doUpdate || !!doDelete) {
        table.style.setProperty("--cols-amount", amount + 1); // +1 actions
      } else {
        table.style.setProperty("--cols-amount", amount);
      }
    }
  }

  function init() {
    table.classList.add("data_table");
    tbody.classList.add("data_table_body");
    table.appendChild(tbody);
    if (!state.data || state.data?.length === 0) {
      return;
    }
    setColsAmount(Object.values(state.data[0]).length);
  }

  function renderColumns() {
    if (config.columns?.length <= 0) {
      return;
    }
    setColsAmount(config.columns.length);
    const thead = document.createElement("thead");
    thead.classList.add("data_table_head");
    table.appendChild(thead);
    const tr = dom.row();
    thead.appendChild(tr);
    config.columns.forEach(column => {
      const th = dom.headCell(tr, column?.title || "");
      const sortOption = sorter.getSortOption(column);
      if (sortOption) {
        th.classList.add("data_table_sort");
        th.onclick = () => {
          state.sort.column = sortOption;
          state.sort.direction *= -1;
          if (state.sort.direction === -1) {
            th.classList.add("desc");
            th.classList.remove("asc");
          } else {
            th.classList.remove("desc");
            th.classList.add("asc");
          }
          tr.querySelectorAll(".data_table_sort").forEach(other => {
            if (other !== th) {
              other.classList.remove("desc", "asc");
            }
          });
          renderContent();
        }
      }
      if (column?.input) {
        if (Array.isArray(column.input)) {
          column.input.forEach((input, i) => inputs.pushInput(input, i));
        }
        else {
          inputs.pushInput(column.input);
        }
      }
    });
    if (!!doUpdate || !!doDelete) {
      dom.headCell(tr, "Actions");
    }
  }

  function renderRow(tr, rowData, onSubmit) {
    if (config.columns?.length === 0) { // table without head
      Object.values(rowData).forEach(data => dom.bodyCell(tr, data));
      return;
    }
    config.columns.forEach(column => {
      // view
      const cellContent = document.createElement("p");
      cellContent.classList.add("data_table_cell_content");
      cellContent.innerHTML = column.value(rowData);
      const td = dom.bodyCell(tr, cellContent.outerHTML);

      // edit 
      if (onSubmit && column.input) {
        inputs.createInputs(td, column.input, onSubmit);
      }
    });
  }

  function renderForm() {
    // structure root > form > table
    const form = document.createElement("form");
    form.addEventListener("submit", e => e.preventDefault());
    form.appendChild(table);
    root.appendChild(form);
    if (doCreate && inputs.getColumnInputs()?.length > 0) {
      dom.createForm(root, table, doCreate, inputs);
    }
  }

  function renderTable() {
    if (!root) {
      return;
    }

    renderColumns();
    init();
    renderForm();
    renderContent();
  }

  function renderContent() {
    if (state.sort.column) {
      sorter.sort(state.data, state.sort.column, state.sort.direction);
    }
    // clean layout
    if (doCreate) {
      [...tbody.querySelectorAll(".data_table_row")].slice(1).forEach(r => r.remove());
    } else {
      [...tbody.querySelectorAll(".data_table_row")].forEach(r => r.remove());
    }
    for (let rowData of state.data) {
      const tr = dom.row();

      const actionsConfig = {};

      if (doDelete) {
        actionsConfig.doDelete = () => doDelete(rowData.id);
      }

      if (doUpdate && inputs.getColumnInputs()?.length > 0) {
        const formHelper = useFormHelper(tr);

        actionsConfig.doUpdate = () => {
          if (!formHelper.validateData()) {
            return;
          }

          doUpdate(rowData.id, formHelper.getBody());
        };

        actionsConfig.toggleEdit = (btn) => {
          tr.classList.toggle("show_edit_form");
          if (tr.classList.contains("show_edit_form")) {
            btn.innerText = "Cancel";
            tr.querySelectorAll("[name]").forEach(input => input.value = rowData[input.name]); // restore values
          } else {
            btn.innerText = "Edit";
          }
        };
      }

      renderRow(tr, rowData, actionsConfig.doUpdate);

      const actionsManager = rowActions(actionsConfig);

      if (!!doUpdate || !!doDelete) {
        const cell = dom.bodyCell(tr, "");
        cell.classList.add("data_table_actions");
        actionsManager.render(cell);
      }

      tbody.append(tr);
    }
  }

  return {
    renderTable,
    renderContent
  }

}


function inputsManager(state) {

  const columnInputs = [];

  function getColumnInputs() {
    return [...columnInputs];
  }

  function createInputs(td, inputConfig, onSubmit) {
    if (Array.isArray(inputConfig)) {
      inputConfig.forEach(subInputConfig => addInput(td, subInputConfig, onSubmit));
    } else {
      addInput(td, inputConfig, onSubmit);
    }
  }

  function addInput(td, inputConfig, onEnter) {
    const SKIP_AUTO_ATTRS = ["label", "type", "required", "options"];

    // label
    const label = document.createElement("label");
    td.appendChild(label);
    label.classList.add("data_table_label");
    const labelText = document.createElement("span");
    labelText.classList.add("data_table_label_text");
    label.appendChild(labelText);
    labelText.innerText = inputConfig?.label;

    // type
    let input;
    if (inputConfig.type === "select") {
      input = document.createElement("select");
      inputConfig.options.forEach(optionConfig => {
        const option = document.createElement("option");
        option.value = optionConfig;
        option.innerText = optionConfig;
        option.selected = optionConfig === inputConfig.value;
        input.appendChild(option);
      });
    } else {
      input = document.createElement("input");
      input.type = inputConfig.type ?? "text";
    }
    label.appendChild(input);
    input.classList.add("data_table_input");

    // required
    input.required = inputConfig.required ?? true;

    // submit
    input.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        await onEnter(e)
      }
    });

    // left attributes
    Object.entries(inputConfig).forEach(([key, value]) => {
      if (SKIP_AUTO_ATTRS.includes(key) || input[key] || input.hasAttribute(key)) return;
      input.setAttribute(key, value);
    });

    return input;
  }

  function registerInput(input, i = -1) {
    if (i === 0) {
      columnInputs.push([]);
    }
    if (i < 0 || !Array.isArray(columnInputs.at(-1))) {
      columnInputs.push(input);
    } else {
      columnInputs.at(-1).push(input);
    }
  }

  return {
    getColumnInputs,
    createInputs,
    pushInput: registerInput,
  }
}

function rowActions({ doDelete, doUpdate, toggleEdit }) {

  function renderBtn(cell, classes, text, onclick) {
    if (!onclick) {
      return null;
    }
    const btn = document.createElement("button");
    btn.classList.add("data_table_btn", ...classes);
    btn.setAttribute("formnovalidate", "");
    btn.innerText = text;
    btn.onclick = () => onclick(btn);
    cell.appendChild(btn);
    return btn;
  }

  function renderDeleteBtn(cell) {
    return renderBtn(cell, ["data_table_delete"], "Delete", function (btn) {
      btn.disabled = true;
      doDelete();
      btn.disabled = false;
    });
  }

  function renderToggleEditBtn(cell) {
    return renderBtn(cell, ["data_table_edit"], "Edit", toggleEdit);
  }

  function renderEditBtn(cell) {
    return renderBtn(cell, ["data_table_save"], "Save", (btn) => {
      btn.disabled = true;
      doUpdate();
      btn.disabled = false;
    });
  }

  function render(cell) {
    return {
      delete: renderDeleteBtn(cell),
      toggleEdit: renderToggleEditBtn(cell),
      update: renderEditBtn(cell),
    }
  }

  return {
    render,
  }
}

function useFormHelper(form) {

  function validateData() {
    return [...form.querySelectorAll(".data_table_input")].every(input => {
      let validity = true;

      validity &= input.reportValidity();

      if (validity && input.required && !input.value.trim()) {
        input.setCustomValidity("The field is required");
        validity = false;
      }
      if (validity && input.type === "number" && Number.isNaN(input.valueAsNumber)) {
        input.setCustomValidity("The field is number");
        validity = false;
      }

      return validity;
    });
  }

  function getBody() {
    const data = {};
    [...form.querySelectorAll("[name]")].forEach(input => {
      if (input.name) {
        if (input.type === "number") {
          data[input.name] = Number(input.valueAsNumber);
        } else {
          data[input.name] = input.value.trim();
        }
      }
    });
    return data;
  }

  return {
    validateData,
    getBody,
  }

}

function createApi(url) {

  async function request(promise) {
    const response = await promise;

    if (!response.ok) {
      throw new Error(`Request error: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  async function fetchAll() {
    try {
      const response = await fetch(url);
      const result = await response.json();
      return Object.entries(result?.data ?? {}).map(([key, item]) => ({ ...item, id: key }));
    } catch (e) {
      console.error(`Error fetching data: ${e}`);
      return [];
    }
  }

  async function deleteRow(id) {
    return request(fetch(`${url}/${id}`, {
      method: "DELETE",
    }));
  }

  async function createRow(rowData) {
    return request(fetch(url, {
      method: "POST",
      body: JSON.stringify(rowData),
    }));
  }

  async function updateRow(id, rowData) {
    return request(fetch(`${url}/${id}`, {
      method: "PUT",
      body: JSON.stringify(rowData),
    }));
  }

  return {
    fetchAll,
    createRow,
    updateRow,
    deleteRow,
  };

}

function createSorter() {

  const COMPARABLE_INPUT_TYPES = [
    "text",
    "number",
  ];

  function getSortOption(column) {
    let option = null;
    if (column?.input) {
      if (Array.isArray(column.input)) {
        option = column.input.find(i => COMPARABLE_INPUT_TYPES.includes(i.type.toLowerCase()))?.name;
      } else {
        option = COMPARABLE_INPUT_TYPES.includes(column.input.type.toLowerCase()) ? column.input.name : null;
      }
    }
    return option;
  }

  function sort(data, option, direction) {
    data.sort((a, b) => {
      if (a[option] > b[option]) return direction;
      else if (a[option] < b[option]) return -1 * direction;
      return 0;
    });
    direction *= -1;
  }

  return {
    getSortOption,
    sort
  }

}

export default DataTable;