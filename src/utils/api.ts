import { post, get } from '../components/axios';

export const url = 'http://localhost:5002/api/v1/';

export const login = async ({ email, password }: any) => {
   try {
      const { data } = await post(`${url}auth/login`, { email, password });
      if (data.code === 200) { await localStorage.setItem('zer', data.token); }
      return data.token;
   } catch (error) {
      return error;
   }
};

export const verifyToken = async () => {
   try {
      if (!localStorage.getItem('zer')) return;
      const { data } = await get(`${url}auth/verify-token`);
      if (data.success) { return data.data.user; }
   } catch (error) {
      return error;
   }
};

export const register = async (company: object) => {
   try {
      const { data } = await post(`${url}company`, company);
      if (data && data.success) { return data; }
   } catch (error) {
      return error;
   }
};

export const forgot_password = async (email: String) => {
   try {
      const { data } = await post(`${url}forgetPassword`, { email });
      if (data.success) { return data; }
   } catch (error) {
      return error;
   }
};

export const get_assessments = async () => {
   try {
      const { data } = await get(`${url}assessment/admin/group-assessment`);
      if (data) { return data.data; }
   } catch (error) {
      return error;
   }
};

export const create_assessment = async (assessment: any) => {
   try {
      const formData = new FormData();
      formData.append('title', assessment.title);
      formData.append('mode', assessment.mode);
      formData.append('time_limit)', assessment.time_limit);
      formData.append('optionSchedule', assessment.optionSchedule);
      formData.append('essaySchedule', assessment.essaySchedule);
      formData.append('designation', assessment.designation);
      formData.append('role', 'guest');
      const { data } = await post(`${url}assessment/admin/create`, formData);
      if (data.code === 200) { return true; }
   } catch (error) {
      return error;
   }
};

export const get_users = async (type: string) => {
   try {
      const { data } = await get(`${url}auth/admin?role=${type}`);
      if (data.code === 200) { return data.data; }
   } catch (error) {
      return error;
   }
};
