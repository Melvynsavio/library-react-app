import { useEffect, useState } from "react";
import api from "../services/api";
import { isValidEmail, isValidPhone } from "../utils/validation";
import { toast } from "react-hot-toast";
import {
  FaUsers,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

function Members() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    membershipType: "Regular",
    status: "Active",
  });

  // ==========================================
  // GET MEMBERS
  // ==========================================

  const fetchMembers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/members");

      setMembers(response.data.data);
    } catch (error) {
      console.error("FETCH MEMBERS ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load members"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // OPEN ADD
  // ==========================================

  const openAddModal = () => {
    setEditingMember(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      membershipType: "Regular",
      status: "Active",
    });

    setShowModal(true);
  };

  // ==========================================
  // OPEN EDIT
  // ==========================================

  const openEditModal = (member) => {
    setEditingMember(member);

    setFormData({
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
      address: member.address || "",
      membershipType:
        member.membershipType || "Regular",
      status: member.status || "Active",
    });

    setShowModal(true);
  };

  // ==========================================
  // ADD / UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();
    const address = formData.address.trim();

    if (name.length < 2 || name.length > 100) {
      toast.error("Name must be between 2 and 100 characters");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Enter a valid email address");
      return;
    }
    if (!isValidPhone(phone)) {
      toast.error("Enter a valid phone number with 7 to 15 digits");
      return;
    }
    if (address.length > 300) {
      toast.error("Address cannot exceed 300 characters");
      return;
    }

    const payload = {
      ...formData,
      name,
      email,
      phone,
      address,
    };

    try {
      if (editingMember) {
        await api.put(
          `/members/${editingMember._id}`,
          payload
        );

        toast.success(
          "Member updated successfully"
        );
      } else {
        await api.post(
          "/members",
          payload
        );

        toast.success(
          "Member added successfully"
        );
      }

      setShowModal(false);
      setEditingMember(null);

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        membershipType: "Regular",
        status: "Active",
      });

      fetchMembers();
    } catch (error) {
      console.error(
        "SAVE MEMBER ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Operation failed"
      );
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const deleteMember = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/members/${id}`);

      toast.success(
        "Member deleted successfully"
      );

      fetchMembers();
    } catch (error) {
      console.error(
        "DELETE MEMBER ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete member"
      );
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredMembers = members.filter(
    (member) => {
      const text = search.toLowerCase();

      return (
        member.name
          ?.toLowerCase()
          .includes(text) ||
        member.email
          ?.toLowerCase()
          .includes(text) ||
        member.phone
          ?.toLowerCase()
          .includes(text)
      );
    }
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Members
          </h1>

          <p className="text-slate-500 mt-1">
            Manage your library members
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl font-semibold transition"
        >
          <FaPlus />
          Add Member
        </button>

      </div>

      {/* SEARCH */}

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">

        <div className="relative">

          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

      </div>

      {/* LOADING */}

      {loading ? (

        <div className="bg-white rounded-2xl p-10 text-center">
          <p className="text-slate-500">
            Loading members...
          </p>
        </div>

      ) : filteredMembers.length === 0 ? (

        <div className="bg-white rounded-2xl p-10 text-center">

          <FaUsers className="mx-auto text-4xl text-slate-300 mb-4" />

          <h2 className="text-xl font-semibold text-slate-700">
            No members found
          </h2>

          <p className="text-slate-500 mt-2">
            Add your first library member.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredMembers.map((member) => (

            <div
              key={member._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-6"
            >

              {/* TOP */}

              <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">
                    {member.name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      {member.name}
                    </h2>

                    <p className="text-sm text-slate-500">
                      {member.membershipType ||
                        "Regular"}
                    </p>
                  </div>

                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    member.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {member.status || "Active"}
                </span>

              </div>

              {/* DETAILS */}

              <div className="mt-6 space-y-3">

                <div className="flex items-center gap-3 text-sm">

                  <FaEnvelope className="text-blue-500" />

                  <span className="text-slate-600 break-all">
                    {member.email}
                  </span>

                </div>

                <div className="flex items-center gap-3 text-sm">

                  <FaPhone className="text-blue-500" />

                  <span className="text-slate-600">
                    {member.phone}
                  </span>

                </div>

                {member.address && (
                  <div className="text-sm text-slate-500">
                    <span className="font-semibold">
                      Address:
                    </span>{" "}
                    {member.address}
                  </div>
                )}

              </div>

              {/* ACTIONS */}

              <div className="flex gap-3 mt-6">

                <button
                  onClick={() =>
                    openEditModal(member)
                  }
                  className="flex-1 flex items-center justify-center gap-2 border border-blue-200 text-blue-600 hover:bg-blue-50 py-2.5 rounded-xl font-medium transition"
                >
                  <FaEdit />
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteMember(member._id)
                  }
                  className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-xl font-medium transition"
                >
                  <FaTrash />
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between p-6 border-b">

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingMember
                    ? "Edit Member"
                    : "Add Member"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {editingMember
                    ? "Update member information"
                    : "Register a new library member"}
                </p>
              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center"
              >
                <FaTimes />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >

              {/* NAME */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name *
                </label>

                <input
                  type="text"
                  name="name"
                  required
                  minLength={2}
                  maxLength={100}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter member name"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* EMAIL */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email *
                </label>

                <input
                  type="email"
                  name="email"
                  required
                  maxLength={254}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* PHONE */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone *
                </label>

                <input
                  type="tel"
                  name="phone"
                  required
                  inputMode="tel"
                  maxLength={25}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* ADDRESS */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Address
                </label>

                <textarea
                  name="address"
                  maxLength={300}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  rows="3"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />

              </div>

              {/* MEMBERSHIP */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Membership Type
                </label>

                <select
                  name="membershipType"
                  value={
                    formData.membershipType
                  }
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Regular">
                    Regular
                  </option>

                  <option value="Premium">
                    Premium
                  </option>

                  <option value="Student">
                    Student
                  </option>
                </select>

              </div>

              {/* STATUS */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>

              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700"
                >
                  {editingMember
                    ? "Update Member"
                    : "Add Member"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Members;
