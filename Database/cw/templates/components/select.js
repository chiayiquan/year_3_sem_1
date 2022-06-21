function createSelect(options, selectedValue, key, selectText) {
  const div = document.createElement("div");
  div.className = "divContainer";

  const label = document.createElement("label");
  label.setAttribute("for", key);
  label.innerHTML = `${selectText}: `;
  const selectList = document.createElement("select");
  selectList.setAttribute("id", key);

  options.forEach((option) => {
    const optionHtml = document.createElement("option");
    optionHtml.value = option.value;
    optionHtml.text = option.text;
    optionHtml.selected = selectedValue == option.value;
    selectList.appendChild(optionHtml);
  });

  div.appendChild(label);
  div.appendChild(selectList);
  return div;
}
