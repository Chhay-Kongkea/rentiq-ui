"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Camera,
  ChevronDown,
  Info,
  Image as ImageIcon,
  X,
} from "lucide-react";

export default function ReportUser() {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const maxChars = 2000;
  const maxFiles = 5;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (images.length + selectedFiles.length <= maxFiles) {
        setImages((prev) => [...prev, ...selectedFiles]);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ category, description, images });
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen bg-background text-app-text p-6 md:p-12 font-sans flex flex-col items-center justify-center">
      {/* Header Title */}
      <h1 className="text-header font-bold text-center mb-8 text-new-blue">
        Report <span className="text-new-red">User</span>
      </h1>

      {/* Main Card Container */}
      <div className="w-full max-w-3xl bg-card border border-third/60 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Top Reporting Item Banner */}
        <div className="bg-blue-50/60 p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-100/60">
          <div className="flex items-center gap-4">
            {/* Item Thumbnail */}
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
              <img
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80"
                alt="Sony Alpha A7 IV Kit"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Item Information */}
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-new-red">
                Reporting Item
              </span>
              <h2 className="text-heading-2 font-bold text-app-text">
                Sony Alpha A7 IV Kit
              </h2>
              <p className="text-sm text-app-text/70 mt-0.5">
                Order ID: <span className="font-medium text-app-text">#VR-9283-X10</span> • Rented from{" "}
                <span className="font-medium text-app-text">Alex Thompson</span>
              </p>
            </div>
          </div>

          {/* High Priority Tag */}
          <div className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-new-red text-xs font-semibold shrink-0">
            <AlertCircle className="w-3.5 h-3.5 fill-new-red text-red-100" />
            <span>High Priority</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-8">
          
          {/* 1. Nature of the Issue */}
          <div className="flex flex-col gap-2">
            <h3 className="text-heading-2 font-bold text-app-text">
              1. Nature of the Issue
            </h3>
            <p className="text-label text-app-text/70 mb-1">
              Select the category that best describes your experience.
            </p>

            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none bg-blue-50/50 border border-blue-100/80 rounded-xl py-3.5 px-4 text-english text-app-text focus:outline-none focus:ring-2 focus:ring-new-blue/30 transition-all cursor-pointer"
              >
                <option value="" disabled>
                  Select a report category...
                </option>
                <option value="item_damaged">Item Damaged</option>
                <option value="late_return">Late Return</option>
                <option value="unresponsive_owner">Unresponsive Owner / Renter</option>
                <option value="fraud">Fraud or Misrepresentation</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown className="w-5 h-5 text-app-text/50 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 2. Detailed Description */}
          <div className="flex flex-col gap-2">
            <h3 className="text-heading-2 font-bold text-app-text">
              2. Detailed Description
            </h3>
            <p className="text-label text-app-text/70 mb-1">
              Please provide as much detail as possible to help our trust & safety team investigate.
            </p>

            <div className="relative">
              <textarea
                rows={5}
                maxLength={maxChars}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what happened, including dates, times, and specific details..."
                className="w-full bg-blue-50/50 border border-blue-100/80 rounded-xl p-4 text-english text-app-text focus:outline-none focus:ring-2 focus:ring-new-blue/30 transition-all resize-none placeholder:text-app-text/40"
              />
              <div className="text-right text-xs text-app-text/50 mt-1 font-medium">
                {description.length}/{maxChars} characters
              </div>
            </div>
          </div>

          {/* 3. Evidence Photos */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-heading-2 font-bold text-app-text">
                3. Evidence Photos <span className="font-normal text-app-text/60">(Optional)</span>
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 bg-blue-100/80 text-new-blue rounded-md">
                {images.length}/{maxFiles} Files
              </span>
            </div>
            <p className="text-label text-app-text/70 mb-2">
              Upload up to 5 clear photos of the damage or relevant screenshots.
            </p>

            {/* Photo Grids */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {/* Upload Button Box */}
              {images.length < maxFiles && (
                <label className="border-2 border-dashed border-red-200/80 hover:border-new-red bg-card rounded-xl h-28 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors text-new-red">
                  <Camera className="w-6 h-6" />
                  <span className="text-xs font-semibold">Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}

              {/* Uploaded Images Preview */}
              {images.map((file, idx) => (
                <div
                  key={idx}
                  className="relative h-28 rounded-xl overflow-hidden bg-blue-50 border border-blue-100 group"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Blank Slots Placeholder */}
              {Array.from({ length: maxFiles - Math.max(images.length + (images.length < maxFiles ? 1 : 0), 0) }).map(
                (_, idx) => (
                  <div
                    key={`placeholder-${idx}`}
                    className="h-28 rounded-xl bg-blue-50/50 border border-blue-100/60 flex items-center justify-center text-blue-200"
                  >
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )
              )}
            </div>
          </div>

          <hr className="border-border/60 my-2" />

          {/* Bottom Actions & Disclaimer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-2.5 text-xs text-app-text/70 max-w-md">
              <Info className="w-4 h-4 text-new-red shrink-0 mt-0.5" />
              <span>
                By submitting this report, you confirm that the information provided is accurate and truthful. False reporting may lead to account suspension.
              </span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-secondary hover:bg-new-red text-primary-foreground font-bold px-8 py-3.5 rounded-2xl shadow-sm transition-all duration-200 text-in-button shrink-0"
            >
              Submit Report
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}