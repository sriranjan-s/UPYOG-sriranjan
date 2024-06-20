import React, { useState, useRef, useEffect } from "react";
import { FormStep, ImageUploadHandler, ButtonSelector } from "@upyog/digit-ui-react-components";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "react-query";
import { createComplaintFull } from "../../../../redux/actions";

const SelectImages = ({ t, config, onSelect, onSkip, value }) => {
  const appState = useSelector((state) => state["pgr"]);
  const client = useQueryClient();
  const dispatch = useDispatch();
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const chunks = [];
  const [uploadedImages, setUploadedImagesIds] = useState(() => {
    const { uploadedImages } = value;
    return uploadedImages ? uploadedImages : null;
  });

  const handleStartRecording = async (e) => {
    e.preventDefault();
    const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognition) {
      console.log('Speech recognition not supported');
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/mp3' });
      setAudioBlob(audioBlob);
      audioChunks.current = [];
      const audioUrl = URL.createObjectURL(audioBlob);
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.mp3');
      audioRef.current.src = audioUrl;
    };

    setIsRecording(true);
    mediaRecorder.start();

    const recognitionInstance = new recognition();
    recognitionInstance.lang = 'en-US';
    recognitionInstance.start();

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
    };
  };

  const handleStopRecording = (e) => {
    e.preventDefault()
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      const blob = new Blob(audioChunks.current, { type: 'audio/mp3' });
      setAudioBlob(blob);
    }
  };

  const handleUpload = (ids) => {
    setUploadedImagesIds(ids);
  };

  const handleUploadAudio = async (e) => {
    e.preventDefault();
    if (audioBlob) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64data = reader.result.split(',')[1]; // Get base64 data without data URL prefix
          console.log('Base64 audio:', base64data);

          // Example endpoint URL to upload the audio
          const endpoint = 'https://example.com/upload'; // Replace with your server endpoint
          const response = await Digit.UploadServices.FilestorageNew("property-upload", base64data, "pg");
          // const response = await fetch(endpoint, {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json', // Adjust headers as needed
          //   },
          //   body: JSON.stringify({ audioBase64: base64data }), // Send base64 data as JSON
          // });

          if (response.ok) {
            const data = await response.json();
            console.log('Upload successful:', data);
            // Handle uploaded file ID or other response data
          } else {
            console.error('Upload failed:', response.statusText);
            // Handle error appropriately
          }
        };
      } catch (error) {
        console.error('Error uploading audio:', error);
        // Handle error appropriately
      }
    } else {
      console.error('No audioBlob available to upload');
      // Handle case where audioBlob is not available
    }
  };

  useEffect(() => {
    console.log("updated appState", appState);
    Digit.SessionStorage.set("appState", appState);
  }, [appState]);

  const handleSubmit = () => {
    if (!uploadedImages || uploadedImages.length === 0) return onSkip();

    onSelect({ uploadedImages });
  };

  return (
    <div>
      <FormStep config={config} onSelect={handleSubmit} onSkip={onSkip} t={t}>
        <ImageUploadHandler tenantId={value.city_complaint?.code} uploadedImages={uploadedImages} onPhotoChange={handleUpload} />
        
        <div>
          <ButtonSelector label="Start Recording" onSubmit={(e) => handleStartRecording(e)} disabled={isRecording} style={{ margin: "10px", marginLeft: "0px" }}></ButtonSelector>
          <ButtonSelector label="Stop Recording" onSubmit={(e) => handleStopRecording(e)} disabled={!isRecording} style={{ margin: "10px" }}></ButtonSelector>
          {isRecording && <p>Recording...</p>}
          {audioBlob && <audio ref={audioRef} controls />}
          {transcript && <p>Transcript: {transcript}</p>}
          {audioBlob && <ButtonSelector label="Upload Recording" onSubmit={(e) => handleUploadAudio(e)} style={{ margin: "10px" }}></ButtonSelector>}
        </div>
      </FormStep>
    </div>
  );
};

export default SelectImages;





// import React, { useState, useRef, useEffect } from "react";
// import { FormStep, ImageUploadHandler, ButtonSelector } from "@upyog/digit-ui-react-components";
// import { useDispatch, useSelector } from "react-redux";
// import { useQueryClient } from "react-query";
// import { createComplaintFull } from "../../../../redux/actions";

// const SelectImages = ({ t, config, onSelect, onSkip, value }) => {
//   const appState = useSelector((state) => state["pgr"]);
//   const client = useQueryClient();
//   const dispatch = useDispatch();
//   const [transcript, setTranscript] = useState('');
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState(null);
//   const audioRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const audioChunks = useRef([]);
//   const chunks = [];
//   const [uploadedImages, setUploadedImagesIds] = useState(() => {
//     const { uploadedImages } = value;
//     return uploadedImages ? uploadedImages : null;
//   });

//   const handleStartRecording = async (e) => {
//     e.preventDefault();
//     const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!recognition) {
//       console.log('Speech recognition not supported');
//       return;
//     }

//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const mediaRecorder = new MediaRecorder(stream);
//     mediaRecorderRef.current = mediaRecorder;

//     mediaRecorder.ondataavailable = (event) => {
//       chunks.push(event.data);
//       if (event.data.size > 0) {
//         audioChunks.current.push(event.data);
//       }
//     };

//     mediaRecorder.onstop = () => {
//       const audioBlob = new Blob(audioChunks.current, { type: 'audio/mp3' });
//       setAudioBlob(audioBlob);
//       audioChunks.current = [];
//       const audioUrl = URL.createObjectURL(audioBlob);
//       const formData = new FormData();
//       formData.append('audio', audioBlob, 'recording.mp3');
//       audioRef.current.src = audioUrl;
//     };

//     setIsRecording(true);
//     mediaRecorder.start();

//     const recognitionInstance = new recognition();
//     recognitionInstance.lang = 'en-US';
//     recognitionInstance.start();

//     recognitionInstance.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       setTranscript(transcript);
//     };
//   };

//   const handleStopRecording = (e) => {
//     e.preventDefault()
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//       const blob = new Blob(audioChunks.current, { type: 'audio/mp3' });
//       setAudioBlob(blob);
//     }
//   };

//   const handleUpload = (ids) => {
//     setUploadedImagesIds(ids);
//   };

//   const handleUploadAudio = async (e) => {
//     e.preventDefault();
//     if (audioBlob) {
//       try {
//         const reader = new FileReader();
//         reader.readAsDataURL(audioBlob);
//         reader.onloadend = async () => {
//           const base64data = reader.result.split(',')[1]; // Get base64 data without data URL prefix
//           console.log('Base64 audio:', base64data);

//           // Example endpoint URL to upload the audio
//           const endpoint = 'https://example.com/upload'; // Replace with your server endpoint
//           const response = await Digit.UploadServices.FilestorageNew("property-upload", base64data, "pg");
//           // const response = await fetch(endpoint, {
//           //   method: 'POST',
//           //   headers: {
//           //     'Content-Type': 'application/json', // Adjust headers as needed
//           //   },
//           //   body: JSON.stringify({ audioBase64: base64data }), // Send base64 data as JSON
//           // });

//           if (response.ok) {
//             const data = await response.json();
//             console.log('Upload successful:', data);
//             // Handle uploaded file ID or other response data
//           } else {
//             console.error('Upload failed:', response.statusText);
//             // Handle error appropriately
//           }
//         };
//       } catch (error) {
//         console.error('Error uploading audio:', error);
//         // Handle error appropriately
//       }
//     } else {
//       console.error('No audioBlob available to upload');
//       // Handle case where audioBlob is not available
//     }
//   };

//   useEffect(() => {
//     console.log("updated appState", appState);
//     Digit.SessionStorage.set("appState", appState);
//   }, [appState]);

//   const handleSubmit = () => {
//     if (!uploadedImages || uploadedImages.length === 0) return onSkip();

//     onSelect({ uploadedImages });
//   };

//   return (
//     <div>
//       <FormStep config={config} onSelect={handleSubmit} onSkip={onSkip} t={t}>
//         <ImageUploadHandler tenantId={value.city_complaint?.code} uploadedImages={uploadedImages} onPhotoChange={handleUpload} />
        
//         <div>
//           <ButtonSelector label="Start Recording" onSubmit={(e) => handleStartRecording(e)} disabled={isRecording} style={{ margin: "10px", marginLeft: "0px" }}></ButtonSelector>
//           <ButtonSelector label="Stop Recording" onSubmit={(e) => handleStopRecording(e)} disabled={!isRecording} style={{ margin: "10px" }}></ButtonSelector>
//           {isRecording && <p>Recording...</p>}
//           {audioBlob && <audio ref={audioRef} controls />}
//           {transcript && <p>Transcript: {transcript}</p>}
//           {audioBlob && <ButtonSelector label="Upload Recording" onSubmit={(e) => handleUploadAudio(e)} style={{ margin: "10px" }}></ButtonSelector>}
//         </div>
//       </FormStep>
//     </div>
//   );
// };

// export default SelectImages;
