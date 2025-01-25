"use client"
import React from "react"
import { Gallery } from "next-gallery"
import styled from "styled-components"
import {useDropzone} from 'react-dropzone'
import axios, { AxiosResponse } from 'axios';
import { RESOURCES_SERVER_URL } from "../resources-server-url"
import { IStyledFC } from "../types/IStyledFC"
import { MyOverlay, OverlayProvider } from './ImagePickerOverlay';

interface FileObject extends File {
  preview: string;
  uploaded: boolean;
  tempUploadName: string
}

interface IImageVideoPicker extends IStyledFC {
    multiple: boolean;
    placeholder?: string;
    onChange: (file: string[]) => void
}

const ImagePickerFC: React.FC<IImageVideoPicker> = ({className, multiple, placeholder, onChange}) => {
  const inputRef = React.useRef<null | HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = React.useState<HTMLImageElement[] | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<FileObject[] | null>(null);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const loadedImages: HTMLImageElement[] = [];
      const objectURL: FileObject[] = [];
  
      acceptedFiles.forEach((file, index) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
  
        img.onload = () => {
          const imageURL: FileObject = Object.assign(file, {
            preview: img.src,
            uploaded: false,
            tempUploadName: '',
          });

          loadedImages.push(img);
          objectURL.push(imageURL);

  
          // When all images are loaded, update state
          if (loadedImages.length === acceptedFiles.length) {
            setSelectedFiles([...loadedImages]);
            setSelectedImage([...objectURL])
          }
        };
      });
    },
    multiple, // Allow multiple files
    accept: { 'image/*': [] } // Accept only image files
  });

  React.useEffect(() => {
    if(selectedImage) {
      if(!(selectedImage.map(file => file.uploaded).includes(false))) {
        onChange(selectedImage.map(file => file.tempUploadName))
      }
    }
  }, [selectedImage])
  
  return(
      <div className={className}>
          <DropzoneContainer {...getRootProps({active: isDragActive? "true" : "false"})}>
            {
              placeholder? <h5>Add cover photo</h5> : ''
            }
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm96 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm69.2 46.9c-3-4.3-7.9-6.9-13.2-6.9s-10.2 2.6-13.2 6.9l-41.3 59.7-11.9-19.1c-2.9-4.7-8.1-7.5-13.6-7.5s-10.6 2.8-13.6 7.5l-40 64c-3.1 4.9-3.2 11.1-.4 16.2s8.2 8.2 14 8.2l48 0 32 0 40 0 72 0c6 0 11.4-3.3 14.2-8.6s2.4-11.6-1-16.5l-72-104z"/></svg>
              <p>Click or Drag and Drop files right here!!</p>
            </div>
            <input ref={inputRef} {...getInputProps()} />
          </DropzoneContainer>
          {
            selectedFiles? 
            <div className="preview-container">
              {
                multiple? 
                <OverlayProvider>
                  <Gallery 
                  widths={[500, 1000, 1600]}
                  ratios={[2.2, 4, 6, 8]}
                  lastRowBehavior="fill"
                  threshold={0}
                  images={selectedFiles.map(img => ({
                    src: img.src,
                    aspect_ratio:  img.naturalWidth / img.naturalHeight
                  }))}
                  overlay={(i) => <Overlay file={(selectedImage as FileObject[])[i]} onUploadComplete={(f) => {
                    Object.assign((selectedImage as FileObject[])[i], {
                      tempUploadName: f,
                      uploaded: true,
                    });

                    setSelectedImage([...(selectedImage as FileObject[])])
                  }} />}
                  />
                </OverlayProvider> : 
                <SinglePreview>
                  <img src={selectedFiles[0].src} alt="preview" />
                </SinglePreview>
              }
              
              {
                selectedFiles[0].title
              }
            </div> : ""
          }
      </div>
  )
}

interface IOverlay extends IStyledFC {
  file: FileObject;
  onUploadComplete: (temp:string) => void;
}

const OverlayFC: React.FC<IOverlay> = ({className, file, onUploadComplete}) => {
  const [isUploading, setIsUploading] = React.useState(true);
  const [errorUpload, setErrorUpload] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const formData = new FormData();

    formData.append('picture', file);

    axios.post(`${RESOURCES_SERVER_URL}/uploader/add-to-temp`, formData, {
      onUploadProgress: (progressEvent) => {
        const progress = progressEvent.total && Math.round((progressEvent.loaded / progressEvent.total) * 100);
        progress && setProgress(progress);
      },
    })
    .then(res => {
      if(!res.data.success) throw res.data;

      setIsUploading(false);
      onUploadComplete(res.data.data.filename)
    })
    .catch(err => {
      setErrorUpload(true);
    })
    
  }, [file])
  
  return(
    <div className={className}>
      {
        isUploading? <div className="uploading">
            <div className="progress-container">
              <p>{progress}%</p>
              <Progress progress={progress}>
                <span className="progress-bar"></span>
              </Progress>
            </div>
        </div> : <div className="uploaded">
          <svg
          fill="#01d745"
          height="20px"
          width="20px"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 191.667 191.667"
          xmlSpace="preserve"
          style={{
              opacity: 1,
              transition: 'opacity 0.3s',
          }}
          >
            <path d="M95.833,0C42.991,0,0,42.99,0,95.833s42.991,95.834,95.833,95.834s95.833-42.991,95.833-95.834S148.676,0,95.833,0z M150.862,79.646l-60.207,60.207c-2.56,2.56-5.963,3.969-9.583,3.969c-3.62,0-7.023-1.409-9.583-3.969l-30.685-30.685 c-2.56-2.56-3.97-5.963-3.97-9.583c0-3.621,1.41-7.024,3.97-9.584c2.559-2.56,5.962-3.97,9.583-3.97c3.62,0,7.024,1.41,9.583,3.971 l21.101,21.1l50.623-50.623c2.56-2.56,5.963-3.969,9.583-3.969c3.62,0,7.023,1.409,9.583,3.969 C156.146,65.765,156.146,74.362,150.862,79.646z" />
          </svg>
        </div>
      }
    </div>
  )
}

const Progress = styled.span<{progress: number}>`
  width: 100%;
  height: 7px;
  border: 1px solid white;

  && > .progress-bar {
    display: flex;
    width: ${(p) => p.progress}%;
    background-color: #ffffff94;
    height: 90%;
  }
  
`

const Overlay = styled(OverlayFC)`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  && > .uploading, && > .uploaded {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 1 100%;
    height: 100%;
    background-color: #050e16a3;
  }

  && > .uploading > .progress-container {
    display: flex;
    flex-wrap: wrap;
    width: 90%;

    > p {
      flex: 0 1 100%;
      text-align: center;
      color: white;
      font-size: 11px;
      margin-bottom: 5px;
    }
  }
`


const SinglePreview = styled.div`
  display: flex;
  flex: 0 1 100%;
  justify-content: center;

  && > img {
    min-width: 150px;
    max-width: 300px;
  }
  
`

const DropzoneContainer = styled.div<{active: string}>`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  flex: 0 1 100%;
  /* height: 100px; */
  padding: 20px;
  justify-content: center;
  align-items: center;
  border-style: dashed;
  border-radius: 5px;
  border-width: 2px;
  margin-bottom: 20px;
  border-color: ${({active}) => active === "true"? "#006eff" : "#b6b6b6"};
  transition: border-color 300ms;

  && > h5 {
    flex: 0 1 100%;
    text-align: center;
    color: ${({active}) => active === "true"? "#006eff" : "#b6b6b6"};
  }

  && > div {
    display: flex;
    color: ${({active}) => active === "true"? "#006eff" : "#b6b6b6"};
  }

  && > div > p {
    color: ${({active}) => active === "true"? "#006eff" : "#b6b6b6"};
  }

  && > div> svg {
    width: 20px;
    fill: ${({active}) => active === "true"? "#006eff" : "#b6b6b6"};
  }

  
  p {
    width: 100%;
    text-align: center;
    padding: 10px 15px;
    color: #d3e5ea;
  }

`;

const ImagePicker = styled(ImagePickerFC)<{fullWidth?: boolean}>`
    display: flex;
    flex-wrap: wrap;
    width: ${p => p.fullWidth? "100%" : "200px"};

    && > .preview-container {
      position: relative;
      width: 100%;
    }
`

export default ImagePicker;    