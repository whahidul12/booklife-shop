"use client";

import { Mail, Send } from "lucide-react";
import { useNewsletter } from "../hooks/useNewsletter";

export function FooterNewsletter() {
  const { email, setEmail, isSubmitted, handleSubmit } = useNewsletter();

  return (
    <div className="space-y-3.5">
      <h3 className="text-sm font-bold tracking-wide text-gray-800">
        Subscribe Now
      </h3>

      <p className="text-xs leading-relaxed text-gray-600">
        Subscribe your email for newsletter and featured news based on your
        interest
      </p>

      <form onSubmit={handleSubmit} className="relative mt-2">
        <div className="relative flex items-center rounded-md border border-gray-200 bg-white shadow-2xs focus-within:border-gray-300">
          <Mail className="pointer-events-none absolute left-3 size-4 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Write your email here"
            required
            className="w-full bg-transparent py-2.5 pr-10 pl-9 text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Subscribe"
            className="absolute right-2.5 flex items-center justify-center text-teal-600 transition-colors hover:text-teal-700 focus:outline-none"
          >
            <Send className="size-4 rotate-12 transform fill-teal-600 text-teal-600" />
          </button>
        </div>
      </form>

      {isSubmitted && (
        <p className="pt-1 text-[11px] font-medium text-teal-600">
          ✓ Successfully subscribed to newsletter!
        </p>
      )}
    </div>
  );
}
