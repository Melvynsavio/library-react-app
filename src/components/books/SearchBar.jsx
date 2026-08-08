export default function SearchBar({
  search,
  setSearch,
  category,
  setCategory
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">

      <input
        type="text"
        placeholder="Search by Title or Author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 border rounded-xl p-3"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border rounded-xl p-3 w-60"
      >

        <option value="">All Categories</option>

        <option value="Programming">Programming</option>

        <option value="Database">Database</option>

        <option value="Networking">Networking</option>

        <option value="AI">AI</option>

        <option value="Web Development">Web Development</option>

      </select>

    </div>
  );
}