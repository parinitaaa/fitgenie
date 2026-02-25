import { useState, useRef } from 'react';
import Button from './ui/Button';
import Card from './ui/Card';
import Text from './ui/Text';
import './ImageUpload.css';

function ImageUpload({ onUploadSuccess, onUploadError, type = 'clothing', disabled = false }) {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      onUploadError?.(new Error('Please select an image first'));
      return;
    }

    setIsLoading(true);
    
    try {
      // Call the success callback with the file
      await onUploadSuccess(file);
    } catch (error) {
      onUploadError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const typeLabel = type === 'clothing' ? 'Clothing' : 'Skin Tone';

  return (
    <Card>
      <div className="image-upload">
        <Text variant="heading" as="h3" className="upload-title">
          Upload {typeLabel} Image
        </Text>
        
        <div className="upload-area">
          {preview ? (
            <div className="preview-container">
              <img src={preview} alt="Preview" className="preview-image" />
              <Button 
                variant="ghost" 
                onClick={handleReset}
                disabled={isLoading || disabled}
                className="reset-button"
              >
                ✕ Clear
              </Button>
            </div>
          ) : (
            <div className="upload-placeholder">
              <Text variant="body" color="secondary">
                No image selected
              </Text>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isLoading || disabled}
          className="file-input"
          id={`file-input-${type}`}
        />

        <div className="upload-actions">
          <label htmlFor={`file-input-${type}`}>
            <Button 
              as="span" 
              variant="secondary"
              disabled={isLoading || disabled}
            >
              Choose Image
            </Button>
          </label>

          <Button
            onClick={handleUpload}
            disabled={!preview || isLoading || disabled}
            variant="primary"
          >
            {isLoading ? 'Analyzing...' : `Analyze ${typeLabel}`}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default ImageUpload;
