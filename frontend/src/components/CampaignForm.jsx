import React, { useState } from 'react';

export default function CampaignForm({ fields, onSubmit }) {
  const [form, setForm] = useState(() => {
    const obj = {};
    fields.forEach(f => obj[f.name] = '');
    obj.images = [];
    obj.video = null;
    return obj;
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [previewVideo, setPreviewVideo] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    setForm({ ...form, images: [...e.target.files] });
    setPreviewImages(Array.from(e.target.files).map(f => URL.createObjectURL(f)));
  };
  const handleVideoChange = (e) => {
    setForm({ ...form, video: e.target.files[0] });
    setPreviewVideo(e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : null);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm(fields.reduce((acc, f) => ({ ...acc, [f.name]: '' }), { images: [], video: null }));
    setPreviewImages([]);
    setPreviewVideo(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 flex flex-col gap-3">
      <div className="text-lg font-semibold text-blue-900 mb-1">Create Campaign</div>
      {fields.map(f => (
        <div key={f.name} className="flex flex-col gap-1">
          <label className="font-medium text-slate-700">{f.label}</label>
          <input
            type={f.type || 'text'}
            name={f.name}
            value={form[f.name]}
            onChange={handleChange}
            className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required={f.required}
          />
        </div>
      ))}
      <div className="flex flex-col gap-1">
        <label className="font-medium text-slate-700">Upload Images</label>
        <input type="file" accept="image/*" multiple onChange={handleImageChange} />
        <div className="flex gap-2 mt-1">
          {previewImages.map((src, i) => (
            <img key={i} src={src} alt="preview" className="w-12 h-12 rounded object-cover" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-medium text-slate-700">Upload Video</label>
        <input type="file" accept="video/*" onChange={handleVideoChange} />
        {previewVideo && (
          <video src={previewVideo} controls className="w-32 h-20 rounded mt-1" />
        )}
      </div>
      <button type="submit" className="mt-2 px-6 py-2 bg-[#003B73] hover:bg-[#003366] text-white rounded-lg font-medium transition-colors">Submit</button>
    </form>
  );
}
