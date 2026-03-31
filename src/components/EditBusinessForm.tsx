import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updateWebsiteFormSubmission } from '../lib/firebase';
import type { MemberApplication } from '../lib/firebase';
import { uploadToCloudinary } from '../lib/cloudinary';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { PhotoUpload } from './PhotoUpload';
import { CategorySuggest } from './CategorySuggest';
import { X, Save } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  category: z.string().min(2, 'Please select or enter a category'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
  service: z.string().min(3, 'Service description must be at least 3 characters'),
});

type FormData = z.infer<typeof formSchema>;

interface EditBusinessFormProps {
  item: MemberApplication;
  onClose: () => void;
  onUpdate: () => void;
}

export const EditBusinessForm: React.FC<EditBusinessFormProps> = ({ item, onClose, onUpdate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(item.photoUrl || null);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item.name,
      businessName: item.businessName,
      category: item.category,
      phone: item.phone,
      service: item.service,
    },
  });

  const handlePhotoUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setPhotoUrl(url);
    } catch {
      alert('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await updateWebsiteFormSubmission('member-applications', item.id, {
        ...data,
        photoUrl: photoUrl || undefined
      });
      
      if (result.success) {
        onUpdate();
        onClose();
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 w-full max-w-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Member Info</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X size={24} className="text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Owner Name"
                placeholder="Enter full name"
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            name="businessName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Business Name"
                placeholder="Enter business name"
                error={errors.businessName?.message}
              />
            )}
          />

          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <CategorySuggest
                value={field.value || ''}
                onChange={field.onChange}
                error={errors.category?.message}
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Phone Number"
                placeholder="10 digit mobile number"
                type="tel"
                maxLength={10}
                error={errors.phone?.message}
              />
            )}
          />

          <Controller
            name="service"
            control={control}
            render={({ field }) => (
              <div className="mb-2">
                <label className="label">Service Description</label>
                <textarea
                  {...field}
                  className="input-field min-h-[100px] resize-none"
                  placeholder="Describe service"
                />
                {errors.service?.message && <p className="error-text">{errors.service?.message}</p>}
              </div>
            )}
          />

          <div className="pt-2">
            <PhotoUpload
              onUpload={handlePhotoUpload}
              isLoading={isUploading}
              imageUrl={photoUrl || undefined}
              label="Profile"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="flex-1"
          >
            <Save size={18} className="mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
