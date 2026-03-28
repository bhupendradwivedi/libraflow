import axiosInstance from '../api/axiosInstance';

const issueService = {
    // --- STUDENT ACTIONS ---
    requestIssue: async (bookId) => {
        const { data } = await axiosInstance.post(`/issues/book/request/${bookId}`);
        return data;
    },

    getMyBookRequests: async () => {
        const { data } = await axiosInstance.get('/provide/my-requests ');
        return data;
    },

    requestReturn: async (issueId) => {
        const { data } = await axiosInstance.put(`/issues/book/return-request/${issueId}`);
        return data;
    },

    // --- ADMIN ACTIONS ---
    getAdminPendingRequests: async () => {
        const { data } = await axiosInstance.get('/issues/admin/requests');
        return data;
    },

    approveIssueRequest: async (requestId) => {
        const { data } = await axiosInstance.put(`/issues/admin/request/approve/${requestId}`);
        return data;
    },

    rejectIssueRequest: async (requestId) => {
        const { data } = await axiosInstance.put(`/issues/admin/request/reject/${requestId}`);
        return data;
    },

    approveReturnRequest: async (issueId) => {
        const { data } = await axiosInstance.put(`/issues/admin/return/approve/${issueId}`);
        return data;
    }
};

export default issueService;