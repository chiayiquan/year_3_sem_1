// show the fileArea div when file is dragged to the textbox
function fileDrag(event) {
  const fileArea = document.getElementById("fileArea");
  fileArea.classList.remove("hidden");
}

// hide the fileArea div when the file mouse drag exit the textbox
function hideFileArea(event) {
  const fileArea = document.getElementById("fileArea");
  fileArea.classList.add("hidden");
}

function dropHandler(ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...ev.dataTransfer.items].forEach((item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        file = item.getAsFile();
        readImage(file);
      }
    });
  } else {
    // Use DataTransfer interface to access the file(s)
    [...ev.dataTransfer.files].forEach((file, i) => readImage(file));
  }

  // hide fileArea div
  const fileArea = document.getElementById("fileArea");
  fileArea.classList.add("hidden");
}

function readImage(file) {
  // create a file reader
  const reader = new FileReader();
  reader.addEventListener("load", (event) => {
    // set the base64 to a variable
    const uploadedImage = event.target.result;

    // get the imageList div
    const imageList = document.getElementById("imageList");
    // create a div with image, file name and a cross button
    const img = createImage(file, uploadedImage);
    // append the div imageList
    imageList.appendChild(img);
  });

  // read the file andtrigger the load function
  reader.readAsDataURL(file);
}

function createImage(file, uploadedImage) {
  // create a div
  const div = document.createElement("div");

  // create a img tag with the base64 loaded
  const img = new Image();
  img.src = uploadedImage;

  // create a span with the file name
  const nameSpan = document.createElement("span");
  nameSpan.id = "title";
  nameSpan.innerText = file.name;

  // create a cross button
  const deleteSpan = document.createElement("span");
  deleteSpan.innerHTML = "&#10006;";
  deleteSpan.classList.add("buttonCursor");
  deleteSpan.onclick = () => document.getElementById(file.name).remove();

  // append all the element into a div
  div.id = file.name;
  div.appendChild(img);
  div.appendChild(nameSpan);
  div.appendChild(deleteSpan);

  // return the div
  return div;
}

function submitPost(event) {
  event.preventDefault();
  // get the caption value
  const caption = document.getElementById("caption").value;
  // get the imageList div
  const images = document.getElementById("imageList");
  // get all the element with img tag
  const imgList = images.getElementsByTagName("img");

  const imageData = [];

  // loop through all the img element and get it's src(base64)
  for (img of imgList) {
    imageData.push(img.getAttribute("src"));
  }

  // send a post request to upload the post
  fetch("/api/upload-post/", {
    method: "POST",
    headers: {
      "X-CSRFToken": document.getElementsByName("csrfmiddlewaretoken")[0].value,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ caption, images: imageData }),
  }).then((data) => {
    if (data.status === 200) {
      // reset the value of caption and imageList
      document.getElementById("caption").value = "";
      document.getElementById("imageList").innerHTML = "";

      location.reload();
    }
  });
}

function likePost(event, postId) {
  const csrfToken = document
    .getElementById(`${postId}-likeDiv`)
    .querySelector('[name="csrfmiddlewaretoken"]');
  fetch("/api/like-post/", {
    method: "POST",
    headers: {
      "X-CSRFToken": csrfToken.value,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postId }),
  })
    .then((response) => response.json())
    .then(({ data }) => {
      const { liked, likeCount } = data;
      if (liked) {
        const likeBtn = document.getElementById(`${postId}-likeBtn`);
        const likeText = document.getElementById(`${postId}-likeText`);
        likeBtn.style.fill = "blue";
        likeText.style.color = "blue";
        const numOfLikeText = document.getElementById(`${postId}-likeCount`);
        numOfLikeText.innerHTML = `Liked by <strong> ${likeCount} </strong>`;
      } else {
        const likeBtn = document.getElementById(`${postId}-likeBtn`);
        const likeText = document.getElementById(`${postId}-likeText`);
        const numOfLikeText = document.getElementById(`${postId}-likeCount`);
        likeBtn.style.fill = "black";
        likeText.style.color = "black";
        numOfLikeText.innerHTML =
          likeCount > 0 ? `Liked by <strong> ${likeCount} </strong>` : "";
      }
    });
  return false;
}

function postComment(event, postId) {
  if (event.keyCode === 13) {
    const comment = document.getElementById(`${postId}-commentBox`).value;

    if (comment.split("").length > 10000) {
      return false;
    }

    const csrfToken = document
      .getElementById(`${postId}-writeCommentSection`)
      .querySelector('[name="csrfmiddlewaretoken"]');
    fetch("/api/comment-post/", {
      method: "POST",
      headers: {
        "X-CSRFToken": csrfToken.value,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, comment }),
    })
      .then((response) => response.json())
      .then(({ data }) => {
        const commentsDiv = document.getElementById(`${postId}-comments`);
        commentsDiv.innerHTML += `<div class="flex items-center">
            <div class="w-10 h-10 rounded-full relative flex-shrink-0">
              <img
                src="${data.user_profile.profile_image}"
                alt=""
                class="absolute h-full rounded-full w-full"
              />
            </div>
            <div
              class="text-gray-700 py-2 px-3 rounded-md bg-gray-100 h-full relative lg:ml-5 ml-2 lg:mr-20"
            >
              <span><b>${data.user_profile.user.first_name} ${data.user_profile.user.last_name}</b></span>
              <p class="leading-6">
                ${data.comment}
              </p>
            </div>
          </div>`;

        document.getElementById(`${postId}-commentBox`).value = "";
        document.getElementById(`${postId}-totalComment`).innerHTML =
          data.num_of_comments;
      });
  }
}

function formatDate(dateString) {
  const currentDateTime = new Date();
  const dateTimeDifference = currentDateTime - new Date(dateString);

  const daysDifference = Math.floor(dateTimeDifference / (1000 * 60 * 60 * 24));
  const hoursDifference = Math.floor(
    (dateTimeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutesDifference = Math.floor(
    (dateTimeDifference % (1000 * 60 * 60)) / (1000 * 60)
  );

  if (daysDifference < 7 && daysDifference > 0) return `${daysDifference} d`;
  else if (daysDifference > 7)
    return `${new Date(dateString).toLocaleDateString()} ${new Date(
      dateString
    ).toLocaleTimeString()}`;
  else if (hoursDifference > 0) return `${hoursDifference} h`;
  else if (minutesDifference > 0) return `${minutesDifference} min`;
  else return "just now";
}
