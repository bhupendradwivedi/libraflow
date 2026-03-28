import axiosInstance from '../api/axiosInstance';

const bookService = {
    // 1. Get All Books (Public/Student)
    getAllBooks: async () => {
        const { data } = await axiosInstance.get('/books/all');
        return data;
    },

    // 2. Search Books
    searchBooks: async (query) => {
        const { data } = await axiosInstance.get(`/books/search?q=${query}`);
        return data;
    },

    // 3. Admin: Add New Book (Multipart for Image)
    addBook: async (formData) => {
        const { data } = await axiosInstance.post('/books/admin/add', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },

   // 4. Admin: Edit Book (Path fixed)
    editBook: async (id, formData) => {

        const { data } = await axiosInstance.put(`/books/admin/edit/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },

    // 5. Admin: Delete Book (Prefix mein '/' lagana safe rehta hai)
    deleteBook: async (id) => {
        const { data } = await axiosInstance.delete(`/books/admin/delete/${id}`);
        return data;
    }
};

export default bookService;