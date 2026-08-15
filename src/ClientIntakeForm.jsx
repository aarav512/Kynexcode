import { useState } from "react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xljrwgjo";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  occupation: "",
  company: "",
  annualIncome: "",
  serviceRequested: "",
  preferredContact: "",
  bestTime: "",
  referredBy: "",
  message: "",
  agreeTerms: false,
};

const FIELD_LABELS = {
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  phone: "Phone",
  dateOfBirth: "Date of Birth",
  gender: "Gender",
  address: "Address",
  city: "City",
  state: "State / Province",
  zip: "ZIP / Postal Code",
  occupation: "Occupation",
  company: "Company",
  annualIncome: "Annual Income",
  serviceRequested: "Service Requested",
  preferredContact: "Preferred Contact Method",
  bestTime: "Best Time to Reach You",
  referredBy: "Referred By",
  message: "Additional Information",
};

export default function ClientIntakeForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (status === "error") setStatus("idle");
  }

  function validate() {
    const errs = {};
    const required = ["firstName", "lastName", "email", "phone", "serviceRequested", "agreeTerms"];
    for (const field of required) {
      if (field === "agreeTerms") {
        if (!form.agreeTerms) errs.agreeTerms = "You must agree to the terms to continue.";
      } else if (!form[field] || !form[field].trim()) {
        errs[field] = `${FIELD_LABELS[field]} is required.`;
      }
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (form.phone && form.phone.replace(/\D/g, "").length < 7) {
      errs.phone = "Please enter a valid phone number.";
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setStatus("idle");
      return;
    }

    setStatus("submitting");
    setErrors({});

    try {
      const payload = { ...form, agreeTerms: form.agreeTerms ? "Yes" : "No" };
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus("success");
        setForm(INITIAL_FORM);
      } else {
        const data = await response.json().catch(() => ({}));
        setStatus("error");
        if (data?.errors) {
          const fieldErrors = {};
          for (const err of data.errors) {
            if (err.field && err.message) {
              fieldErrors[err.field] = err.message;
            }
          }
          if (Object.keys(fieldErrors).length > 0) setErrors(fieldErrors);
        }
      }
    } catch (err) {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="form-card success-card">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h2>Thank you!</h2>
        <p>
          Your intake form has been submitted successfully. We'll review your
          information and get back to you within 1–2 business days.
        </p>
        <button className="btn btn-secondary" onClick={() => { setStatus("idle"); setErrors({}); }}>
          Submit another form
        </button>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      {status === "error" && (
        <div className="alert alert-error">
          Something went wrong while submitting. Please check the form and try
          again.
        </div>
      )}

      {/* Personal Information */}
      <section className="form-section">
        <h3 className="section-title">Personal Information</h3>
        <div className="field-grid">
          <Field
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
          />
          <Field
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
          />
          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <Field
            label="Phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
            required
          />
          <Field
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange}
          />
          <SelectField
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            options={["", "Male", "Female", "Non-binary", "Prefer not to say"]}
          />
        </div>
      </section>

      {/* Address */}
      <section className="form-section">
        <h3 className="section-title">Address</h3>
        <div className="field-grid">
          <Field
            label="Street Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            full
          />
          <Field
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
          />
          <Field
            label="State / Province"
            name="state"
            value={form.state}
            onChange={handleChange}
          />
          <Field
            label="ZIP / Postal Code"
            name="zip"
            value={form.zip}
            onChange={handleChange}
          />
        </div>
      </section>

      {/* Professional Information */}
      <section className="form-section">
        <h3 className="section-title">Professional Information</h3>
        <div className="field-grid">
          <Field
            label="Occupation"
            name="occupation"
            value={form.occupation}
            onChange={handleChange}
          />
          <Field
            label="Company"
            name="company"
            value={form.company}
            onChange={handleChange}
          />
          <SelectField
            label="Annual Income Range"
            name="annualIncome"
            value={form.annualIncome}
            onChange={handleChange}
            options={[
              "",
              "Under $25,000",
              "$25,000 – $50,000",
              "$50,000 – $75,000",
              "$75,000 – $100,000",
              "$100,000 – $150,000",
              "Over $150,000",
            ]}
          />
        </div>
      </section>

      {/* Service & Contact Preferences */}
      <section className="form-section">
        <h3 className="section-title">Service & Contact Preferences</h3>
        <div className="field-grid">
          <SelectField
            label="Service Requested"
            name="serviceRequested"
            value={form.serviceRequested}
            onChange={handleChange}
            error={errors.serviceRequested}
            options={[
              "",
              "Consultation",
              "Accounting Services",
              "Tax Preparation",
              "Financial Planning",
              "Business Advisory",
              "Other",
            ]}
            required
          />
          <SelectField
            label="Preferred Contact Method"
            name="preferredContact"
            value={form.preferredContact}
            onChange={handleChange}
            options={["", "Email", "Phone", "Text Message", "In-person"]}
          />
          <Field
            label="Best Time to Reach You"
            name="bestTime"
            value={form.bestTime}
            onChange={handleChange}
            placeholder="e.g. Weekdays 9am–5pm"
          />
          <Field
            label="Referred By"
            name="referredBy"
            value={form.referredBy}
            onChange={handleChange}
          />
          <div className="field field-full">
            <label className="field-label" htmlFor="message">
              Additional Information
            </label>
            <textarea
              id="message"
              name="message"
              className="field-input field-textarea"
              rows="4"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us anything else we should know..."
            />
          </div>
        </div>
      </section>

      {/* Consent */}
      <section className="form-section">
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            checked={form.agreeTerms}
            onChange={handleChange}
            className="checkbox-input"
          />
          <label htmlFor="agreeTerms" className="checkbox-label">
            I agree that the information provided is accurate and consent to
            KYNEC contacting me regarding my intake request.
          </label>
        </div>
        {errors.agreeTerms && (
          <p className="field-error">{errors.agreeTerms}</p>
        )}
      </section>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Submitting..." : "Submit Intake Form"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, name, type = "text", value, onChange, error, required, placeholder, full }) {
  return (
    <div className={`field ${full ? "field-full" : ""}`}>
      <label className="field-label" htmlFor={name}>
        {label}
        {required && <span className="required-mark"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className={`field-input ${error ? "field-input-error" : ""}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

function SelectField({ label, name, value, onChange, error, options, required }) {
  return (
    <div className="field">
      <label className="field-label" htmlFor={name}>
        {label}
        {required && <span className="required-mark"> *</span>}
      </label>
      <select
        id={name}
        name={name}
        className={`field-input ${error ? "field-input-error" : ""}`}
        value={value}
        onChange={onChange}
      >
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt === "" ? "Select..." : opt}
          </option>
        ))}
      </select>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
