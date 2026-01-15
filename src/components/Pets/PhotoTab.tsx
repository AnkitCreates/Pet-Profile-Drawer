import { useState } from "react";

export default function PhotosTab({ pet }: any) {
  const [previews, setPreviews] = useState<string[]>(pet.photos || []);
  const [error, setError] = useState("");

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const file = files[0];
    setError("");

    const validTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Only PNG, JPG, or WEBP allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File must be ≤ 5MB");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviews(prev => [...prev, url]);
  }

  function removePhoto(idx: number) {
    if (!confirm("Delete this photo?")) return;
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}

      <label
        className="block border-2 border-dashed rounded p-6 text-center cursor-pointer hover:bg-gray-50"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          type="file"
          className="hidden"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => handleFiles(e.target.files)}
        />
        Drag & drop or click to upload
      </label>

      <div className="grid grid-cols-3 gap-3">
        {previews.map((src, i) => (
          <div key={i} className="relative group">
            <img src={src} className="w-full h-32 object-cover rounded" />
            <button
              onClick={() => removePhoto(i)}
              className="absolute top-1 right-1 bg-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
            >
              Delete
            </button>
          </div>
        ))}

        {previews.length === 0 && (
          <div className="text-gray-400 text-sm">No photos yet</div>
        )}
      </div>
    </div>
  );
}