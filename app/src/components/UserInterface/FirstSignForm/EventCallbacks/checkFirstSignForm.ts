export const checkFirstSignForm = () => {
  fetch("/participant/form", {method: "GET"})
    .then(res=> {
      if (res.redirected) {
        window.location.href = res.url;
      } else if (res.ok) {
        console.log("Response is OK!");
      } else {
        console.log("Response is not OK!");
      }
    })
    .catch(err=> console.log(err));
}