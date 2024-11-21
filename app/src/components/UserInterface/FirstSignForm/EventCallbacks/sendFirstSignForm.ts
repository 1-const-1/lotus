export const sendFirstSignForm = (form: HTMLFormElement) => {
  fetch("/participant/form", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new FormData(form),
  })
    .then(res=> res.redirected ? window.location.href = res.url : console.log("Response is not OK!"))
    .catch(err=> console.log(err));
}