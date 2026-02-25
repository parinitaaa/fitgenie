import Card from './ui/Card';
import Text from './ui/Text';
import './AnalysisDisplay.css';

function AnalysisDisplay({ title, data, type = 'default' }) {
  if (!data) {
    return null;
  }

  // Handle different data structures dynamically
  const renderValue = (value) => {
    if (value === null || value === undefined) {
      return <Text color="secondary">N/A</Text>;
    }

    if (typeof value === 'boolean') {
      return <Text color={value ? 'primary' : 'secondary'}>{value ? 'Yes' : 'No'}</Text>;
    }

    if (typeof value === 'number') {
      return <Text>{value}</Text>;
    }

    if (typeof value === 'string') {
      return <Text>{value}</Text>;
    }

    if (Array.isArray(value)) {
      return (
        <div className="analysis-array">
          {value.map((item, index) => (
            <span key={index} className="array-item">
              {String(item)}
            </span>
          ))}
        </div>
      );
    }

    if (typeof value === 'object') {
      return <NestedObject data={value} />;
    }

    return <Text>{String(value)}</Text>;
  };

  // Format field name for display
  const formatFieldName = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <Card className={`analysis-display analysis-${type}`}>
      <Text variant="heading" as="h3" className="analysis-title">
        {title}
      </Text>

      <div className="analysis-content">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="analysis-field">
            <Text className="field-label" color="secondary">
              {formatFieldName(key)}:
            </Text>
            <div className="field-value">
              {renderValue(value)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Helper component for nested objects
function NestedObject({ data }) {
  const formatFieldName = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <div className="nested-object">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="nested-field">
          <Text className="nested-label" color="secondary">
            {formatFieldName(key)}:
          </Text>
          <Text className="nested-value">
            {typeof value === 'object' && value !== null
              ? JSON.stringify(value)
              : String(value)}
          </Text>
        </div>
      ))}
    </div>
  );
}

export default AnalysisDisplay;
