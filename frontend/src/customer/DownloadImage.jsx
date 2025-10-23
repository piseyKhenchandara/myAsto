// DownloadImage.jsx
import React from "react";

const DownloadImage = () => {
  const imageUrl = "https://example.com/path/image.jpg"; // replace with your image URL

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl, { mode: "cors" });
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-image.jpg"; // desired file name
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed — check console.");
    }
  };

  return (
    <div>
      <img src={imageUrl} alt="example" width={300} />
      <br />
      <button onClick={handleDownload}>Download Image</button>
    </div>
  );
};

export default DownloadImage;
