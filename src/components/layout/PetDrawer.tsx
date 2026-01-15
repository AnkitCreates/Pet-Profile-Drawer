import { useState, useEffect } from "react";
import PetTabs from "../pets/PetTabs";
import { getAgeFromDob } from "../../utils/age";
import { updatePet } from "../../api/petApi";
import { deactivatePet } from "../../api/petApi";

export default function PetDrawer({ pet, onClose }: any) {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [reason, setReason] = useState("");

  const deactivate = async () => {
    await updatePet({
      ...pet,
      status: "Inactive",
      deactivationReason: reason,
    });
    setShowDeactivate(false);
  };

  // 🔥 Reset edit mode when a new pet is opened
  useEffect(() => {
    setIsEditing(false);
    setShowActions(false);
  }, [pet]);

  if (!pet) return null;

  return (
    <div
      className="fixed right-0 top-0 w-[65vw] max-w-[900px] h-full
                    bg-white shadow-xl flex flex-col
                    transition-transform duration-300"
    >
      {/* Header */}
      {pet.attributes?.includes("Escaper") && (
        <div
          role="alert"
          className="mx-4 mt-2 mb-1 rounded border border-amber-200 bg-amber-50
               px-3 py-2 text-xs text-amber-800 flex items-center gap-2"
        >
          <span className="font-semibold">⚠ Risk:</span>
          This pet is marked as an <span className="font-medium">Escaper</span>.
          Extra care is required during handling and boarding.
        </div>
      )}

      {showDeactivate && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-[320px]">
            <div className="font-medium mb-2">Deactivate {pet.name}</div>

            <textarea
              className="w-full border p-2 text-sm"
              placeholder="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setShowDeactivate(false)}
                className="px-3 py-1 text-sm"
              >
                Cancel
              </button>

              {/* <button
                onClick={async () => {
                  await updatePet({
                    ...pet,
                    status: "Inactive",
                    deactivationReason: reason,
                  });

                  setShowDeactivate(false);
                  setReason("");
                }}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded"
              >
                Deactivate
              </button> */}
              <button
                onClick={async () => {
                  await deactivatePet(pet.id, reason);
                  setShowDeactivate(false);
                }}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded"
              >
                Deactivate
              </button>
              
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-b relative">
        <button onClick={onClose} className="text-sm text-gray-500 mb-2">
          ← Back
        </button>

        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
            {pet.photos?.[0] ? (
              <img
                src={pet.photos[0]}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                🐾
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="font-bold text-lg">{pet.name}</div>
            <div className="flex gap-2 items-center">
              <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">
                {pet.status}
              </span>
              <span className="text-xs text-gray-500">
                Age: {getAgeFromDob(pet.dob)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="relative">
            <button
              onClick={() => setShowActions((v) => !v)}
              className="border px-3 py-1 rounded text-sm"
            >
              Actions ▾
            </button>

            {showActions && (
              <div className="absolute right-0 mt-1 w-40 border bg-white shadow rounded text-sm">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowActions(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    setShowDeactivate(true);
                    setShowActions(false);
                  }}
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100"
                >
                  Deactivate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <PetTabs
          pet={pet}
          isEditing={isEditing}
          onDoneEdit={() => setIsEditing(false)}
        />
      </div>
    </div>
  );
}
