// src/components/Pets/PetDetails.tsx
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePet } from "../../api/petApi";
import { toast } from "../common/toast";

export default function PetDetails({ pet, isEditing, onDoneEdit }: any) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ ...pet });
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: updatePet,

    onMutate: async (updated: any) => {
      await qc.cancelQueries({ queryKey: ["pets"] });

      const prev = qc.getQueriesData({ queryKey: ["pets"] });

      qc.setQueriesData({ queryKey: ["pets"] }, (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.map((p: any) => (p.id === updated.id ? updated : p));
      });

      return { prev };
    },

    onError: (_err, _vars, ctx: any) => {
      ctx?.prev?.forEach(([key, data]: any) => {
        qc.setQueryData(key, data);
      });
      toast("Update failed. Rolled back.");
    },

    onSuccess: () => {
      toast("Pet updated successfully");
      onDoneEdit?.();
    },
  });

  function validate() {
    if (!form.name || !form.type || !form.breed || !form.gender || !form.size) {
      return "Required fields missing";
    }

    const w = Number(form.weightKg);
    if (isNaN(w) || w < 0 || w > 200) {
      return "Weight must be between 0 and 200";
    }

    if (!/^\d+(\.\d{1,2})?$/.test(String(form.weightKg))) {
      return "Weight max 2 decimals";
    }

    if (new Date(form.dob) > new Date()) {
      return "DOB cannot be in the future";
    }

    return "";
  }

  function save() {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    mutation.mutate(form);
  }

  // READ MODE
  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <Detail label="Type" value={pet.type} />
          <Detail label="Temper" value={pet.temper} />
          <Detail label="Pet Breed" value={pet.breed} />
          <Detail label="Color" value={pet.color} />
          <Detail label="Size" value={pet.size} />
          <Detail label="Gender" value={pet.gender} />

          <div>
            <div className="text-xs text-gray-500 mb-1">Attributes</div>
            <div className="flex flex-wrap gap-2">
              {pet.attributes?.map((attr: string) => (
                <span key={attr} className="px-2 py-1 text-xs rounded bg-gray-100">
                  {attr}
                </span>
              ))}
            </div>
          </div>

          <Detail
            label="Weight"
            value={
              pet.weightKg !== undefined && pet.weightKg !== null
                ? Number(pet.weightKg).toFixed(2)
                : "—"
            }
          />
        </div>

        <hr />

        <div>
          <div className="text-sm font-medium mb-1">Notes</div>
          <div className="text-sm text-gray-500">{pet.notes ?? "N/A"}</div>
        </div>

        <div>
          <div className="text-sm font-medium mb-1">Customer's Notes</div>
          <div className="text-sm text-gray-500">
            {pet.customerNotes ?? "N/A"}
          </div>
        </div>
      </div>
    );
  }

  // EDIT MODE
  return (
    <div className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}

      <input
        className="border p-2 w-full"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Name"
      />

      <select
        className="border p-2 w-full"
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option value="">Select Type</option>
        <option value="Dog">Dog</option>
        <option value="Cat">Cat</option>
        <option value="Other">Other</option>
      </select>

      <input
        className="border p-2 w-full"
        value={form.breed}
        onChange={(e) => setForm({ ...form, breed: e.target.value })}
        placeholder="Breed"
      />

      <select
        className="border p-2 w-full"
        value={form.size}
        onChange={(e) => setForm({ ...form, size: e.target.value })}
      >
        <option value="">Select Size</option>
        <option value="Small">Small</option>
        <option value="Medium">Medium</option>
        <option value="Large">Large</option>
      </select>

      {/* Gender + Neutered */}
      <div className="border p-2 rounded">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.gender?.includes("Neutered")}
            onChange={(e) => {
              const base = form.gender?.includes("Female") ? "Female" : "Male";
              setForm({
                ...form,
                gender: e.target.checked ? `Neutered - ${base}` : base,
              });
            }}
          />
          Neutered
        </label>

        <div className="flex gap-4 mt-2 text-sm">
          {["Male", "Female"].map((g) => (
            <label key={g} className="flex items-center gap-1">
              <input
                type="radio"
                checked={form.gender?.includes(g)}
                onChange={() => {
                  const neutered = form.gender?.includes("Neutered");
                  setForm({
                    ...form,
                    gender: neutered ? `Neutered - ${g}` : g,
                  });
                }}
              />
              {g}
            </label>
          ))}
        </div>
      </div>

      <input
        className="border p-2 w-full"
        type="date"
        value={form.dob}
        onChange={(e) => setForm({ ...form, dob: e.target.value })}
      />

      <input
        className="border p-2 w-full"
        type="number"
        step="0.01"
        value={form.weightKg}
        onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
        placeholder="Weight (kg)"
      />

      <div className="flex gap-2 flex-wrap">
        {["Barks", "Blind", "Escaper"].map((attr) => (
          <button
            key={attr}
            type="button"
            onClick={() =>
              setForm({
                ...form,
                attributes: form.attributes.includes(attr)
                  ? form.attributes.filter((a: string) => a !== attr)
                  : [...form.attributes, attr],
              })
            }
            className={`px-2 py-1 border rounded text-sm ${
              form.attributes.includes(attr) ? "bg-blue-100" : ""
            }`}
          >
            {attr}
          </button>
        ))}
      </div>

      <button onClick={save} className="bg-blue-600 text-white px-4 py-2 rounded">
        Save
      </button>
    </div>
  );
}

function Detail({ label, value }: any) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium">{value ?? "—"}</div>
    </div>
  );
}
