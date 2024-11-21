export const updateJsonToken = () => {
  fetch("/token", {method: "GET"})
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

export const updateAdminJsonToken = () => {
  fetch("/token/admin", {method: "GET"})
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