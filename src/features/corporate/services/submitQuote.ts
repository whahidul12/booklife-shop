export const submitQuote = async (formData: FormData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "Quote request sent successfully!" });
    }, 1000);
  });
};
