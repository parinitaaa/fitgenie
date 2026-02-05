import { Text, Button } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import UserPhotoUpload from '../components/UserPhotoUpload';

const Home = () => {
  const navigate = useNavigate();
  
  const handleProfilePhotoSave = (imageData) => {
    console.log('Profile photo saved:', imageData);
    // Future: Add backend analysis call here
  };
  
  return (
    <PageContainer>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: 'calc(100vh - 160px)',
        textAlign: 'center',
        gap: '32px',
        padding: '0 24px'
      }}>
        <div>
          <Text variant="heading" style={{ marginBottom: '12px' }}>
            Welcome to FitGenie
          </Text>
          <Text variant="body" color="secondary">
            Your personal wardrobe companion
          </Text>
        </div>
        
        {/* Temporary placement - can be moved to Profile or any other page */}
        <UserPhotoUpload
          title="Your Profile Photo"
          description="Upload a photo for personalized recommendations"
          onImageSave={handleProfilePhotoSave}
        />
        
        <Button variant="primary" onClick={() => navigate('/upload')}>
          Add to wardrobe
        </Button>
      </div>
    </PageContainer>
  );
};

export default Home;
