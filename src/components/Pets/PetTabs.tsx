import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePet } from "../../api/petApi";
import { toast } from "../common/toast";
import PhotosTab from "./PhotoTab";
import VaccinationsTab from "./VaccinationTab";
import GroomingTab from "./GroomingTab";
import BookingsTab from "./BookingTab";
import PetDetails from "./PetDetails";

const tabs = ["Pet Details", "Photos", "Vaccinations", "Grooming", "Bookings"];

export default function PetTabs({ pet, isEditing, onDoneEdit }: any) {
  const [active, setActive] = useState("Pet Details");

  if (!pet) return null;

  return (
    <div className="flex h-full max-md:flex-col">
      {/* Tab list */}
      <div
        className="w-40 max-md:w-full max-md:flex border-r max-md:border-r-0 max-md:border-b bg-gray-50"
        role="tablist"
        aria-orientation="vertical"
      >
        {tabs.map((tab) => {
          const isActive = active === tab;

          return (
            <button
              key={tab}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(tab)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(tab);
                }
              }}
              className={`w-full text-left px-4 py-3 text-sm outline-none
              focus-visible:ring-2 focus-visible:ring-blue-500
              ${
                isActive
                  ? "bg-white font-medium border-l-4 max-md:border-l-0 max-md:border-b-4 border-blue-500"
                  : "text-gray-600 hover:bg-gray-100"
              }
            `}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="flex-1 p-4 overflow-y-auto text-sm" role="tabpanel">
        {active === "Pet Details" && (
          <PetDetails pet={pet} isEditing={isEditing} onDoneEdit={onDoneEdit} />
        )}

        {active === "Photos" && <PhotosTab pet={pet} />}

        {active === "Vaccinations" && (
          <VaccinationsTab items={pet.vaccinations || []} petId={pet.id} />
        )}

        {active === "Grooming" && <GroomingTab items={pet.grooming || []} />}

        {active === "Bookings" && <BookingsTab items={pet.bookings || []} />}
      </div>
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
