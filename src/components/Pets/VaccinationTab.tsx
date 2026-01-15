import { useEffect, useState } from "react";

export default function VaccinationsTab({ items = [], petId }: any) {
  const [list, setList] = useState<any[]>([]);
  const [vaccine, setVaccine] = useState("");
  const [date, setDate] = useState("");
  const [asc, setAsc] = useState(false);

  // Keep local list in sync with props
  useEffect(() => {
    setList(items || []);
  }, [items]);

  const sorted = [...list].sort((a: any, b: any) =>
    asc
      ? new Date(a.date).getTime() - new Date(b.date).getTime()
      : new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  function isDueSoon(due: string) {
    const diff = new Date(due).getTime() - new Date().getTime();
    return diff <= 30 * 24 * 60 * 60 * 1000 && diff >= 0;
  }

  async function add() {
    if (!vaccine || !date) return;

    const payload = {
      petId,
      vaccine,
      date,
      due: date,
    };

    // optimistic local append
    const temp = { ...payload, id: Date.now() };
    setList((prev) => [...prev, temp]);

    setVaccine("");
    setDate("");

    try {
      const res = await fetch("http://localhost:4000/vaccinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const saved = await res.json();

      // replace temp with real server record
      setList((prev) => prev.map((v) => (v.id === temp.id ? saved : v)));
    } catch {
      // rollback on failure
      setList((prev) => prev.filter((v) => v.id !== temp.id));
    }
  }

  return (
    <div className="space-y-4">
      {/* Quick Add */}
      <div className="flex gap-2">
        <input
          className="border p-2 text-sm flex-1"
          placeholder="Vaccine name"
          value={vaccine}
          onChange={(e) => setVaccine(e.target.value)}
        />
        <input
          className="border p-2 text-sm"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          onClick={add}
          className="px-3 py-2 bg-blue-600 text-white text-sm rounded"
        >
          Add
        </button>
      </div>

      <button onClick={() => setAsc((v) => !v)} className="text-xs underline">
        Sort by date ({asc ? "asc" : "desc"})
      </button>

      <table className="w-full text-sm border table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left w-[40%]">Vaccine</th>
            <th className="p-2 text-left w-[30%]">Given</th>
            <th className="p-2 text-left w-[30%]">Due</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((v: any) => (
            <tr key={v.id} className="border-t">
              <td className="p-2 truncate">{v.vaccine}</td>
              <td className="p-2">{v.date}</td>
              <td className="p-2">
                {v.due}
                {isDueSoon(v.due) && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-700">
                    Due soon
                  </span>
                )}
              </td>
            </tr>
          ))}

          {sorted.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-gray-400 text-center">
                No vaccinations
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}