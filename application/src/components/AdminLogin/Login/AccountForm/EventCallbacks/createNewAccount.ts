export const createNewAccount = (form: HTMLFormElement) => {
  fetch("/a/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new FormData(form),
  })
    .then(res=> {
      if (res.redirected) {
        window.location.href = res.url;
      } else {
        console.log("Response is not OK!");
      }
    })
    .catch(err=> console.log(err));
}