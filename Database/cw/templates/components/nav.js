const navbar = `
  <style>
    nav {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color:  #72bcd4;
    }

        ul {
      list-style: none;
      margin: 0;
      padding-left: 0;
    }

    li {
      display: block;
      float: left;
      padding: 1rem;
      position: relative;
      text-decoration: none;
    }

    ul li ul {
      background: #72bcd4;
      visibility: hidden;
      opacity: 0;
      position: absolute;
      left: 0;
      display: none;
    }

    ul li:hover > ul,
    ul li ul:hover {
      visibility: visible;
      opacity: 1;
      display: block;
    }

    ul li ul li {
      clear: both;
      width: 100%;
    }

    a {
      font-weight: 700;
      margin: 0 25px;
      color: #fff;
      text-decoration: none;
    }

    a:hover {
      padding-bottom: 5px;
      box-shadow: inset 0 -2px 0 0 #fff;
    }

    a:focus  {
      padding-bottom: 5px;
      box-shadow: inset 0 -2px 0 0 #fff;
    }
  
    .focus {
      padding-bottom: 5px;
      box-shadow: inset 0 -2px 0 0 #fff;
    }
  </style>
  <header>
    <nav>
        <ul>
            <li>
            <a href="/">World</a>
            </li>
            <li>
            <a href="/continent">Continent</a>
            </li>
              <li>
            <a href="/country">Country</a>
            </li>
        </ul>
    </nav>
  </header>  `;

document.getElementById("myNav").innerHTML = navbar;

function setNavigation() {
  let current_location = location.pathname.split("/")[1];
  let menu_items = document.getElementById("myNav").getElementsByTagName("a");
  for (let i = 0, len = menu_items.length; i < len; i++) {
    if (
      current_location.length === 0 &&
      menu_items[i].getAttribute("href") === "/"
    ) {
      menu_items[i].classList.add("focus");
    } else if (menu_items[i].getAttribute("href") === "continent") {
      menu_items[i].classList.add("focus");
    } else if (menu_items[i].getAttribute("href") === "country") {
      menu_items[i].classList.add("focus");
    }
  }
}
setNavigation();
