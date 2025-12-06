"use client";

import { useState } from "react";
import styles from "./addEmployee.module.css";
import Image from "next/image";

const AddEmployee = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleAddEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    setMsg("");
    setLoading(true);
    const formData = new FormData(form);

    const firstname = formData.get("firstName")?.toString() ?? "";
    const lastname = formData.get("lastName")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("employeePassword")?.toString().trim() || "";
    const department = formData.get("department")?.toString() ?? "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMsg("Invalid email format");
      setLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      setMsg("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/addEmployee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        password,
        department,
      }),
    });
    const data = await res.json();
    setMsg(data.message ?? "Something went wrong!");

    if (data.success) {
      setSuccess(true);
      form.reset();
      setPasswordVisible(false);
    }
    setLoading(false);
  };

  return (
    <div className={styles.addEmployeeContainer}>
      <form
        className={styles.addEmployeeForm}
        onSubmit={async (e) => {
          e.preventDefault();
          await handleAddEmployee(e);
        }}
      >
        <fieldset>
          <legend>Add Employee</legend>

          <div className={styles.inputGroup}>
            <label htmlFor="firstName">first name:</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              placeholder="enter first name..."
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="lastName">last name:</label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              placeholder="enter last name..."
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="employeeEmail">email:</label>
            <input
              id="employeeEmail"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="enter email..."
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="employeePassword">password:</label>
            <input
              id="employeePassword"
              name="employeePassword"
              type={passwordVisible ? "text" : "password"}
              autoComplete="new-password"
              placeholder="enter password..."
              maxLength={16}
            />
            <button
              type="button"
              className={styles.showHideButton}
              onClick={() => setPasswordVisible((prev) => !prev)}
            >
              <Image
                src={passwordVisible ? "/eye-open.svg" : "/eye-close.svg"}
                height={40}
                width={40}
                alt={passwordVisible ? "hide" : "show"}
              />
            </button>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="department">department:</label>
            <select id="department" name="department">
              <option defaultValue="IT">IT</option>
              <option value="HR">Human Resources</option>
              <option value="Sales">Sales</option>
              <option value="CS">Customer Service</option>
              <option value="M">Marketing</option>
              <option value="OM">Operations Management</option>
              <option value="RD">Research and Development (R&D)</option>
              <option value="QA">Quality Assurance</option>
            </select>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Adding Employee..." : "Add Employee"}
          </button>
        </fieldset>
      </form>

      {msg && (
        <p
          style={{
            backgroundColor: success
              ? "var(--accent-success)"
              : "var(--accent-error)",
          }}
          className={styles.msg}
        >
          {msg}
        </p>
      )}
    </div>
  );
};

export default AddEmployee;
