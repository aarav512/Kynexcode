import { useState } from "react";
import ClientIntakeForm from "./ClientIntakeForm.jsx";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-text">KYNEC</span>
            <span className="logo-tag">Client Intake</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="hero">
          <h1>Welcome to KYNEC</h1>
          <p>
            Please complete the intake form below so we can get to know you and
            set up your account. This should take about 5 minutes.
          </p>
        </div>
        <ClientIntakeForm />
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} KYNEC. All rights reserved.</p>
      </footer>
    </div>
  );
}
