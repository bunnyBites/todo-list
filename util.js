
exports.getCurrentDay = () => {
  const currentDay = new Date();
  const options = {
    weekday: "long",
    month: "long",
    year: "numeric",
    day: "numeric",
  }
  return currentDay.toLocaleString("en-US", options);
}