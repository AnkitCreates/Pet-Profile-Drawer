import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchClients } from "../../api/clientApi";
import { fetchPetsByClient } from "../../api/petApi";
import { useDebounce } from "../../utils/useDebounce";

// highlight function
function highlight(text: string, q: string) {
  if (!q) return text;

  const re = new RegExp(`(${q})`, "ig");
  const parts = text.split(re);

  return parts.map((p, i) =>
    p.toLowerCase() === q.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 px-0.5 rounded">
        {p}
      </mark>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

export default function LeftPanel({
  onSelectPet,
}: {
  onSelectPet: (pet: any) => void;
}) {
  const [search, setSearch] = useState("");
  const [includeInactive, setIncludeInactive] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });

  return (
    // left panel Div
    <div className="w-[45%] min-w-[360px] max-w-[520px] border-r bg-white p-3">
      
      {/* Search + Toggle */}
      {/* gap - increases the gap between the childs of the divison class */}
      <div className="flex items-center gap-2 mb-4">
        <input
          // className="flex-1 border rounded px-3 py-2 text-sm"
          className="w-[50%] mr-2 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search by name, email or pets"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <label className="flex items-center gap-2 text-sm whitespace-nowrap">
          Include Inactive
          <input
            type="checkbox"
            checked={includeInactive}
            onChange={() => setIncludeInactive((v) => !v)}
            // className="w-4 h-4 rounded-sm accent-blue-600 cursor-pointer"
            className="w-4 h-4 appearance-none border-2 border-gray-300
             checked:bg-blue-300 checked:border-blue-600
             cursor-pointer"
          />
          
        </label>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-[3.5fr_2fr_2fr] w-full text-xs text-gray-500 px-2 mb-2">
        <div>Client Name</div>
        <div>Status</div>
        <div>Pets</div>
      </div>

      {/* Client rows */}
      <div className="space-y-1">
        {clients?.map((client: any) => (
          <ClientRow
            key={client.id}
            client={client}
            search={debouncedSearch}
            includeInactive={includeInactive}
            onSelectPet={onSelectPet}
          />
        ))}
      </div>
    </div>
  );
}

// ClientRow function
function ClientRow({ client, search, includeInactive, onSelectPet }: any) {
  const { data: pets = [] } = useQuery({
    queryKey: ["pets", client.id],
    queryFn: () => fetchPetsByClient(client.id),
  });

  const q = search.toLowerCase();
  const clientMatches = client.name.toLowerCase().includes(q);

  const visiblePets = pets.filter((pet: any) => {
    if (!includeInactive && pet.status !== "Active") return false;

    return pet.name.toLowerCase().includes(q) || clientMatches;
  });

  // Hide row only if search exists AND neither client nor pets match
  if (search && !clientMatches && visiblePets.length === 0) return null;

  return (
    <div
      onClick={() => visiblePets[0] && onSelectPet(visiblePets[0])}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" && visiblePets[0]) {
          onSelectPet(visiblePets[0]);
        }
      }}
      // className="grid grid-cols-[2fr_1fr_3fr] items-center px-2 py-2
      //            rounded hover:bg-gray-100 cursor-pointer text-sm
      //            focus-visible:ring-2 focus-visible:ring-blue-500"

      className="grid grid-cols-[3.5fr_2fr_2fr] w-full items-center px-2 py-2
           rounded hover:bg-gray-100 cursor-pointer text-sm
           focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {/* Client name */}
      <div className="font-medium">{highlight(client.name, search)}</div>

      {/* Status */}
      <div>
        <span
          className={`px-2 py-0.5 rounded text-xs ${
            client.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {client.status}
        </span>
      </div>

      {/* Pets */}
      <div className="flex gap-2 flex-wrap text-xs">
        {visiblePets.length > 0 ? (
          visiblePets.map((pet: any) => (
            <span
              key={pet.id}
              className={`px-2 py-0.5 border rounded ${
                pet.status === "Inactive"
                  ? "bg-gray-100 text-gray-500"
                  : "bg-white"
              }`}
            >
              {highlight(pet.name, search)}
            </span>
          ))
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </div>
    </div>
  );
}
