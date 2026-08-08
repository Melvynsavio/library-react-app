export default function MemberSearch({
  search,
  setSearch,
  status,
  setStatus
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4">

      <input
        type="text"
        placeholder="Search member..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 border border-gray-300 rounded-xl p-3"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border border-gray-300 rounded-xl p-3"
      >
        <option value="">All Members</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

    </div>
  );
}