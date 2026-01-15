import { useState } from "react";

export default function BookingsTab({ items = [] }: any) {
  const [asc, setAsc] = useState(false);

  const sorted = [...items].sort((a, b) =>
    asc
      ? new Date(a.start).getTime() - new Date(b.start).getTime()
      : new Date(b.start).getTime() - new Date(a.start).getTime()
  );

  return (
    <div className="space-y-3">
      <button onClick={() => setAsc((v) => !v)} className="text-xs underline">
        Sort by date ({asc ? "asc" : "desc"})
      </button>

      <table className="w-full text-sm border table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left w-[30%]">Type</th>
            <th className="p-2 text-left w-[40%]">Dates</th>
            <th className="p-2 text-left w-[30%]">Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((b: any) => (
            <tr key={b.id} className="border-t">
              <td className="p-2 truncate">{b.type}</td>
              <td className="p-2">
                <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700">
                  {b.start} → {b.end}
                </span>
              </td>
              <td className="p-2">
                <span className="px-2 py-0.5 text-xs rounded bg-gray-100">
                  {b.status}
                </span>
              </td>
            </tr>
          ))}

          {sorted.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-gray-400 text-center">
                No bookings
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
