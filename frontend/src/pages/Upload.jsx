import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Text, Button, Card } from '../components/ui';
import PageContainer from '../components/PageContainer';
import wardrobeService from '../services/wardrobeService';

const Upload = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      // Store file in state
      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Prepare FormData (not sent to backend)
      const formData = new FormData();
      formData.append('image', file);
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleSaveToWardrobe = async () => {
    if (!selectedFile) return;
    
    setIsSaving(true);
    try {
      await wardrobeService.saveItem(selectedFile);
      // Navigate to wardrobe after successful save
      navigate('/wardrobe');
    } catch (error) {
      console.error('Failed to save item:', error);
      setIsSaving(false);
    }
  };

  const handleButtonClick = () => {
    document.getElementById('file-input').click();
  };

  return (
    <PageContainer>
      <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
        <Text variant="heading" style={{ marginBottom: '8px' }}>
          Upload
        </Text>
        <Text variant="body" color="secondary" style={{ marginBottom: '24px' }}>
          Add a new clothing item to your wardrobe
        </Text>

        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {!previewUrl ? (
          <Card style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '16px',
            padding: '40px 20px'
          }}>
            <Text variant="body" color="secondary">
              No image selected
            </Text>
            <Button variant="primary" onClick={handleButtonClick}>
              Select image
            </Button>
          </Card>
        ) : (
          <div>
            <Card style={{ padding: '0', overflow: 'hidden', marginBottom: '16px' }}>
              <img 
                src={previewUrl} 
                alt="Preview" 
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  display: 'block'
                }} 
              />
            </Card>
            
            {showSuccess && (
              <Card style={{ marginBottom: '16px', padding: '12px' }}>
                <Text variant="body" color="primary">
                  ✓ Image selected successfully
                </Text>
              </Card>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button 
                variant="primary" 
                onClick={handleSaveToWardrobe} 
                disabled={isSaving}
                style={{ flex: 1 }}
              >
                {isSaving ? 'Saving...' : 'Add to wardrobe'}
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleButtonClick}
                style={{ flex: 1 }}
              >
                Change
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Upload;
