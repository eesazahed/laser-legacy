const copy = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => alert("Copied!"))
    .catch(() => true);
};

export default copy;
