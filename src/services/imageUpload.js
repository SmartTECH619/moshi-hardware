export async function uploadProductImage(file) {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.');
  if (file.size > 2 * 1024 * 1024) throw new Error('Image must be smaller than 2 MB.');
  const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  if (!cloud || !preset) throw new Error('Cloudinary is not configured in .env');
  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', preset);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'Image upload failed.');
  return data.secure_url;
}
