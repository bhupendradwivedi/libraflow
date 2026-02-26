import axiosInstance from '../api/axiosInstance';

const bookService = {
    // Saari books fetch karne ke liye
    getAllBooks: async () => {
        const { data } = await axiosInstance.get('/books'); 
        return data;
    },
    // Book issue karne ki request bhejne ke liye
    issueBook: async (bookId) => {
        const { data } = await axiosInstance.post(`/books/issue/${bookId}`);
        return data;
    }
};

export default bookService;