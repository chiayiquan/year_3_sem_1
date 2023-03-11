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

  // read the file and trigger the load function
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
  // get csrf token from the like div of the post
  const csrfToken = document
    .getElementById(`${postId}-likeDiv`)
    .querySelector('[name="csrfmiddlewaretoken"]');
  // send a post request to the like-post api with postId
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
      // liked = boolean
      // likeCount = total number of like for this post
      const { liked, likeCount } = data;
      if (liked) {
        // if the user like the post, make the like button blue filling
        const likeBtn = document.getElementById(`${postId}-likeBtn`);
        const likeText = document.getElementById(`${postId}-likeText`);
        likeBtn.style.fill = "blue";
        likeText.style.color = "blue";
        // get the likeCount element and display the value of likeCount
        const numOfLikeText = document.getElementById(`${postId}-likeCount`);
        numOfLikeText.innerHTML = `Liked by <strong> ${likeCount} </strong>`;
      } else {
        // if the user un-like the liked post, make the like button to default filling
        const likeBtn = document.getElementById(`${postId}-likeBtn`);
        const likeText = document.getElementById(`${postId}-likeText`);
        const numOfLikeText = document.getElementById(`${postId}-likeCount`);
        likeBtn.style.fill = "black";
        likeText.style.color = "black";
        // if likeCount is 0, set the text to empty
        numOfLikeText.innerHTML =
          likeCount > 0 ? `Liked by <strong> ${likeCount} </strong>` : "";
      }
    });
  return false;
}

function postComment(event, postId) {
  // if the key entered is "enter" key
  if (event.keyCode === 13) {
    const comment = document.getElementById(`${postId}-commentBox`).value;

    // if comment has more than 10000 char then return
    if (comment.split("").length > 10000) {
      return false;
    }

    // get the csrf token in the comment section of the post
    const csrfToken = document
      .getElementById(`${postId}-writeCommentSection`)
      .querySelector('[name="csrfmiddlewaretoken"]');

    // send a post request to comment-post endpoint
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
        // get the comment div and add the new comment into the comment section for that post
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
              <span><b>${data.user_profile.user.first_name} ${
          data.user_profile.user.last_name
        }</b></span>
              <p class="leading-6">
                ${data.comment}
              </p>
              <p class="time">
                ${formatDate(comment.created_at)}
              </p>
            </div>
          </div>`;

        // Clear the comment text box
        document.getElementById(`${postId}-commentBox`).value = "";
        // Update the total comment value
        document.getElementById(`${postId}-totalComment`).innerHTML =
          data.num_of_comments;
      });
  }
}

function formatDate(dateString) {
  // get current datetime
  const currentDateTime = new Date();
  // JS Date can convert utc datetime to local time without the need to use additional function
  // Get the date differences
  const dateTimeDifference = currentDateTime - new Date(dateString);

  // convert the datetime difference to days,hours and minutes
  const daysDifference = Math.floor(dateTimeDifference / (1000 * 60 * 60 * 24));
  const hoursDifference = Math.floor(
    (dateTimeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutesDifference = Math.floor(
    (dateTimeDifference % (1000 * 60 * 60)) / (1000 * 60)
  );

  // if is shorter than 7 days and at least 1 day long add a d behind the string
  if (daysDifference < 7 && daysDifference > 0) return `${daysDifference} d`;
  // if is bigger than 7 days, show the datetime and convert it to locale
  else if (daysDifference > 7)
    return `${new Date(dateString).toLocaleDateString()} ${new Date(
      dateString
    ).toLocaleTimeString()}`;
  // if is at least an hour long, display the hours difference with h behind the string
  else if (hoursDifference > 0) return `${hoursDifference} h`;
  // if is at least a minute long, display the minute difference with min behind the string
  else if (minutesDifference > 0) return `${minutesDifference} min`;
  // if is less than a min just display just now
  else return "just now";
}
