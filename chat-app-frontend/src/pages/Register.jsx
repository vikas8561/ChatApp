import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/auth/register", form);
      setUser(data);
      navigate("/chat");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl space-y-6 animate-fade-in"
      >
        <h2 className="text-3xl font-bold text-center">Create an Account</h2>

        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            name="name"
            placeholder="Enter Your Name"
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded outline-none focus:ring-2 ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded outline-none focus:ring-2 ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter Password"
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded outline-none focus:ring-2 ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 transition rounded font-semibold text-white"
        >
          Register
        </button>

        <p className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
