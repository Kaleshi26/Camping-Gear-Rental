import { useState } from "react";
import { useNavigate } from "react-router-dom";

function GearHostSignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    idNumber: "",
    district: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/register-gearhost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      navigate("/gearhost-dashboard");
    } else {
      alert("Signup failed!");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Gear Host Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} className="input" required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="input" required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="input" required />
        <input type="text" name="idNumber" placeholder="ID Number" onChange={handleChange} className="input" required />
        <input type="text" name="district" placeholder="District" onChange={handleChange} className="input" required />
        <button type="submit" className="btn-primary">Sign Up</button>
      </form>
    </div>
  );
}

export default GearHostSignUp;
