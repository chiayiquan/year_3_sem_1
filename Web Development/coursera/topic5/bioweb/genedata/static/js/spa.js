function buildRow(key, value) {
  const tr = document.createElement("tr");
  const td_key = document.createElement("td");
  td_key.textContent = key + ":";
  tr.appendChild(td_key);
  const td_value = document.createElement("td");
  td_value.textContent = value;
  tr.appendChild(td_value);
  return tr;
}

function showGeneData(id) {
  console.log(`Retrieving Gene: ${id}`);

  const request = new XMLHttpRequest();
  const url = "/api/gene/" + id;
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status >= 200 && this.status < 400) {
      const data = JSON.parse(this.responseText);
      const dynamic_div = document.getElementById("dynamic_content");
      dynamic_div.innerHTML = "";
      const h1 = document.createElement("h1");
      h1.textContent = data.gene_id;
      dynamic_div.appendChild(h1);
      const new_table = document.createElement("table");
      const th_row = document.createElement("tr");
      const th_key = document.createElement("th");
      th_key.textContent = "Key";
      th_row.appendChild(th_key);
      const th_value = document.createElement("th");
      th_value.textContent = "Value";
      th_row.appendChild(th_value);
      new_table.appendChild(th_row);

      new_table.append(buildRow("Entity", data.entity));
      new_table.appendChild(buildRow("Entity", data.entity));
      new_table.appendChild(buildRow("Start", data.start));
      new_table.appendChild(buildRow("Stop", data.stop));
      new_table.appendChild(buildRow("Sense", data.sense));
      new_table.appendChild(buildRow("Start Codon", data.start_codon));
      new_table.appendChild(buildRow("EC Name", data.ec.ec_name));
      new_table.appendChild(
        buildRow("Sequencing Factory", data.sequencing.sequencing_factory)
      );
      new_table.appendChild(
        buildRow("Factory Location", data.sequencing.factory_location)
      );

      dynamic_div.appendChild(new_table);

      const update_record_hypertext = document.createElement("a");
      update_record_hypertext.setAttribute("href", "javascript:void(0);");
      update_record_hypertext.setAttribute(
        "onClick",
        "updateGeneData(" + id + ");"
      );
      update_record_hypertext.textContent = "UPDATE RECORD";
      dynamic_div.appendChild(update_record_hypertext);
      dynamic_div.appendChild(document.createElement("br"));
      const delete_record_hypertext = document.createElement("a");
      delete_record_hypertext.setAttribute("href", "javascript:void(0);");
      delete_record_hypertext.setAttribute(
        "onClick",
        "deleteGeneData(" + id + ");"
      );
      delete_record_hypertext.textContent = "DELETE RECORD";
      dynamic_div.appendChild(delete_record_hypertext);
    } else if (this.status > 400 || (this.status > 0 && this.status < 200)) {
      console.log(`Gene Record Request Failed: ${this.status}`);
    }
  };
  request.open("GET", url, true);
  request.send();
}

function writeGeneMenu() {
  const request = new XMLHttpRequest();
  const url = "/api/genes";
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status >= 200 && this.status < 400) {
      const data = JSON.parse(this.responseText);
      const gene_table_data = document.getElementById("gene_table");
      console.log(gene_table_data.innerHTML);
      gene_table_data.innerHTML = "";
      const new_table = document.createElement("table");
      const th_row = document.createElement("tr");
      const th = document.createElement("th");
      th.textContent = "Gene ID";
      th_row.appendChild(th);
      new_table.appendChild(th_row);

      data.forEach((gene) => {
        const hyperlink = document.createElement("a");
        hyperlink.setAttribute("href", "javascript:void(0);");
        hyperlink.setAttribute("onClick", `showGeneData(${gene.id});`);
        hyperlink.textContent = gene.gene_id;

        const td = document.createElement("td");
        const tr = document.createElement("tr");
        td.appendChild(hyperlink);
        tr.appendChild(td);
        new_table.appendChild(tr);
      });

      gene_table_data.appendChild(new_table);
    } else if (this.status > 400 || (this.status > 0 && this.status < 200)) {
      console.log(`gene list request failed: ${this.status}`);
    }
  };
  request.open("GET", url, true);
  request.send();
}

function writeInitialContent() {
  let contentHTML = "<h2>Select Gene location</h2>\n";
  contentHTML +=
    '<a href="/list/Chromosome">Chromosome</a> OR <a href="/list/Plasmid">Plasmid</a>\n';
  contentHTML += "<h2>Show Positive Chromosome</h2>\n";
  contentHTML += '<a href="/poslist/">Show This List</a>\n';
  contentHTML += "<br />\n";
  contentHTML += "<h2>Create Gene Entry</h2>\n";
  contentHTML += '<a href="/create_gene/">Add Gene Entry To DB</a>\n';
  contentHTML += "<br />\n";
  contentHTML += "<h2>Create EC Entry</h2>\n";
  contentHTML += '<a href="/create_ec/">Add EC Entry</a>\n';
  contentHTML += "<br />\n";
  let content_region = document.getElementById("dynamic_content");
  content_region.innerHTML = contentHTML;
}

function initialisePage() {
  console.log("Page Initialised");
  writeGeneMenu();
  writeInitialContent();
}
