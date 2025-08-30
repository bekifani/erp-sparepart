import Dropzone from "@/components/Base/Dropzone";
import Lucide from "@/components/Base/Lucide";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const FileUpload = ({endpoint, type, setUploadedURL}) => {
  const {t, i18n} = useTranslation()
  const getToken = () => {
   return useSelector((state) => state.auth.token)
  }
  const tenant = useSelector((state) => state.auth.tenant)
  
  const dropzoneRef = useRef(null);

  // Handle when upload is completed
  useEffect(() => {
    const dropzone = dropzoneRef.current?.dropzone;
    if (dropzone) {
      dropzone.on("complete", (file) => {
        if (dropzone.getQueuedFiles().length === 0) {
        
        }
      });
      dropzone.on("queuecomplete", () => {
        // setUploadComplete(true);
      });
      dropzone.on("success", (file, response) => {
        if (response && response.url) {
          setUploadedURL(response.url);
        }
      });
    }
    
  }, []);
  const handleUpload = () => {
    console.log(dropzoneRef.current);
    dropzoneRef.current.dropzone.processQueue(); // Manually start the upload
  };
  return (
    <div>
      <Dropzone
        getRef={(el) => {
          dropzoneRef.current = el;
        }}
        options={{
          url: endpoint, // Replace with your endpoint
          autoProcessQueue: false,             // Prevent automatic uploads
          chunking: true,                      // Enable chunked uploads
          chunkSize: 1048576,                  // Set chunk size to 1MB (1MB = 1024 * 1024 bytes)
          parallelChunkUploads: false,          // Upload multiple chunks in parallel
          retryChunks: true,                   // Retry failed chunks
          retryChunksLimit: 3,                 // Limit retry attempts per chunk
          createImageThumbnails:true,
          acceptedFiles:"image/*,application/pdf",
          addRemoveLinks: true,
          headers: {
            Authorization: `Bearer ${getToken()}`, 
            "X-Tenant": `${tenant}`, 
          },
          params: {
            type: type,
          },
          init: function () {
            this.on("sending", (file, xhr, formData) => {
              formData.append("chunkIndex", file.chunkIndex??0);
              formData.append("totalChunks", file.totalChunks??1);
              formData.append("fileName", file.name); // The file name
            });
          },
        }}
        className="dropzone "
      > 
        <div className="text-lg font-medium">
        <Lucide icon="UploadCloud" className="block mx-auto h-20 w-auto" />
          {t('Drop files here or click here to upload')}
        </div>
        <div className="text-gray-600">
            {/* <Lucide icon="UploadCloud" className="block mx-auto" /> */}
        </div>  
      </Dropzone>

      {/* Manual upload button */}
      <button
        className="mt-4 px-4 py-2 btn w-full text-white bg-primary  rounded-full"
        type="button"
        onClick={() => handleUpload()} // Start upload manually
      >
        {t('ጫን')}
      </button>
    </div>
  );
};

export default FileUpload;
