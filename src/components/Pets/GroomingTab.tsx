import { useState } from "react";

export default function GroomingTab({ items = [] }: any) {
  const [asc, setAsc] = useState(false);

  const sorted = [...items].sort((a, b) =>
    asc
      ? new Date(a.date).getTime() - new Date(b.date).getTime()
      : new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-3">
      <button onClick={() => setAsc((v) => !v)} className="text-xs underline">
        Sort by date ({asc ? "asc" : "desc"})
      </button>

      <table className="w-full text-sm border table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left w-[40%]">Service</th>
            <th className="p-2 text-left w-[25%]">Date</th>
            <th className="p-2 text-left w-[35%]">Notes</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((g: any) => (
            <tr key={g.id} className="border-t">
              <td className="p-2 truncate">{g.service}</td>
              <td className="p-2">{g.date}</td>
              <td className="p-2 truncate">{g.notes || "—"}</td>
            </tr>
          ))}

          {sorted.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-gray-400 text-center">
                No grooming history
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
