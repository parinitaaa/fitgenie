import { useState } from 'react'
import AppLayout from './components/AppLayout'
import PageContainer from './components/PageContainer'
import ImageUpload from './components/ImageUpload'
import AnalysisDisplay from './components/AnalysisDisplay'
import Text from './components/ui/Text'
import * as api from './services/api'
import * as wardrobeService from './services/wardrobeService'
import { getErrorMessage } from './services/api'
import './App.css'

function App() {
  const [clothingAnalysis, setClothingAnalysis] = useState(null)
  const [skinAnalysis, setSkinAnalysis] = useState(null)
  const [error, setError] = useState(null)

  const handleClothingUpload = async (file) => {
    try {
      setError(null)
      const result = await api.analyzeClothing(file)
      
      // Store in wardrobe service
      const itemId = `clothing_${Date.now()}`
      wardrobeService.saveClothingAnalysis(itemId, result)
      
      setClothingAnalysis(result)
    } catch (err) {
      const message = getErrorMessage(err)
      setError(`Clothing analysis failed: ${message}`)
      throw err
    }
  }

  const handleSkinUpload = async (file) => {
    try {
      setError(null)
      const result = await api.analyzeSkin(file)
      
      // Store in wardrobe service
      wardrobeService.saveSkinAnalysis(result)
      
      setSkinAnalysis(result)
    } catch (err) {
      const message = getErrorMessage(err)
      setError(`Skin analysis failed: ${message}`)
      throw err
    }
  }

  const handleError = (err) => {
    const message = getErrorMessage(err)
    setError(message)
  }

  return (
    <AppLayout>
      <PageContainer>
        <div className="app-header">
          <Text variant="heading" as="h1">
            FitGenie
          </Text>
          <Text variant="body" color="secondary">
            AI-powered fashion analysis for your wardrobe
          </Text>
        </div>

        {error && (
          <div className="error-banner">
            <Text color="primary">⚠️ {error}</Text>
          </div>
        )}

        <div className="upload-section">
          <ImageUpload
            type="clothing"
            onUploadSuccess={handleClothingUpload}
            onUploadError={handleError}
          />

          <ImageUpload
            type="skin"
            onUploadSuccess={handleSkinUpload}
            onUploadError={handleError}
          />
        </div>

        {(clothingAnalysis || skinAnalysis) && (
          <div className="results-section">
            <Text variant="subheading" as="h2" className="results-heading">
              Analysis Results
            </Text>

            {clothingAnalysis && (
              <AnalysisDisplay
                title="Clothing Analysis"
                data={clothingAnalysis}
                type="clothing"
              />
            )}

            {skinAnalysis && (
              <AnalysisDisplay
                title="Skin Tone Analysis"
                data={skinAnalysis}
                type="skin"
              />
            )}
          </div>
        )}
      </PageContainer>
    </AppLayout>
  )
}

export default App
