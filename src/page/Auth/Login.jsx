import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { FaRegEye, FaRegEyeSlash, FaUser, FaLock } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../../redux/usersSlice";
import { z } from "zod";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const users = useSelector((state) => state.users);

  const { setUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        "Password must contain uppercase, lowercase, number, and special character",
      ),
  });

  const loginUserHandler = (e) => {
    e.preventDefault();

    const result = loginSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      alert(result.error.errors[0].message);
      return;
    }

    dispatch(loginUser({ email, password }));

    const user = users.find((u) => u.email === email);
    if (user) {
      setUser(user);
    }

    navigate("/dashboard");
  };

  return (
    <div className="login_container">
      <div className="login_card">
        <div className="login_header">
          <h1>Bank Login</h1>
          <p>Secure access to your account</p>
        </div>

        <form className="login_form" onSubmit={loginUserHandler}>
          <div className="form_group">
            <label>Email Address</label>
            <div className="input_wrapper">
              <FaUser className="input_icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form_group">
            <label>Password</label>
            <div className="input_wrapper password_wrapper">
              <FaLock className="input_icon" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="login_btn">
            Login
          </button>
        </form>

        <div className="signup_link">
          <p>
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;