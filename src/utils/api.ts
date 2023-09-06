import { post, get, patch } from "../components/axios";

export const url = process.env.REACT_APP_API_URL;

export const login = async ({ email, password }: any) => {
  try {
    const { data } = await post(`${url}auth/login`, { email, password });
    if (data.code === 200) {
      await localStorage.setItem("zer", data.token);
    }
    return data.token;
  } catch (error) {
    return error;
  }
};

export const verifyToken = async () => {
  try {
    if (!localStorage.getItem("zer")) return;
    const { data } = await get(`${url}auth/verify-token`);
    if (data.success) {
      return data.data.user;
    }
  } catch (error) {
    return error;
  }
};

export const register = async (company: object) => {
  try {
    const { data } = await post(`${url}company`, company);
    if (data && data.success) {
      return data;
    }
  } catch (error) {
    return error;
  }
};

export const forgot_password = async (email: String) => {
  try {
    const { data } = await post(`${url}auth/forget-password`, { email });
    if (data) {
      return data;
    }
  } catch (error: any) {
    return error;
  }
};

export const update_password = async (payload: any) => {
  try {
    console.log(payload.token);
    const { data } = await post(
      `${url}auth/reset-password`,
      { password: payload.password },
      { headers: { Authorization: `Bearer ${payload.token}` } }
    );
    if (data) {
      return data;
    }
  } catch (error) {
    return error;
  }
};

export const get_assessments = async () => {
  try {
    const { data } = await get(`${url}assessment/admin/group-assessment`);
    if (data) {
      return data.data;
    }
  } catch (error) {
    return error;
  }
};

export const get_results = async () => {
  try {
    const { data } = await get(`${url}assessment/admin/administration`);
    if (data) {
      return data.data;
    }
  } catch (error) {
    return error;
  }
};

export const get_result = async (administration_id: string) => {
  try {
    const { data } = await get(`${url}assessment/admin/administration?administration_id=${administration_id}`);
    if (data) {
      return data.data;
    }
  } catch (error) {
    return error;
  }
};

export const candidate_sign_up = async (payload: any) => {
  try {
    const formData = new FormData();
    formData.append("first_name", payload.first_name);
    formData.append("last_name", payload.last_name);
    formData.append("designation", payload.designation);
    formData.append("email", payload.email);
    formData.append("password", payload.password);
    formData.append("file", payload.file);
    formData.append("role", payload.role);
    formData.append("isActive", payload.isActive);

    const { data } = await post(`${url}auth/register`, formData);
    return data;
  } catch (error) {
    return error;
  }
};

export const get_assessments_by_candidate = async (assessment_id: string) => {
  try {
    const { data } = await get(`${url}assessment${assessment_id ? "?group_id=" + assessment_id : ""}`);
    if (data) {
      return data.data;
    }
  } catch (error) {
    return error;
  }
};

export const create_assessment = async (assessment: any) => {
  try {
    const formData = new FormData();
    formData.append("title", assessment.title);
    formData.append("mode", assessment.mode);
    formData.append("time_limits", assessment.time_limit);
    formData.append("optionSchedule", assessment.optionSchedule);
    formData.append("essaySchedule", assessment.essaySchedule);
    formData.append("designation", assessment.designation);
    formData.append("role", "guest");
    const { data } = await post(`${url}assessment/admin/create`, formData);
    if (data.code === 200) {
      return true;
    }
  } catch (error) {
    return error;
  }
};

export const get_users = async (type: string) => {
  try {
    const { data } = await get(`${url}auth/admin?role=${type}`);
    if (data.code === 200) {
      return data.data;
    }
  } catch (error) {
    return error;
  }
};

export const get_in_active_users = async () => {
  try {
    const { data } = await get(`${url}auth/admin/inactive-users`);
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    return error;
  }
};

export const get_user = async (id: string) => {
  try {
    const { data } = await get(`${url}auth/admin?user_id=${id}`);
    if (data.code === 200) {
      return data.data;
    }
  } catch (error) {
    return error;
  }
};

export const create_bulk_user = async (payload: any) => {
  try {
    const formData = new FormData();
    formData.append("file", payload.file);
    const { data } = await post(`${url}auth/admin/create`, formData);
    if (data.code === 200) {
      return true;
    }
  } catch (error) {
    return error;
  }
};

export const create_single_user = async (payload: any) => {
  try {
    const { data } = await post(`${url}auth/admin/create`, payload);
    if (data.code === 200) {
      return true;
    }
  } catch (error) {
    return error;
  }
};

export const submit_assessment = async (payload: any) => {
  try {
    const { data } = await post(`${url}assessment/administration`, payload);
    if (data.code === 200) {
      return true;
    }
  } catch (error) {
    return error;
  }
};

export const submit_essay_test = async (payload: any) => {
  try {
    const { data } = await post(`${url}assessment/admin/score-essay`, payload);
    if (data.code === 200) {
      return true;
    }
  } catch (error) {
    return error;
  }
};

export const get_dashboard_data = async () => {
  try {
    const { data } = await get(`${url}admin/dashboard`);
    if (data && data.data) {
      return data.data;
    }
  } catch (error) {
    return error;
  }
};

export const update_user = async (id: string, payload: any) => {
  try {
    const { data } = await patch(`${url}auth/admin/user/${id}`, payload);
    if (data) {
      return data;
    }
  } catch (error) {
    return error;
  }
};

export const approve_candidate = async (id: string) => {
  try {
    const { data } = await post(`${url}auth/admin/user?user_id=${id}`);
    if (data) {
      return data;
    }
  } catch (error) {
    return error;
  }
};

export const get_designations = async () => {
  try {
    const { data } = await get(`${url}admin/designation/read`);
    if (data && data.data) {
      return data.data;
    }
  } catch (error) {
    return error;
  }
};
export const create_designation = async (payload: any) => {
  try {
    const { data } = await post(`${url}admin/designation/create`, payload);
    if (data) {
      return data;
    }
  } catch (error) {
    return error;
  }
};
export const edit_designation = async (id: string, payload: any) => {
  try {
    const { data } = await patch(`${url}admin/designation/update/${id}`, payload);
    if (data) {
      return data;
    }
  } catch (error) {
    return error;
  }
};
