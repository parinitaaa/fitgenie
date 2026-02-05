import { useState, useEffect } from 'react';
import { Text, Button, Card } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import wardrobeService from '../services/wardrobeService';
import { theme } from '../styles/theme';

const Wardrobe = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadItems = () => {
      const wardrobeItems = wardrobeService.getItems();
      setItems(wardrobeItems);
    };
    
    loadItems();
  }, []);

  if (items.length === 0) {
    return (
      <PageContainer>
        <div style={{ padding: '20px' }}>
          <Text variant="heading" style={{ marginBottom: '24px' }}>
            Wardrobe
          </Text>
          
          <Card style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '16px',
            padding: '60px 20px'
          }}>
            <Text variant="body" color="secondary">
              Your wardrobe is empty
            </Text>
            <Button variant="primary" onClick={() => navigate('/upload')}>
              Add your first item
            </Button>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div style={{ padding: '20px' }}>
        <Text variant="heading" style={{ marginBottom: '24px' }}>
          Wardrobe
        </Text>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '16px'
        }}>
          {items.map((item) => (
            <div 
              key={item.id}
              style={{
                backgroundColor: theme.surfaceColor,
                borderRadius: '12px',
                overflow: 'hidden',
                aspectRatio: '1',
              }}
            >
              <img 
                src={item.image} 
                alt="Wardrobe item"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default Wardrobe;
