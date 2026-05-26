import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from '@styles/Dashboards/Admin/CreateEvent.styles';
import { ArrowLeftSVG, UploadSVG } from '@components/SVGs';
import Button from '@components/Button';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    date: '',
    venue: '',
    description: '',
    status: 'Upcoming',
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (status) => {
    setFormData(prev => ({
      ...prev,
      status
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        alert('Please upload a PNG or JPG file');
        return;
      }

      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Event data:', formData);
      
      // Show success message (you can integrate with toast notification)
      alert('Event created successfully!');
      
      // Navigate back to dashboard or events list
      navigate('/dashboard/events');
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'Upcoming', color: '#16a34a', label: 'Upcoming' },
    { value: 'Ongoing', color: '#ea580c', label: 'Ongoing' },
    { value: 'Draft', color: '#64748b', label: 'Draft' },
    { value: 'Completed', color: '#3b82f6', label: 'Completed' },
  ];

  return (
    <S.CreateEventContainer>
      {/* Page Header */}
      <S.PageHeader>
        <S.BackButton onClick={() => navigate(-1)}>
          <ArrowLeftSVG size={18} />
        </S.BackButton>
        <S.PageTitle>
          <h1>Create New Event</h1>
          <p className="breadcrumb">Event › Create New Event</p>
        </S.PageTitle>
      </S.PageHeader>

      <form onSubmit={handleSubmit}>
        <S.FormGrid>
          {/* Main Form */}
          <S.MainForm>
            <S.FormSection>
              <S.SectionTitle>
                Event Information
              </S.SectionTitle>

              <S.FormGroup>
                <S.Label>
                  Event Name <span className="required">*</span>
                </S.Label>
                <S.Input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  placeholder="e.g. Angelo Esuma Santiago"
                  required
                />
              </S.FormGroup>

              <S.FormGroup>
                <S.Label>
                  Date <span className="required">*</span>
                </S.Label>
                <S.Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </S.FormGroup>

              <S.FormGroup>
                <S.Label>
                  Venue <span className="required">*</span>
                </S.Label>
                <S.Input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  placeholder="e.g. STI Balagtas"
                  required
                />
              </S.FormGroup>

              <S.FormGroup>
                <S.Label>
                  Description <span className="required">*</span>
                </S.Label>
                <S.TextArea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your event..."
                  required
                />
              </S.FormGroup>
            </S.FormSection>
          </S.MainForm>

          {/* Sidebar */}
          <S.Sidebar>
            {/* Event Image Upload */}
            <S.FormSection>
              <S.SectionTitle>
                Event Image
                <span className="optional">Optional</span>
              </S.SectionTitle>
              
              <S.UploadArea onClick={() => document.getElementById('imageUpload').click()}>
                <div className="upload-icon">
                  <UploadSVG size={32} />
                </div>
                <div className="upload-text">Click to Upload</div>
                <div className="upload-hint">PNG, JPG up to 5MB</div>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </S.UploadArea>

              {formData.image && (
                <div style={{ marginTop: '12px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Selected: {formData.image.name}
                </div>
              )}
            </S.FormSection>

            {/* Status Selection */}
            <S.FormSection>
              <S.SectionTitle>
                Status
              </S.SectionTitle>
              
              <S.StatusGrid>
                {statusOptions.map((status) => (
                  <S.StatusButton
                    key={status.value}
                    type="button"
                    active={formData.status === status.value}
                    onClick={() => handleStatusChange(status.value)}
                  >
                    <span 
                      className="status-dot" 
                      style={{ background: formData.status === status.value ? status.color : 'transparent' }}
                    />
                    {status.label}
                  </S.StatusButton>
                ))}
              </S.StatusGrid>
            </S.FormSection>

            {/* Action Buttons */}
            <S.ActionButtons>
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Event'}
              </Button>
            </S.ActionButtons>
          </S.Sidebar>
        </S.FormGrid>
      </form>
    </S.CreateEventContainer>
  );
};

export default CreateEvent;
