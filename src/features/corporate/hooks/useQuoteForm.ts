"use client";

import { useState, FormEvent } from "react";
import { submitQuote } from "../services/submitQuote";

export const useQuoteForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    const formData = new FormData(e.currentTarget);
    try {
      await submitQuote(formData);
      setSuccessMessage("আপনার রিকোয়েস্ট সফলভাবে পাঠানো হয়েছে!");
      e.currentTarget.reset();
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting, successMessage };
};
