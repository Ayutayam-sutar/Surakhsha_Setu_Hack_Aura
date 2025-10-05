import React, { useState, useCallback, useRef, useEffect } from 'react';

export const FileUpload = ({ onFileSelect }) => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // This function is called for both uploaded files and captured photos
  const processFile = (file) => {
    onFileSelect(file); // This sends the file to the Dashboard component
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      setIsCameraOpen(false); // Always close camera after getting a file
    } else {
      setFileName('');
      setPreview(null);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    processFile(file);
  };

  const handleDragOver = useCallback((event) => event.preventDefault(), []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0] || null;
    processFile(file);
  }, [onFileSelect]);

  const openCamera = async () => {
    setCameraError('');
    if (typeof navigator.mediaDevices?.getUserMedia !== 'function') {
        setCameraError('Camera access is not supported by your browser.');
        return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream; // Save the stream
      setIsCameraOpen(true); // Trigger the re-render to show the video element
      setPreview(null);
      setFileName('');
      onFileSelect(null);
    } catch (err) {
      console.error("Error accessing camera: ", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setCameraError("Camera access was denied. Please check your browser permissions.");
      } else {
          setCameraError("Could not access the camera. Make sure it's not in use by another app.");
      }
    }
  };

  // THIS useEffect IS THE MAIN FIX. It runs AFTER the component re-renders.
  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      // Now that the video element is in the DOM, we can attach the stream and play it.
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(error => {
          console.error("Error attempting to play video:", error);
          setCameraError("Failed to start video stream.");
      });
    }
  }, [isCameraOpen]); // This effect depends on the camera's open state

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
      canvas.toBlob(blob => {
        if (blob) {
          const capturedFile = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          processFile(capturedFile);
        }
      }, 'image/jpeg');
      
      closeCamera();
    }
  };

  return (
    <div className="w-full">
      {!isCameraOpen ? (
        <>
          <label onDragOver={handleDragOver} onDrop={handleDrop} className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
             {preview ? <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-lg" /> : (
                <div className="text-center p-4">
                    <svg className="w-10 h-10 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                </div>
             )}
            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
          </label>
          {fileName && <p className="text-sm text-gray-500 mt-2">File: {fileName}</p>}
          <div className="text-center my-2 text-gray-500 text-sm">or</div>
          <button type="button" onClick={openCamera} className="w-full bg-neutral-dark text-white py-2 px-4 rounded-lg hover:bg-gray-900 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H12a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /><path d="M15 6a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V6z" /></svg>
            Take Photo
          </button>
          {cameraError && <p className="text-sm text-red-600 mt-2 text-center">{cameraError}</p>}
        </>
      ) : (
        <div className="w-full">
          {/* Added autoPlay and muted attributes for better browser compatibility */}
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full rounded-lg bg-black h-48 object-cover"
          ></video>
          <canvas ref={canvasRef} className="hidden"></canvas>
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={handleCapture} className="w-full bg-brand-blue text-white py-2 px-4 rounded-lg">Capture</button>
            <button type="button" onClick={closeCamera} className="w-full bg-brand-red text-white py-2 px-4 rounded-lg">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};