function setPagination(paginationId, currentPage, length) {
  const pagination = `
  <style>

  </style>

  <script defer>
    function loadPagination(){
        const paginationDiv=document.getElementById(paginationId);
    console.log(paginationDiv)
    }
  </script>

    <div class="pagination" onload="loadPagination()">
        <a href="#">&laquo;</a>
        <a href="#">1</a>
        <a href="#" class="active">2</a>
        <a href="#">3</a>
        <a href="#">4</a>
        <a href="#">5</a>
        <a href="#">6</a>
        <a href="#">&raquo;</a>
    </div>  `;

  return (document.getElementById(paginationId).innerHTML = pagination);
}
