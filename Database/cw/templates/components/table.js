function loadTable(data, columnHeader, id) {
  const table = document.getElementById(id);
  table.innerHTML = "";
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  thead.appendChild(createHeader(columnHeader));

  data.forEach((entry) => {
    tbody.appendChild(createRow(entry));
  });

  table.appendChild(thead);
  table.appendChild(tbody);
}

function createHeader(columns) {
  // header
  const header = document.createElement("tr");
  columns.forEach((column) => {
    const columnHeader = document.createElement("th");
    columnHeader.innerHTML = column;
    header.appendChild(columnHeader);
  });
  return header;
}

function createRow(data) {
  const row = document.createElement("tr");
  row.setAttribute("id", data.date);

  Object.keys(data).forEach((key) => {
    const column = document.createElement("td");
    column.innerHTML = data[key];

    row.appendChild(column);
  });

  return row;
}
