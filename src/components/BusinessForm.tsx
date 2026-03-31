import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { submitWebsiteForm } from '../lib/firebase';
import { uploadToCloudinary } from '../lib/cloudinary';
import { cn } from '../lib/utils';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { PhotoUpload } from './PhotoUpload';
import { CategorySuggest } from './CategorySuggest';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  category: z.string().min(2, 'Please select or enter a category'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
  service: z.string().min(3, 'Service description must be at least 3 characters'),
});

type FormData = z.infer<typeof formSchema>;

export const BusinessForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const handlePhotoUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setPhotoUrl(url);
    } catch (error) {
      alert('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!photoUrl) {
      alert('Please upload a business photo');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitWebsiteForm('member-applications', {
        ...data,
        photoUrl
      });
      
      if (result.success) {
        setIsSubmitted(true);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Data submitted successfully ✅</h2>
        <p className="text-text-secondary max-w-xs mx-auto">
          Thank you for listing your business with us. We'll review it shortly.
        </p>
        <Button
          className="mt-8 max-w-[200px]"
          onClick={() => window.location.reload()}
        >
          Submit Another
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto pb-24">
      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold text-text-primary">Business Listing</h1>
        <p className="text-text-secondary mt-2">Fill in the details to list your business</p>
      </div>


      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <Card className="mb-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Owner Name"
                placeholder="Enter your full name"
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
                placeholder="Enter your business name"
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
        </Card>

        <Card className="mb-4">
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
                  placeholder="Describe your service"
                />
                {errors.service?.message && <p className="error-text">{errors.service?.message}</p>}
              </div>
            )}
          />
        </Card>

        <Card className="mb-6">
          <PhotoUpload
            onUpload={handlePhotoUpload}
            isLoading={isUploading}
            imageUrl={photoUrl || undefined}
          />
        </Card>

        {/* Sticky Submit Button Container */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-border z-20">
          <div className="max-w-xl mx-auto">
            <Button
              type="submit"
              isLoading={isSubmitting}
              className={cn(
                "w-full h-14 text-lg shadow-premium",
                !isValid || !photoUrl ? "opacity-50" : ""
              )}
            >
              List Business
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
