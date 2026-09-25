import React, { useRef, useState } from 'react';
import { UploadCloud, X, Star, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  existingImages: string[];
  newFiles: File[];
  onExistingImagesChange: (images: string[]) => void;
  onNewFilesChange: (files: File[]) => void;
  maxImages?: number;
}

const isValidRemoteUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  existingImages,
  newFiles,
  onExistingImagesChange,
  onNewFilesChange,
  maxImages = 6,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | File[]) => {
    const selectedFiles = Array.from(files).filter(
      (file) => file.type.startsWith('image/') && /\.(jpg|jpeg|png|webp)$/i.test(file.name)
    );

    if (selectedFiles.length === 0) return;

    const remainingSlots = maxImages - (existingImages.length + newFiles.length);
    if (remainingSlots <= 0) return;

    onNewFilesChange([...newFiles, ...selectedFiles.slice(0, remainingSlots)]);
  };

  const imageEntries = [
    ...existingImages.map((url) => ({
      id: `existing-${url}`,
      kind: 'existing' as const,
      preview: url,
    })),
    ...newFiles.map((file, index) => ({
      id: `new-${index}-${file.name}-${file.lastModified}`,
      kind: 'new' as const,
      preview: URL.createObjectURL(file),
    })),
  ];

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
          }
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          isDragging ? 'border-[#263B86] bg-blue-50/50' : 'border-slate-300 hover:border-[#263B86] bg-[#F6F7FA]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              handleFiles(e.target.files);
              e.target.value = '';
            }
          }}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center mx-auto mb-3 text-[#263B86]">
          <UploadCloud className="w-6 h-6" />
        </div>

        <p className="text-xs sm:text-sm font-bold text-[#15265A] mb-1">
          Glissez-déposez vos photos ou <span className="text-[#263B86] underline">parcourez vos fichiers</span>
        </p>
        <p className="text-[11px] text-[#667085]">
          JPG, JPEG, PNG ou WebP (jusqu'à {maxImages} photos max)
        </p>
      </div>

      <div className="flex items-center justify-end text-xs">
        <span className="text-slate-400 tabular-nums">
          {existingImages.length + newFiles.length} / {maxImages} photos
        </span>
      </div>

      {imageEntries.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {imageEntries.map((item, idx) => {
            const isRenderable = item.kind === 'new' || isValidRemoteUrl(item.preview);
            const handleDelete = () => {
              if (item.kind === 'existing') {
                const next = existingImages.filter((url) => url !== item.preview);
                onExistingImagesChange(next);
                return;
              }

              const next = newFiles.filter((_, fileIndex) => fileIndex !== idx - existingImages.length);
              onNewFilesChange(next);
            };

            return (
              <div
                key={item.id}
                className="group relative aspect-4/3 rounded-xl border border-slate-200 bg-slate-100 overflow-hidden shadow-xs"
              >
                {isRenderable ? (
                  <img src={item.preview} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                ) : null}

                {!isRenderable && (
                  <div className="absolute inset-0 flex items-center justify-center flex-col gap-1 text-center text-[10px] font-bold uppercase tracking-wide text-slate-500 bg-slate-100">
                    <ImageIcon className="w-4 h-4" />
                    <span>Image indisponible</span>
                  </div>
                )}

                {idx === 0 && (
                  <div className="absolute top-2 start-2 bg-[#263B86] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-current text-white" />
                    <span>PHOTO PRINCIPALE</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end p-2">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="p-1 rounded bg-red-600/90 hover:bg-red-700 text-white text-xs transition-colors cursor-pointer"
                    title="Supprimer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
