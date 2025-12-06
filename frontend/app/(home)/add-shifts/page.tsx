"use client";

import { useEffect, useState } from "react";
import styles from "../add-employee/addEmployee.module.css";
import { Employees } from "@/app/types";
import { useUserContext } from "@/app/_utils/user-contextProvider";
const defaultemployees = [
  {
    id: "1",
    employee_code: "EMPXXXX",
    firstname: "FirstName",
    lastname: "LastName",
    department: "DEPT",
  },
];
const AddShifts = () => {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [employees, setEmployees] = useState<Employees[]>(defaultemployees);
  const userData = useUserContext();

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/getEmployeeList", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        console.log("error fetching data");
        setEmployees([]);
        return;
      }
      const data = await res.json();
      if (!data.success) {
        setSuccess(false);
        setMsg(data.message);
        return;
      }
      console.log(data);

      setEmployees(data.data);
    } catch (error) {
      setSuccess(false);
      setMsg("Error while fetching employees");
      setEmployees(defaultemployees);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    setMsg("");
    setLoading(true);
    const formData = new FormData(form);

    const id = formData.get("employees")?.toString() ?? "";
    const date = formData.get("date")?.toString() ?? "";
    const start_time = formData.get("start_time")?.toString() || "";
    const end_time = formData.get("end_time")?.toString() ?? "";

    if (!id) {
      setMsg("Select Employee !");
      setLoading(false);
      return;
    }
    if (!date) {
      setMsg("Select Date !");
      setLoading(false);
      return;
    }
    if (!start_time) {
      setMsg("Select start time !");
      setLoading(false);
      return;
    }
    if (!end_time) {
      setMsg("Select end time !");
      setLoading(false);
      return;
    }

    const created_by = userData.id;
    console.log(
      JSON.stringify({
        id,
        date,
        start_time,
        end_time,
        created_by,
      })
    );

    const res = await fetch("/api/addEmployeeShift", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        date,
        start_time,
        end_time,
        created_by,
      }),
    });
    const data = await res.json();
    console.log(data);

    setMsg(data.message ?? "Something went wrong!");

    if (data.success) {
      setSuccess(true);
      form.reset();
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
          <legend>Add Shifts</legend>

          <div className={styles.inputGroup}>
            <label htmlFor="employees">employees:</label>
            <select name="employees" id="employees">
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.employee_code} - {emp.firstname} {emp.lastname} (
                  {emp.department})
                </option>
              ))}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="date">shift date:</label>
            <input id="date" type="date" name="date" />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="start_time">start time:</label>
            <input id="start_time" type="time" name="start_time" />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="end_time">end time:</label>
            <input id="end_time" type="time" name="end_time" />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Adding Shifts..." : "Add Shifts"}
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

export default AddShifts;
