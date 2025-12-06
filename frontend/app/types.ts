export interface SetCookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "strict" | "lax" | "none";
  maxAge: number;
  path: string;
}

export type UserData = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  profile_photo?: string;
  profile_banner?: string;
  role: string;
  employee_code?: string;
  department?: string;
};

export type ActionResult = {
  success: boolean;
  user_data?: UserData;
  message?: string;
};

export type Employees = {
  id: string;
  employee_code: string;
  firstname: string;
  lastname: string;
  department: string;
};

export type Shift = {
  id: string | number;
  date: string;
  start_time: string;
  end_time: string;
};

export type AdminShift = {
  id: string;
  employee_code: string;
  employee_name: string;
  date: string;
  start_time: string;
  end_time: string;
  created_by_code?: string;
  created_by_name?: string;
  created_at?: string;
};