import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import { EmployeeSchema } from '../../types/employee';

import { Input, Select, Textarea, CheckboxRadioGroup, FileUpload, MultiSelectDropdown, SearchableSelect } from '../ui/FormElements';
import { api } from '../../utils/api';
import { API } from '../../utils/apiPaths';
import { MESSAGES } from '../../lang/messages';
import styles from './EmployeeForm.module.css';

const SKILLS_OPTIONS = [
  { value: 'React', label: 'React' },
  { value: 'Node.js', label: 'Node.js' },
  { value: 'MongoDB', label: 'MongoDB' },
  { value: 'Express.js', label: 'Express.js' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'AWS', label: 'AWS' },
];

const PREFERRED_MODE_OPTIONS = [
  { value: 'Work From Office', label: 'Work From Office' },
  { value: 'Work From Home', label: 'Work From Home' },
  { value: 'Hybrid', label: 'Hybrid' },
];

const DEPARTMENT_OPTIONS = [
  { value: 'Development', label: 'Development' },
  { value: 'QA', label: 'QA' },
  { value: 'HR', label: 'HR' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales' },
];

/**
 * Props for the EmployeeForm component.
 * @property initialData - Existing employee data to populate the form for editing.
 * @property onSuccess - Callback fired when the employee is successfully created/updated.
 * @property onCancel - Callback fired when the user cancels the operation.
 */
interface EmployeeFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * EmployeeForm Component
 * Renders a comprehensive form for creating and editing employee records.
 * Handles complex state such as hierarchical location data (Country -> State -> City)
 * and file uploads (Profile Image, Resume).
 */
export const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate the max date for an 18-year-old
  const maxDOB = new Date();
  maxDOB.setFullYear(maxDOB.getFullYear() - 18);
  const maxDateString = maxDOB.toISOString().split('T')[0];

  // Location States
  const [countries, setCountries] = useState<{ value: string, label: string }[]>([]);
  const [states, setStates] = useState<{ value: string, label: string }[]>([]);
  const [cities, setCities] = useState<{ value: string, label: string }[]>([]);

  // Form configuration using react-hook-form and Zod validation
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(EmployeeSchema),
    mode: 'onChange',
    defaultValues: initialData ? {
      ...initialData,
      dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : '',
    } : {
      skills: [],
      preferredMode: [],
    }
  });

  const watchProfileImage = watch('profileImage');
  const watchResume = watch('resume');
  const watchCountry = watch('country');
  const watchState = watch('state');

  // Fetch Countries on Mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const result = await api.get(API.GET_COUNTRIES);
        const dataArr = Array.isArray(result.data?.data) ? result.data.data : (Array.isArray(result.data) ? result.data : []);
        const mapped = dataArr.map((item: any) => ({
          value: item.isoCode || item.code || item.iso2 || item.value || item.id || item.name,
          label: item.name || item.label || item.value
        }));
        setCountries(mapped);
      } catch (e: any) {
        if (e?.message) toast.error(e.message);
      }
    };
    fetchCountries();
  }, []);

  const prevCountryRef = React.useRef(watchCountry);

  // Fetch States when Country changes
  useEffect(() => {
    if (watchCountry && countries.length > 0) {
      const fetchStates = async () => {
        try {
          const countryCode = countries.find(c => c.value === watchCountry || c.label === watchCountry)?.value || watchCountry;
          const result = await api.get(API.GET_STATES(countryCode));
          const dataArr = Array.isArray(result.data?.data) ? result.data.data : (Array.isArray(result.data) ? result.data : []);
          const mapped = dataArr.map((item: any) => ({
            value: item.isoCode || item.code || item.iso2 || item.value || item.id || item.name,
            label: item.name || item.label || item.value
          }));
          setStates(mapped);
        } catch (e: any) {
          if (e?.message) toast.error(e.message);
        }
      };
      fetchStates();
    } else if (!watchCountry) {
      setStates([]);
    }

    if (prevCountryRef.current && prevCountryRef.current !== watchCountry) {
      setValue('state', '', { shouldValidate: true });
      setValue('city', '', { shouldValidate: true });
      setCities([]);
    }
    prevCountryRef.current = watchCountry;
  }, [watchCountry, countries, setValue]);

  const prevStateRef = React.useRef(watchState);

  // Fetch Cities when State changes
  useEffect(() => {
    if (watchState && watchCountry && states.length > 0 && countries.length > 0) {
      const fetchCities = async () => {
        try {
          const countryCode = countries.find(c => c.value === watchCountry || c.label === watchCountry)?.value || watchCountry;
          const stateCode = states.find(s => s.value === watchState || s.label === watchState)?.value || watchState;
          const result = await api.get(API.GET_CITIES(countryCode, stateCode));
          const dataArr = Array.isArray(result.data?.data) ? result.data.data : (Array.isArray(result.data) ? result.data : []);
          const mapped = dataArr.map((item: any) => ({
            value: item.isoCode || item.code || item.value || item.id || item.name,
            label: item.name || item.label || item.value
          }));
          setCities(mapped);
        } catch (e: any) {
          if (e?.message) toast.error(e.message);
        }
      };
      fetchCities();
    } else if (!watchState) {
      setCities([]);
    }

    if (prevStateRef.current && prevStateRef.current !== watchState) {
      setValue('city', '', { shouldValidate: true });
    }
    prevStateRef.current = watchState;
  }, [watchState, watchCountry, states, countries, setValue]);

  /**
   * Handles form submission for both creating and updating employees.
   * @param data - The validated form data from react-hook-form.
   */
  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);

      const submitData = { ...data };
      if (submitData.country) {
        submitData.country = countries.find(c => c.value === submitData.country)?.label || submitData.country;
      }
      if (submitData.state) {
        submitData.state = states.find(s => s.value === submitData.state)?.label || submitData.state;
      }
      if (submitData.city) {
        submitData.city = cities.find(c => c.value === submitData.city)?.label || submitData.city;
      }

      const formData = new FormData();
      Object.entries(submitData).forEach(([key, val]) => {
        const value = val as any;
        if (key === 'profileImage' || key === 'resume') {
          if (typeof value === 'string') {
            formData.append(key, value);
          } else if (value && value.length > 0) {
            formData.append(key, value[0]);
          }
        } else if (Array.isArray(value)) {
          value.forEach(v => formData.append(`${key}[]`, v));
        } else {
          formData.append(key, value as string);
        }
      });

      let response;
      if (initialData && (initialData._id || initialData.id)) {
        response = await api.put(`${API.GET_EMPLOYEES}/${initialData._id || initialData.id}`, formData, true);
      } else {
        response = await api.post(API.GET_EMPLOYEES, formData, true);
      }

      if (response?.data?.message) {
        toast.success(response.data.message);
      }
      reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      if (error?.message) {
        toast.error(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      {onCancel && (
        <button
          onClick={onCancel}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1rem', fontWeight: 500 }}
        >
          <ArrowLeft size={18} />
          {MESSAGES.FORM.BACK_TO_LIST}
        </button>
      )}
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>{initialData ? MESSAGES.FORM.TITLE_EDIT : MESSAGES.FORM.TITLE_ADD}</h2>
        <p className={styles.formSubtitle}>
          {initialData ? MESSAGES.FORM.SUBTITLE_EDIT : MESSAGES.FORM.SUBTITLE_ADD}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.formGrid}>
        <Input
          label={MESSAGES.FORM.LABELS.FIRST_NAME}
          name="firstName"
          register={register}
          error={errors.firstName}
          required
          placeholder={MESSAGES.FORM.PLACEHOLDERS.FIRST_NAME}
        />

        <Input
          label={MESSAGES.FORM.LABELS.LAST_NAME}
          name="lastName"
          register={register}
          error={errors.lastName}
          required
          placeholder={MESSAGES.FORM.PLACEHOLDERS.LAST_NAME}
        />

        <Input
          label={MESSAGES.FORM.LABELS.EMAIL}
          name="email"
          type="email"
          register={register}
          error={errors.email}
          required
          placeholder={MESSAGES.FORM.PLACEHOLDERS.EMAIL}
        />

        <Input
          label={MESSAGES.FORM.LABELS.MOBILE}
          name="mobile"
          type="tel"
          register={register}
          error={errors.mobile}
          required
          maxLength={10}
          onInput={(e: React.FormEvent<HTMLInputElement>) => {
            e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
          }}
          placeholder={MESSAGES.FORM.PLACEHOLDERS.MOBILE}
        />

        <Input
          label={MESSAGES.FORM.LABELS.DOB}
          name="dateOfBirth"
          type="date"
          register={register}
          error={errors.dateOfBirth}
          required
          max={maxDateString}
        />

        <CheckboxRadioGroup
          label={MESSAGES.FORM.LABELS.GENDER}
          name="gender"
          type="radio"
          options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Other', label: 'Other' },
          ]}
          register={register}
          error={errors.gender}
          required
        />

        <Select
          label={MESSAGES.FORM.LABELS.DEPARTMENT}
          name="department"
          options={DEPARTMENT_OPTIONS}
          register={register}
          error={errors.department}
          required
        />

        <div className={styles.fullWidth}>
          <MultiSelectDropdown
            label={MESSAGES.FORM.LABELS.SKILLS}
            name="skills"
            options={SKILLS_OPTIONS}
            watch={watch}
            setValue={setValue}
            error={errors.skills}
            required
          />
        </div>

        <SearchableSelect
          label={MESSAGES.FORM.LABELS.COUNTRY}
          name="country"
          options={countries}
          watch={watch}
          setValue={setValue}
          error={errors.country}
          required
        />

        <SearchableSelect
          label={MESSAGES.FORM.LABELS.STATE}
          name="state"
          options={states}
          watch={watch}
          setValue={setValue}
          error={errors.state}
          required
          disabled={!watchCountry}
        />

        <SearchableSelect
          label={MESSAGES.FORM.LABELS.CITY}
          name="city"
          options={cities}
          watch={watch}
          setValue={setValue}
          error={errors.city}
          required
          disabled={!watchState}
        />

        <div className={styles.fullWidth}>
          <Textarea
            label={MESSAGES.FORM.LABELS.ADDRESS}
            name="address"
            register={register}
            error={errors.address}
            required
            placeholder={MESSAGES.FORM.PLACEHOLDERS.ADDRESS}
            rows={3}
          />
        </div>

        <FileUpload
          label={MESSAGES.FORM.LABELS.PROFILE_IMAGE}
          name="profileImage"
          register={register}
          error={errors.profileImage}
          required
          accept="image/png, image/jpeg, image/jpg, image/webp"
          watchFile={watchProfileImage}
          onClear={() => setValue('profileImage', null as any, { shouldValidate: true })}
          isImage={true}
        />

        <FileUpload
          label={MESSAGES.FORM.LABELS.RESUME}
          name="resume"
          register={register}
          error={errors.resume}
          required
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          watchFile={watchResume}
          onClear={() => setValue('resume', null as any, { shouldValidate: true })}
        />

        <div className={styles.fullWidth}>
          <CheckboxRadioGroup
            label={MESSAGES.FORM.LABELS.PREFERRED_MODE}
            name="preferredMode"
            type="checkbox"
            options={PREFERRED_MODE_OPTIONS}
            register={register}
            error={errors.preferredMode}
            required
          />
        </div>

        <div className={styles.fullWidth}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                {MESSAGES.FORM.SUBMITTING}
              </>
            ) : (
              <>
                <Save size={20} />
                {MESSAGES.FORM.SUBMIT}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
