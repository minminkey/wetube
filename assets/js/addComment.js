import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");
const commentCancel = document.querySelectorAll(".jsCancel");

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const decreaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

const addComment = (comment) => {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.innerHTML = comment;
  li.appendChild(span);
  commentList.prepend(li);
  increaseNumber();
};

const removeComment = (target) => {
  // const deleteTarget = event.target.parentElement;
  const deleteTarget = target;
  deleteTarget.parentNode.removeChild(deleteTarget);
};

const sendComment = async (comment) => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment,
    },
  });
  if (response.status === 200) {
    console.log(comment);
    addComment(comment);
  }
};

const backComment = async (id) => {
  console.log(id);
  const response = await axios({
    url: `/api/${id}/comment-delete`,
    method: "POST",
    data: {
      id,
    },
  });
  if (response.status === 200) {
    decreaseNumber();
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
};

const handleCancel = (event) => {
  event.preventDefault();
  removeComment(event.target.parentElement);
  backComment(event.target.id);
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
  // console.log(commentCancel[0]);
  commentCancel.forEach(function (t) {
    t.addEventListener("click", handleCancel);
  });
}

if (addCommentForm) {
  init();
}
