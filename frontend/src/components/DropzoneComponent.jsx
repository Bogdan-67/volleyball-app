import { useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const baseStyle = {
  display: 'flex',
  position: 'relative',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '50vw',
  height: '50vh',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  transition: 'border .3s ease-in-out',
};

const activeStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

const buttonStyle = {
  marginTop: '20px',
  borderRadius: '10px',
  backgroundColor: '#3389c7',
};

const DropzoneComponent = ({ onPhotoUpload }) => {
  const [uploadedImage, setUploadedImage] = useState(null);

  const onDrop = (acceptedFiles) => {
    // Проверяем формат файла
    const file = acceptedFiles[0];
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      setUploadedImage(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png',
    multiple: false,
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept],
  );

  const removeImage = () => {
    setUploadedImage(null);
  };

  const sendImage = () => {
    // Передаем загруженный файл в родительский компонент
    if (uploadedImage) {
      onPhotoUpload(uploadedImage);
    }
  };

  return (
    <section>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        {uploadedImage ? (
          <div style={{ objectFit: 'cover', width: '100%', height: '100%' }}>
            <img
              style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              src={URL.createObjectURL(uploadedImage)}
              alt='Uploaded'
            />
          </div>
        ) : (
          <p>Drag and drop a JPG or PNG image here, or click to select a file</p>
        )}
      </div>
      {uploadedImage && (
        <button style={buttonStyle} onClick={removeImage}>
          Удалить
        </button>
      )}
      {uploadedImage && (
        <button style={buttonStyle} onClick={sendImage}>
          Сохранить
        </button>
      )}
    </section>
  );
};

export default DropzoneComponent;
