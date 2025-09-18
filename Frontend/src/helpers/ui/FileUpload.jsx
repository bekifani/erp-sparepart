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
  const getCsrfToken = () => {
    return useSelector((state) => state.auth.csrf_token)
   }
  const tenant = useSelector((state) => state.auth.tenant)
  
  const dropzoneRef = useRef(null);

  // Handle when upload is completed
  useEffect(() => {
    const dropzone = dropzoneRef.current?.dropzone;
    if (dropzone) {
      dropzone.on("complete", (file) => {
        if (dropzone.getQueuedFiles().length === 0) {
          console.log('[FileUpload] queue complete for file:', file?.name);
        }
      });
      dropzone.on("queuecomplete", () => {
        console.log('[FileUpload] all uploads completed');
      });
      dropzone.on("success", (file, response) => {
        console.log('[FileUpload] success:', { file, response });
        try {
          const url =
            (response && response.url)
            || (response && response.path)
            || (response && response.file)
            || (response && response.data && (response.data.url || response.data.path || response.data.file));
          if (url) {
            if (typeof setUploadedURL === 'function') {
              setUploadedURL(url);
            } else {
              console.warn('[FileUpload] setUploadedURL prop is not a function');
            }
          } else {
            console.warn('[FileUpload] no URL found in upload response', response);
          }
        } catch (e) {
          console.error('[FileUpload] error parsing upload response', e);
        }
      });
      dropzone.on("error", (file, errorMessage, xhr) => {
        console.error('[FileUpload] error:', { file, errorMessage, xhr });
      });
    }
    
  }, []);
  const handleUpload = () => {
    console.log('[FileUpload] starting upload, dropzoneRef:', dropzoneRef.current);
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
            "X-CSRF-TOKEN": getCsrfToken(),
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
        {t('Upload Files')}
      </button>
    </div>
  );
};

export default FileUpload;
