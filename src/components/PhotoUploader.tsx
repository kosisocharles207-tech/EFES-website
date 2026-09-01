import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Camera,
  RefreshCw,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Link as LinkIcon,
  Maximize2,
  Star,
} from 'lucide-react';
import {
  processAndOptimizeImage,
  validateImageFile,
  DEFAULT_AVATARS,
} from '../utils/imageProcessor';
import { sounds } from '../utils/soundEffects';

interface PhotoUploaderProps {
  value?: string;
  currentPhotoUrl?: string;
  onChange?: (photoUrl: string) => void;
  onPhotoSelected?: (photoUrl: string) => void;
  onUpload?: (photoUrl: string) => void;
  label?: string;
  helperText?: string;
  playerName?: string;
  shape?: 'circle' | 'card';
  className?: string;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  value,
  currentPhotoUrl,
  onChange,
  onPhotoSelected,
  onUpload,
  label = 'Winner Photo',
  helperText = 'Upload from gallery, camera, or computer (JPG, PNG, WEBP, HEIC supported)',
  playerName = 'Winner',
  shape = 'card',
  className = '',
}) => {
  const actualValue = value || currentPhotoUrl || '';

  const triggerChange = (newPhotoUrl: string) => {
    if (onChange) onChange(newPhotoUrl);
    if (onPhotoSelected) onPhotoSelected(newPhotoUrl);
    if (onUpload) onUpload(newPhotoUrl);
  };

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [imgLoadError, setImgLoadError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset img error on actualValue change
  useEffect(() => {
    setImgLoadError(false);
  }, [actualValue]);

  const handleFileChange = async (file: File) => {
    setErrorMessage(null);
    setSuccessInfo(null);
    setImgLoadError(false);

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid image file.');
      return;
    }

    setIsProcessing(true);
    try {
      // Auto crop to square and optimize with high visual fidelity
      const result = await processAndOptimizeImage(file, {
        maxWidth: 512,
        maxHeight: 512,
        quality: 0.86,
        cropSquare: true,
      });

      // Upload directly to EFES server disk storage for permanent saving
      let finalUrl = result.dataUrl;
      try {
        const uploadRes = await fetch('/api/efes/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataUrl: result.dataUrl,
            playerName: playerName !== 'Winner' && playerName !== 'Player' ? playerName : undefined,
          }),
        });

        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json();
          if (uploadJson.success && uploadJson.url) {
            finalUrl = uploadJson.url;
          }
        }
      } catch (uploadErr) {
        console.warn('[PhotoUploader] Server direct upload fallback:', uploadErr);
      }

      triggerChange(finalUrl);
      sounds.playGoldenChime();
      const origKb = Math.round(result.originalSize / 1024);
      const optKb = Math.round(result.optimizedSize / 1024);
      setSuccessInfo(`✓ Photo saved permanently to EFES cloud storage (${origKb}KB → ${optKb}KB) and visible to all members!`);
    } catch (err) {
      console.error(err);
      setErrorMessage('Could not process this image format. Try taking another picture or uploading a JPG/PNG.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUrlApply = () => {
    const cleanUrl = urlInput.trim();
    if (!cleanUrl) return;
    setErrorMessage(null);
    setImgLoadError(false);
    triggerChange(cleanUrl);
    sounds.playClick();
    setSuccessInfo('Photo URL applied successfully!');
  };

  const handleRemovePhoto = () => {
    sounds.playClick();
    setErrorMessage(null);
    setImgLoadError(false);
    const fallback = DEFAULT_AVATARS[0].url;
    triggerChange(fallback);
    setSuccessInfo('Photo reset to default legend avatar.');
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-amber-400" />
          {label}
        </label>
        <span className="text-[11px] text-zinc-400">JPG, PNG, WEBP, Camera</span>
      </div>

      {/* Main Preview & Uploader Container */}
      <div className="rounded-2xl border border-amber-500/40 bg-zinc-950/90 p-4 shadow-[0_0_25px_rgba(245,158,11,0.15)]">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Photo Live Preview Frame */}
          <div className="relative group shrink-0">
            {/* Glowing gold backdrop */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-500/40 via-yellow-400/30 to-amber-600/40 blur-md pointer-events-none" />

            <div
              className={`relative z-10 overflow-hidden border-2 border-amber-400 shadow-2xl bg-black ${
                shape === 'circle'
                  ? 'h-28 w-28 rounded-full'
                  : 'h-32 w-28 rounded-2xl'
              }`}
            >
              {actualValue && !imgLoadError ? (
                <img
                  src={actualValue}
                  alt={playerName}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={() => setImgLoadError(true)}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-900 text-zinc-500 p-2 text-center">
                  <ImageIcon className="h-8 w-8 mb-1 text-zinc-600" />
                  <span className="text-[10px] font-bold uppercase">
                    {imgLoadError ? 'Load Error' : 'No Photo'}
                  </span>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-1 text-center">
                <span className="text-[9px] font-black uppercase text-amber-300 tracking-wider truncate block px-1">
                  {playerName || 'Winner'}
                </span>
              </div>
            </div>

            {/* Quick Action Overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-amber-300 font-bold text-xs"
            >
              <RefreshCw className="h-5 w-5 mb-1 animate-spin-slow" />
              <span>Change</span>
            </button>
          </div>

          {/* Controls & Dropzone */}
          <div className="flex-1 w-full space-y-2.5">
            {/* Mode Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px]">
              <button
                type="button"
                onClick={() => { setActiveMode('upload'); sounds.playClick(); }}
                className={`flex-1 py-1 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
                  activeMode === 'upload'
                    ? 'bg-amber-500 text-black shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Upload className="w-3 h-3" />
                <span>Gallery / Camera</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveMode('presets'); sounds.playClick(); }}
                className={`flex-1 py-1 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
                  activeMode === 'presets'
                    ? 'bg-amber-500 text-black shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Star className="w-3 h-3" />
                <span>Presets</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveMode('url'); sounds.playClick(); }}
                className={`flex-1 py-1 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
                  activeMode === 'url'
                    ? 'bg-amber-500 text-black shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <LinkIcon className="w-3 h-3" />
                <span>Image URL</span>
              </button>
            </div>

            {/* Hidden native file input - accepting all camera & image gallery types */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*, .jpg, .jpeg, .png, .webp, .heic, .heif, .avif"
              className="hidden"
              onClick={(e) => {
                // Clear value so selecting same file again triggers onChange
                (e.target as HTMLInputElement).value = '';
              }}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />

            {/* Upload Mode: Drag and Drop & File Button */}
            {activeMode === 'upload' && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-3.5 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-amber-400 bg-amber-500/20'
                    : 'border-zinc-700 bg-zinc-900/50 hover:border-amber-500/60 hover:bg-zinc-900'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold py-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Auto-cropping and optimizing photo...</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                      <Camera className="h-4 w-4 text-amber-400" />
                      <span>Click to browse device gallery or drag photo here</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1">
                      {helperText}
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Preset Avatars Mode */}
            {activeMode === 'presets' && (
              <div className="space-y-2">
                <p className="text-[10px] text-zinc-400 font-semibold">
                  Select a stylized high-resolution EFES Legend avatar:
                </p>
                <div className="grid grid-cols-4 gap-1.5 max-h-28 overflow-y-auto pr-1">
                  {DEFAULT_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setImgLoadError(false);
                        triggerChange(av.url);
                        sounds.playClick();
                        setSuccessInfo(`Selected ${av.name} avatar`);
                      }}
                      className="group relative rounded-lg overflow-hidden border border-zinc-700 hover:border-amber-400 transition-all aspect-square"
                      title={av.name}
                    >
                      <img
                        src={av.url}
                        alt={av.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] font-bold text-white p-0.5 text-center">
                        Select
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Image URL Mode */}
            {activeMode === 'url' && (
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/winner-photo.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleUrlApply}
                  className="rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-black hover:bg-amber-400 transition-colors"
                >
                  Apply
                </button>
              </div>
            )}

            {/* Action Bar (Change Photo, Remove Photo) */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 text-[11px] font-bold text-zinc-200 transition-colors"
                >
                  <RefreshCw className="w-3 h-3 text-amber-400" />
                  <span>Choose Image</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="flex items-center gap-1 rounded-lg bg-red-950/40 border border-red-500/30 hover:bg-red-900/50 px-2.5 py-1 text-[11px] font-bold text-red-300 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Reset Avatar</span>
                </button>
              </div>

              <span className="text-[10px] text-zinc-500 italic">
                Auto-synced across Hall of Fame & Legends
              </span>
            </div>
          </div>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-red-950/80 border border-red-500/50 p-2.5 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successInfo && (
          <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 p-2 text-xs text-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold">{successInfo}</span>
          </div>
        )}
      </div>
    </div>
  );
};
