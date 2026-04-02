// Check if a session exist or not
async function doesSessionExist() {
  if (!sessionStorage.getItem("isFirstLoad")) {
    await fetch("/session-create", {
      method: "POST",
    });
    console.log("Session has just been made");
    sessionStorage.setItem("isFirstLoad", "true");
  } else {
    console.log("session has already been set up");
  }
}
await doesSessionExist();
