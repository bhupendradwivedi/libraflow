import axiosInstance from "../api/axiosInstance";

const userService = {
  // Get all students
  //  /api/provide/admin/all-students
  getAllStudents: async () => {
    try {
      const response = await axiosInstance.get(`/provide/admin/all-students`);
      return response.data; 
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  //  Update Student Status (Approve/Reject)
  // URL: /api/provide/admin/update-status/:id
  // Usage: approveStudent(id, 'approved') or approveStudent(id, 'rejected')
  approveStudent: async (id, status = 'approved') => {
    try {
      const response = await axiosInstance.put(`/provide/admin/update-status/${id}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  //  Delete student account
  //  /api/provide/student/:id
  deleteStudent: async (id) => {
    try {
      const response = await axiosInstance.delete(`/provide/student/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
 
//  /api/provide/
deleteUnverifiedStudents: async () => {
  try {
    const response = await axiosInstance.delete(`/provide/admin/delete-unverified`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

//  Get Dashboard Statistics
 // URL: /api/provide/admin/dashboard-stats
  getDashboardStats: async () => {
    try {
      const { data } = await axiosInstance.get('/provide/admin/dashboard-stats');
      return data; 
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getAdminReturnRequests: async () => {
        try {
            const { data } = await axiosInstance.get(`/provide/admin/returns/pending`);
            return data;
        } catch (error) {
            throw error.response?.data?.message || "Return requests fetch nahi ho saki";
        }
    },
};


export default userService;