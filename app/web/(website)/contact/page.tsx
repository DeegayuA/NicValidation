"use client";

import { useState, useEffect } from "react";
import { GlobeDemo } from "../../globe-component";
import { useSettings } from "@/components/settings-provider";
import { cn } from "@/lib/utils";


type FormDataState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

export default function Contact() {
  const { reducedMotion, fontSize, theme, accentColor } = useSettings();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Form submitted successfully!");
        setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" });
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <div className={cn("flex  flex-col md:flex-row-reverse items-start justify-center p-6 mt-[2rem] md:mt-[4rem] max-w-[1280px] mx-auto z-20 gap-6")}
      style={{ fontSize: `${fontSize / 16}rem` }}>
      {/* Left Section (Contact Us) */}
      <div className="md:w-1/4 bg-background p-4 rounded-lg shadow-md self-start">
        <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
        <p className="text-foreground">
          Contact us at{" "}
          <a href="mailto:lifesight@gmail.com" className="font-semibold" style={{ color: accentColor }}>
            lifesight@gmail.com
          </a>{" "}
          or fill out the form to share your experience with LifeSight and let us know how we can assist you.
        </p>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Feedback and Suggestions</h3>
          <p className="text-foreground mt-2">
            Your feedback helps us continually improve LifeSight App and support
            our mission in uplifting the lives of individuals with visual
            impairments.
          </p>
          <a
            href="https://forms.gle/ga8at3Nz5PSSV81C9"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold block mt-3" style={{ color: accentColor }}
          >
            Click here to access the Feedback Form for visually impaired individuals.
          </a>
        </div>

      </div>


      {/* Right Section (Get in Touch) */}
      <div className="md:w-3/4 p-8 rounded-lg shadow-md md:ml-6 self-start">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            <div className="md:col-span-1">
              <label className="block text-foreground">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className="w-full border border-primary p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-foreground">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full border border-primary p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-foreground">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@domain.com"
              className="w-full border border-primary p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-foreground">Contact Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+94 7X XXX XXXX"
              className="w-full border border-primary p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-foreground">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              maxLength={120}
              placeholder="Type your message here"
              className="w-full border border-primary p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-md transition duration-300" style={{ backgroundColor: accentColor }}
          >
            Submit
          </button>
        </form>

        <p className="text-sm mt-4">
          By contacting us, you agree to our{" "}
          <a href="/web/terms" className=" font-semibold" style={{ color: accentColor }}>
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/web/privacy" className="font-semibold" style={{ color: accentColor }}>
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
   < GlobeDemo />
      </div>

  );

}
