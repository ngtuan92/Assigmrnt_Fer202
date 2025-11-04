import axios from "axios";

export const API_URL = "http://localhost:9999";

const login = async ({ email, password }) => {
    try {
        const response = await axios.get(`${API_URL}/users`);
        const users = response.data;
        const foundUser = users.find(
            (user) => user.email === email && user.password === password
        );

        if (foundUser) {
            return foundUser;
        } else {
            throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
        }
    } catch (error) {
        throw error;
    }


};

const signup = async (name, email, password) => {
    try {
        const usersRes = await axios.get(`${API_URL}/users`);
        const users = usersRes.data;

        if (users.some(user => user.email === email)) {
            throw new Error("Email đã được sử dụng");
        }

        const response = await axios.post(`${API_URL}/users`, {
            name,
            email,
            password,
            role: 'user',
            avatar: '/public/access/default-user.png',
            joinDate: new Date().toISOString()
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

const authAPI = {
    login,
    signup
};

export default authAPI;
