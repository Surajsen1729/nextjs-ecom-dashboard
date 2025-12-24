"use client";

import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  return (
    <CldUploadWidget
      uploadPreset="ecom-preset" // Make sure this matches what you created in Cloudinary!
      onSuccess={(result: any) => {
        onChange(result.info.secure_url);
      }}
    >
      {({ open }) => {
        return (
          <div
            onClick={() => open()}
            className="cursor-pointer border-dashed border-2 border-gray-300 p-6 text-center rounded hover:bg-gray-50 transition"
          >
            {value ? (
              <div className="relative h-40 w-full">
                <img
                  src={value}
                  alt="Upload"
                  className="object-contain h-full w-full mx-auto"
                />
              </div>
            ) : (
              <div className="text-gray-500">
                <span className="block text-2xl mb-2">📷</span>
                <span className="font-medium">Click to Upload Image</span>
              </div>
            )}
            {/* Hidden input to ensure the URL gets submitted in the form */}
            <input type="hidden" name="imageUrl" value={value} />
          </div>
        );
      }}
    </CldUploadWidget>
  );
}