"use client";

import { CldUploadWidget } from "next-cloudinary";
import { X, ImagePlus } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  return (
    <CldUploadWidget
      uploadPreset="ecom-preset"
      onSuccess={(result: any) => {
        onChange(result.info.secure_url);
      }}
    >
      {({ open }) => {
        return (
          <div className="flex flex-col items-center justify-center">
            {value ? (
              // PREVIEW CONTAINER
              <div className="relative mb-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-center items-center p-2">
                
                {/* FORCE IMAGE SIZE HERE */}
                <img
                  src={value}
                  alt="Upload preview"
                  style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain' }}
                />
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange("");
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-md"
                  type="button"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              // UPLOAD BUTTON
              <div
                onClick={() => open()}
                className="w-full cursor-pointer border-dashed border-2 border-gray-300 p-8 text-center rounded-lg hover:bg-gray-50 transition flex flex-col items-center justify-center gap-2"
              >
                <div className="bg-gray-100 p-3 rounded-full">
                  <ImagePlus className="h-6 w-6 text-gray-500" />
                </div>
                <div className="text-gray-600 font-medium">Click to Upload Image</div>
              </div>
            )}
            
            <input type="hidden" name="imageUrl" value={value} />
          </div>
        );
      }}
    </CldUploadWidget>
  );
}