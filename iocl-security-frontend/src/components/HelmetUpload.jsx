

// import React, { useState, useRef } from 'react';
// import axios from 'axios';

// const HelmetUpload = () => {
//   const [file, setFile] = useState(null);
//   const [filePreviewUrl, setFilePreviewUrl] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedModel, setSelectedModel] = useState('helmet');
//   const dropRef = useRef(null);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && selectedFile.type.startsWith('video/')) {
//       setFile(selectedFile);
//       setFilePreviewUrl(URL.createObjectURL(selectedFile));
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const droppedFile = e.dataTransfer.files[0];
//     if (droppedFile && droppedFile.type.startsWith('video/')) {
//       setFile(droppedFile);
//       setFilePreviewUrl(URL.createObjectURL(droppedFile));
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     dropRef.current.classList.add('border-blue-400');
//   };

//   const handleDragLeave = () => {
//     dropRef.current.classList.remove('border-blue-400');
//   };

//   const handleUpload = async () => {
//     if (!file) return;
//     setLoading(true);

//     const formData = new FormData();
//     formData.append('video', file);
//     formData.append('model_type', selectedModel);

//     try {
//       await axios.post('http://localhost:8000/api/detect/', formData);
//       alert(' Video processed successfully. Please check the media/result folder.');
//     } catch (err) {
//       console.error('Upload error:', err);
//       alert('Error during upload. Please try again.');
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white">
//       <h1 className="text-4xl font-bold mb-8 text-center">Helmet and PPE Detection</h1>

//       {/* Model Dropdown */}
//       <div className="mb-6 w-full max-w-xs">
//         <label htmlFor="model-select" className="block text-sm mb-2 text-gray-300 font-semibold">
//           Select Detection Model
//         </label>
//         <select
//           id="model-select"
//           value={selectedModel}
//           onChange={(e) => setSelectedModel(e.target.value)}
//           className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-md"
//         >
//           <option value="helmet">🪖 Helmet Detection</option>
//           <option value="ifr">🧥 IFR Suit Detection</option>
//           <option value="boots">🥾 Safety Boots Detection</option>
//           <option value="completeUniform">🛡️ Complete Uniform Detection</option>
//         </select>
//       </div>

//       {/* Drag & Drop Upload */}
//       <div
//         ref={dropRef}
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         className="w-full max-w-xl p-6 border-4 border-dashed border-gray-600 rounded-2xl bg-slate-800 hover:border-blue-400 transition-all duration-300 text-center cursor-pointer mb-6"
//       >
//         <input
//           type="file"
//           accept="video/*"
//           onChange={handleFileChange}
//           className="hidden"
//           id="video-upload"
//         />
//         <label htmlFor="video-upload" className="block w-full h-full">
//           {file ? (
//             <p className="text-lg text-green-400">{file.name}</p>
//           ) : (
//             <p className="text-gray-300">
//               Drag & drop a video file here, or <span className="text-blue-400 underline">browse</span>
//             </p>
//           )}
//         </label>
//       </div>

//       {/* Upload + Live Buttons */}
//       <div className="flex gap-4 mt-2 mb-10 flex-wrap justify-center">
//         <button
//           onClick={handleUpload}
//           disabled={!file || loading}
//           className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300 disabled:opacity-50"
//         >
//           {loading ? 'Processing...' : 'Upload & Detect'}
//         </button>

//         {/* Live Feed Button */}
//         <button
//           onClick={() => {
//             window.open(`http://localhost:8000/api/live/?model_type=${selectedModel}`, '_blank');
//           }}
//           className="mt-4 bg-gradient-to-r from-green-500 to-lime-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
//         >
//           🔴 Start Live Detection
//         </button>
//       </div>

//       {/* Video Preview (single frame) */}
//       {filePreviewUrl && (
//         <div className="w-full max-w-2xl">
//           <h2 className="text-xl mb-3 text-cyan-300 text-center">Uploaded Video Preview:</h2>
//           <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-lg">
//             <video
//               controls
//               src={filePreviewUrl}
//               className="w-full h-full object-contain"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HelmetUpload;


import React, { useState, useRef } from 'react';
import axios from 'axios';

const HelmetUpload = () => {
  const [file, setFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('helmet');
  const dropRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile);
      setFilePreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('video/')) {
      setFile(droppedFile);
      setFilePreviewUrl(URL.createObjectURL(droppedFile));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dropRef.current.classList.add('border-blue-400');
  };

  const handleDragLeave = () => {
    dropRef.current.classList.remove('border-blue-400');
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('video', file);
    formData.append('model_type', selectedModel);

    try {
      await axios.post('http://localhost:8000/api/detect/', formData);
      alert('✅ Video processed successfully. Please check the media/result folder.');
    } catch (err) {
      console.error('Upload error:', err);
      alert('❌ Error during upload. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start px-4 py-12 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white">
      <h1 className="text-4xl font-extrabold mb-6 text-center drop-shadow-md">🎯 Helmet & PPE Detection</h1>

      {/* Model Dropdown */}
      <div className="mb-6 w-full max-w-xs">
        <label htmlFor="model-select" className="block text-sm mb-2 text-gray-300 font-semibold">
          🎛️ Choose Detection Model
        </label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-md"
        >
          <option value="helmet">🪖 Helmet Detection</option>
          <option value="ifr">🧥 IFR Suit Detection</option>
          <option value="boots">🥾 Safety Boots Detection</option>
          <option value="completeUniform">🛡️ Complete Uniform Detection</option>
        </select>
      </div>

      {/* Drag & Drop Upload */}
      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="w-full max-w-2xl p-6 border-4 border-dashed border-gray-600 rounded-2xl bg-slate-800 hover:border-blue-400 transition-all duration-300 text-center cursor-pointer mb-6"
      >
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
          id="video-upload"
        />
        <label htmlFor="video-upload" className="block w-full h-full">
          {file ? (
            <p className="text-lg text-green-400">{file.name}</p>
          ) : (
            <p className="text-gray-300 text-md">
              📁 Drag & drop a video file here, or <span className="text-blue-400 underline">browse</span>
            </p>
          )}
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 flex-wrap justify-center mt-2 mb-10">
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300 disabled:opacity-50"
        >
          {loading ? '⏳ Processing...' : '📤 Upload & Detect'}
        </button>

        <button
          onClick={() => {
            window.open(`http://localhost:8000/api/live/?model_type=${selectedModel}`, '_blank');
          }}
          className="bg-gradient-to-r from-green-500 to-lime-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
        >
          🔴 Start Live Detection
        </button>
      </div>

      {/* Video Preview */}
      {filePreviewUrl && (
        <div className="w-full max-w-3xl px-4">
          <h2 className="text-xl mb-3 text-cyan-300 text-center">🎞️ Uploaded Video Preview</h2>
          <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-blue-500 ring-opacity-30">
            <video
              controls
              src={filePreviewUrl}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HelmetUpload;
