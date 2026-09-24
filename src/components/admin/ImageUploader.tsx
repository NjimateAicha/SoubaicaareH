import React, { useState, useRef } from 'react';
import { UploadCloud, X, Star, ArrowLeft, ArrowRight, Image as ImageIcon, Link as LinkIcon, Plus } from 'lucide-react';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 6,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlBox, setShowUrlBox] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newImgs: string[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newImgs.push(event.target.result as string);
            if (newImgs.length === files.length) {
              onChange([...images, ...newImgs].slice(0, maxImages));
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange([...images, urlInput.trim()].slice(0, maxImages));
      setUrlInput('');
      setShowUrlBox(false);
    }
  };

  const handleDelete = (index: number) => {
    const next = [...images];
    next.splice(index, 1);
    onChange(next);
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const next = [...images];
    const item = next.splice(fromIndex, 1)[0];
    next.splice(toIndex, 0, item);
    onChange(next);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    handleMove(index, 0);
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#263B86] bg-blue-50/50'
            : 'border-slate-300 hover:border-[#263B86] bg-[#F6F7FA]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />
        <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center mx-auto mb-3 text-[#263B86]">
          <UploadCloud className="w-6 h-6" />
        </div>
        <p className="text-xs sm:text-sm font-bold text-[#15265A] mb-1">
          Glissez-déposez vos photos ou <span className="text-[#263B86] underline">parcourez vos fichiers</span>
        </p>
        <p className="text-[11px] text-[#667085]">
          PNG, JPG ou WebP (jusqu'à {maxImages} photos max)
        </p>
      </div>

      {/* Alternative URL button */}
      <div className="flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => setShowUrlBox(!showUrlBox)}
          className="inline-flex items-center gap-1.5 text-[#263B86] hover:text-[#15265A] font-semibold cursor-pointer"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>{showUrlBox ? 'Masquer ajout par lien URL' : 'Ajouter une photo par lien URL direct'}</span>
        </button>
        <span className="text-slate-400 tabular-nums">
          {images.length} / {maxImages} photos
        </span>
      </div>

      {/* URL Input Drawer */}
      {showUrlBox && (
        <div className="p-3 bg-white border border-slate-200 rounded-xl flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://exemple.com/photos/duster-4x4.jpg"
            className="flex-1 bg-[#F6F7FA] border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-[#15265A] focus:outline-hidden focus:ring-1 focus:ring-[#263B86]"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-1.5 bg-[#263B86] hover:bg-[#15265A] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Ajouter
          </button>
        </div>
      )}

      {/* Photos Grid & Reorder preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div
              key={`${img}-${idx}`}
              className="group relative aspect-4/3 rounded-xl border border-slate-200 bg-slate-900 overflow-hidden shadow-xs"
            >
              <img
                src={img}
                alt={`Photo ${idx + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Cover badge */}
              {idx === 0 && (
                <div className="absolute top-2 start-2 bg-[#263B86] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-current text-white" />
                  <span>Photo principale</span>
                </div>
              )}

              {/* Hover actions overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDelete(idx)}
                    className="p-1 rounded bg-red-600/90 hover:bg-red-700 text-white text-xs transition-colors cursor-pointer"
                    title="Supprimer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMove(idx, idx - 1)}
                        className="p-1 rounded bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
                        title="Déplacer vers la gauche"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                    )}
                    {idx < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMove(idx, idx + 1)}
                        className="p-1 rounded bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
                        title="Déplacer vers la droite"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(idx)}
                      className="text-[10px] text-white bg-white/20 hover:bg-white/30 px-1.5 py-0.5 rounded font-semibold cursor-pointer"
                    >
                      Mettre en une
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
