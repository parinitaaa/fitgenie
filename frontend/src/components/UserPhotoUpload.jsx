import { useState, useEffect } from 'react';
import { Text, Button, Card } from './ui';
import { theme } from '../styles/theme';

const STORAGE_KEY = 'user_profile_photo';

const UserPhotoUpload = ({ 
  title = "Upload Profile Photo",
  description = "Select your profile picture",
  onImageSave = null,
  showPreview = true 
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Load cached image on mount
  useEffect(() => {
    const cachedImage = localStorage.getItem(STORAGE_KEY);
    if (cachedImage) {
      setPreviewUrl(cachedImage);
    }
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        
        // Store in state
        setSelectedImage(file);
        setPreviewUrl(dataUrl);
        
        // Cache in localStorage
        localStorage.setItem(STORAGE_KEY, dataUrl);
        
        // Call callback if provided
        if (onImageSave) {
          onImageSave({
            file: file,
            dataUrl: dataUrl,
            timestamp: new Date().toISOString()
          });
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    document.getElementById('user-photo-input').click();
  };

  const handleRemove = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px' }}>
      {title && (
        <Text variant="subheading" style={{ marginBottom: '8px' }}>
          {title}
        </Text>
      )}
      {description && (
        <Text variant="body" color="secondary" style={{ marginBottom: '16px' }}>
          {description}
        </Text>
      )}

      <input
        id="user-photo-input"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {showPreview && previewUrl ? (
        <div>
          <Card style={{ 
            padding: '0', 
            overflow: 'hidden', 
            marginBottom: '12px',
            width: '200px',
            height: '200px',
            margin: '0 auto 12px'
          }}>
            <img 
              src={previewUrl} 
              alt="Profile preview" 
              style={{ 
                width: '100%', 
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }} 
            />
          </Card>
          
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <Button variant="secondary" onClick={handleButtonClick}>
              Change photo
            </Button>
            <Button variant="ghost" onClick={handleRemove}>
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <Card style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '12px',
          padding: '32px 20px'
        }}>
          <Text variant="caption" color="secondary">
            No photo selected
          </Text>
          <Button variant="primary" onClick={handleButtonClick}>
            Select photo
          </Button>
        </Card>
      )}
    </div>
  );
};

export default UserPhotoUpload;
