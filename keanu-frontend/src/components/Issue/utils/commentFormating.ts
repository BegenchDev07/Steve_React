const formatHumanReadableDate = (dateStr) => {
  const date = new Date(dateStr);
  const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
  };
  const formattedDate = date.toLocaleString("en-US");
  return formattedDate;
};

export default formatHumanReadableDate