import React, { useRef, useState } from 'react';
import { Upload, X, Image } from 'lucide-react';

const ThumbnailUpload = ({ onImageSelect, preview, label = 'Upload Thumbnail' }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    // Read and preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageSelect?.(file, e.target.result);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block">
        {label}
      </label>

      {preview ? (
        <div className="glass-card rounded-xl p-4 border border-white/50 dark:border-white/10 space-y-3 animate-fade-in-up">
          <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20">
            <img
              src={preview}
              alt="Thumbnail preview"
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => {
                onImageSelect?.(null, null);
                setError(null);
              }}
              className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-[var(--text-muted)]">Click button below to change image</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-2 bg-blue-500/20 text-blue-700 dark:text-blue-300 hover:bg-blue-500/30 rounded-lg transition-colors border border-blue-500/30 text-sm font-medium"
          >
            Change Image
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`glass-card rounded-xl p-8 border-2 border-dashed transition-all cursor-pointer animate-fade-in-up ${
            dragActive
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-[var(--border-glass)] hover:border-purple-500/50'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className={`p-3 rounded-lg ${dragActive ? 'bg-purple-500/20' : 'bg-black/5 dark:bg-white/5'}`}>
              {dragActive ? (
                <Upload className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              ) : (
                <Image className="w-6 h-6 text-[var(--text-secondary)]" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {dragActive ? 'Drop image here' : 'Drag image here or click to select'}
              </p>
              <p className="text-xs text-[var(--text-muted)]">PNG, JPG, GIF (max 5MB)</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFile(e.target.files[0]);
          }
        }}
        className="hidden"
      />
    </div>
  );
};

export default ThumbnailUpload;
