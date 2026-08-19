import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EMPTY_MEMBER = {
  name: "",
  email: "",
  phone: "",
  department: "",
  membership: "Student",
  address: "",
  avatar: "",
  status: "Active",
};

export default function MemberModal({
  isOpen,
  member,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(EMPTY_MEMBER);

  useEffect(() => {
    if (member) {
      setForm(member);
    } else {
      setForm(EMPTY_MEMBER);
    }
  }, [member]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Member name is required");
      return false;
    }

    if (!form.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      toast.error("Enter a valid email");
      return false;
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      toast.error("Phone number must contain exactly 10 digits");
      return false;
    }

    if (!form.department.trim()) {
      toast.error("Department is required");
      return false;
    }

    if (!form.address.trim()) {
      toast.error("Address is required");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSave(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8">

        <div className="flex justify-between items-center mb-8">

          <h2 className="text-3xl font-bold">

            {member ? "Edit Member" : "Add New Member"}

          </h2>

          <button
            onClick={onClose}
            className="text-3xl font-bold text-gray-500 hover:text-red-500"
          >
            ×
          </button>

        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="border rounded-xl p-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="border rounded-xl p-3"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="border rounded-xl p-3"
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            className="border rounded-xl p-3"
          />

          <select
            name="membership"
            value={form.membership}
            onChange={handleChange}
            className="border rounded-xl p-3"
          >
            <option>Student</option>
            <option>Faculty</option>
            <option>Research</option>
          </select>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded-xl p-3"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <textarea
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            rows="3"
            className="border rounded-xl p-3 md:col-span-2"
          />

          <input
            type="text"
            name="avatar"
            placeholder="Avatar Image URL"
            value={form.avatar}
            onChange={handleChange}
            className="border rounded-xl p-3 md:col-span-2"
          />

        </div>

        {form.avatar && (
          <div className="flex justify-center mt-8">

            <img
              src={form.avatar}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />

          </div>
        )}

        <div className="flex justify-end gap-4 mt-10">

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            {member ? "Update Member" : "Save Member"}
          </button>

        </div>

      </div>

    </div>
  );
}
