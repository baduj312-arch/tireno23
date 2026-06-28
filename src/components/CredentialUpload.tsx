import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Check, X, FileText, Image, Loader2, Shield, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CredentialUploadProps {
  providerId?: string;
  onUploadComplete?: (urls: string[]) => void;
}

export default function CredentialUpload({ providerId = 'guest', onUploadComplete }: CredentialUploadProps) {
  const [uploads, setUploads] = useState<{
    nationalId: { file: File | null; url: string; status: 'idle' | 'uploading' | 'done' | 'error' };
    workshopPhoto: { file: File | null; url: string; status: 'idle' | 'uploading' | 'done' | 'error' };
    businessLicense: { file: File | null; url: string; status: 'idle' | 'uploading' | 'done' | 'error' };
  }>({
    nationalId: { file: null, url: '', status: 'idle' },
    workshopPhoto: { file: null, url: '', status: 'idle' },
    businessLicense: { file: null, url: '', status: 'idle' },
  });

  const docTypes = [
    { key: 'nationalId' as const, label: 'National ID', desc: 'Ghana Card, Passport, or Voter ID', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { key: 'workshopPhoto' as const, label: 'Workshop Photo', desc: 'Clear photo of your workshop/location', icon: Image, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    { key: 'businessLicense' as const, label: 'Business License', desc: 'GRA certificate or business registration', icon: FileText, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  ];

  const handleFileSelect = useCallback(async (key: typeof docTypes[0]['key'], file: File) => {
    setUploads(prev => ({
      ...prev,
      [key]: { ...prev[key], file, status: 'uploading' },
    }));

    try {
      const filePath = `providers/${providerId}/${key}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('credentials')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('credentials').getPublicUrl(filePath);

      setUploads(prev => ({
        ...prev,
        [key]: { file, url: data.publicUrl, status: 'done' },
      }));

      // Check if all done
      const updated = { ...uploads, [key]: { file, url: data.publicUrl, status: 'done' } };
      const allDone = Object.values(updated).every(u => u.status === 'done');
      if (allDone && onUploadComplete) {
        onUploadComplete(Object.values(updated).map(u => u.url));
      }
    } catch (err) {
      setUploads(prev => ({
        ...prev,
        [key]: { ...prev[key], status: 'error' },
      }));
    }
  }, [providerId, uploads, onUploadComplete]);

  const handleDrop = useCallback((e: React.DragEvent, key: typeof docTypes[0]['key']) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      handleFileSelect(key, file);
    }
  }, [handleFileSelect]);

  return (
    <div className="space-y-3">
      {/* Verification Badge Info */}
      <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Verified Provider Badge</h3>
            <p className="text-white/40 text-xs mt-1 leading-relaxed">
              Upload your credentials to get the verified badge. Verified providers receive 3x more job requests, higher trust scores, and priority matching.
            </p>
          </div>
        </div>
      </div>

      {docTypes.map((doc) => {
        const upload = uploads[doc.key];
        const isDone = upload.status === 'done';
        const isUploading = upload.status === 'uploading';
        const isError = upload.status === 'error';

        return (
          <motion.div
            key={doc.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`card-dark p-4 transition-all ${
              isDone ? 'border-green-500/30' : isError ? 'border-red-500/30' : ''
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl ${doc.bg} flex items-center justify-center border ${doc.border}`}>
                <doc.icon size={20} className={doc.color} />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">{doc.label}</p>
                <p className="text-white/30 text-xs">{doc.desc}</p>
              </div>
              <AnimatePresence mode="wait">
                {isDone && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30"
                  >
                    <Check size={16} className="text-green-400" />
                  </motion.div>
                )}
                {isUploading && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center"
                  >
                    <Loader2 size={16} className="text-white/50 animate-spin" />
                  </motion.div>
                )}
                {isError && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30"
                  >
                    <AlertCircle size={16} className="text-red-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Upload Area */}
            {!isDone && (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, doc.key)}
                className="border-2 border-dashed border-white/[0.08] rounded-xl p-6 text-center hover:border-white/20 transition-colors cursor-pointer"
                onClick={() => document.getElementById(`file-${doc.key}`)?.click()}
              >
                <input
                  id={`file-${doc.key}`}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(doc.key, e.target.files[0])}
                />
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center mx-auto mb-2">
                  <Upload size={20} className="text-white/30" />
                </div>
                <p className="text-white/40 text-sm">Drop file here or click to upload</p>
                <p className="text-white/20 text-xs mt-1">JPG, PNG, PDF up to 10MB</p>
              </div>
            )}

            {/* Preview */}
            <AnimatePresence>
              {isDone && upload.url && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3"
                >
                  <div className="relative rounded-xl overflow-hidden border border-white/[0.06]">
                    <img src={upload.url} alt={doc.label} className="w-full h-32 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-tireno-dark/80 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <span className="text-white text-xs font-medium">{doc.label} uploaded</span>
                      <button
                        onClick={() => setUploads(prev => ({ ...prev, [doc.key]: { file: null, url: '', status: 'idle' } }))}
                        className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                      >
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
