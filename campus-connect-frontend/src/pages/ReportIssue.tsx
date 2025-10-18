import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssuesContext';
import Loader from '../components/ui/Loader';
import type { IssueCategory, CreateIssueData } from '../types';

const ReportIssue: React.FC = () => {
  const navigate = useNavigate();
  // const { state: authState } = useAuth(); // Used for user context
  const { createIssue, state: issuesState } = useIssues();
  
  const [formData, setFormData] = useState<CreateIssueData>({
    title: '',
    description: '',
    category: 'other' as IssueCategory,
    imageFile: undefined,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories: { value: IssueCategory; label: string; description: string }[] = [
    { value: 'maintenance', label: 'Maintenance', description: 'Building repairs, plumbing, electrical issues' },
    { value: 'canteen', label: 'Canteen', description: 'Food quality, service, cleanliness issues' },
    { value: 'classroom', label: 'Classroom', description: 'Equipment, furniture, lighting problems' },
    { value: 'hostel', label: 'Hostel', description: 'Room issues, facilities, security concerns' },
    { value: 'transport', label: 'Transport', description: 'Bus services, parking, traffic issues' },
    { value: 'other', label: 'Other', description: 'Any other campus-related issues' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    if (formData.imageFile) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      
      if (formData.imageFile.size > maxSize) {
        newErrors.imageFile = 'Image size must be less than 5MB';
      }
      
      if (!allowedTypes.includes(formData.imageFile.type)) {
        newErrors.imageFile = 'Only JPEG, PNG, and GIF images are allowed';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear image error
      if (errors.imageFile) {
        setErrors(prev => ({ ...prev, imageFile: '' }));
      }
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageFile: undefined }));
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createIssue(formData);
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'other',
        imageFile: undefined,
      });
      setImagePreview(null);
      
      // Redirect after success message
      setTimeout(() => {
        navigate('/my-issues');
      }, 2000);
      
    } catch (error) {
      console.error('Failed to create issue:', error);
      setErrors({ submit: 'Failed to submit issue. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Issue Reported Successfully!</h2>
            <p className="text-gray-600 mb-4">
              Your issue has been submitted and will be reviewed by the authorities.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to your issues...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Report an Issue</h1>
              <p className="text-gray-600 mt-1">
                Help us improve campus facilities by reporting issues
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Issue Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Brief description of the issue"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                maxLength={100}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.title.length}/100 characters
              </p>
            </div>

            {/* Category Field */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {categories.find(c => c.value === formData.category)?.description}
              </p>
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide detailed information about the issue, including location and any relevant details"
                rows={5}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                maxLength={1000}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/1000 characters
              </p>
            </div>

            {/* Image Upload Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attach Image (Optional)
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-gray-400 transition-colors">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <div className="text-sm text-gray-600">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className="text-primary-600 hover:text-primary-700 font-medium">
                        Click to upload
                      </span>
                      <span> or drag and drop</span>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Issue preview"
                    className="max-w-full h-64 object-cover rounded-md border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              
              {errors.imageFile && (
                <p className="mt-1 text-sm text-red-600">{errors.imageFile}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || issuesState.isLoading}
                className="px-6 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting || issuesState.isLoading ? (
                  <>
                    <Loader size="sm" className="mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit Issue'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;