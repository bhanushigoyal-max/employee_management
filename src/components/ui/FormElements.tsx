import React from 'react';
import type { UseFormRegister, FieldError, Merge, FieldErrorsImpl, UseFormWatch } from 'react-hook-form';
import { UploadCloud, FileText, AlertCircle, ChevronDown, X, Search, Image as ImageIcon } from 'lucide-react';
import { getFileUrl } from '../../utils/fileUtils';
import styles from './ui.module.css';

/**
 * Base properties shared by all form elements.
 */
type BaseProps = {
  label: string;
  name: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | any;
  required?: boolean;
};

type InputProps = BaseProps & React.InputHTMLAttributes<HTMLInputElement> & {
  register: UseFormRegister<any>;
};

/**
 * Standard Text Input Component
 */
export const Input: React.FC<InputProps> = ({ label, name, error, required, register, ...props }) => (
  <div className={styles.formGroup}>
    <label className={`${styles.label} ${required ? styles.labelRequired : ''}`} htmlFor={name}>
      {label}
    </label>
    <input
      id={name}
      className={`${styles.input} ${error ? styles.inputError : ''}`}
      {...register(name)}
      {...props}
    />
    {error && (
      <span className={styles.errorMessage}>
        <AlertCircle size={14} /> {error.message as string}
      </span>
    )}
  </div>
);

type TextareaProps = BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  register: UseFormRegister<any>;
};

/**
 * Multiline Text Area Component
 */
export const Textarea: React.FC<TextareaProps> = ({ label, name, error, required, register, ...props }) => (
  <div className={styles.formGroup}>
    <label className={`${styles.label} ${required ? styles.labelRequired : ''}`} htmlFor={name}>
      {label}
    </label>
    <textarea
      id={name}
      className={`${styles.textarea} ${error ? styles.textareaError : ''}`}
      {...register(name)}
      {...props}
    />
    {error && (
      <span className={styles.errorMessage}>
        <AlertCircle size={14} /> {error.message as string}
      </span>
    )}
  </div>
);

type SelectProps = BaseProps & React.SelectHTMLAttributes<HTMLSelectElement> & {
  register: UseFormRegister<any>;
  options: { value: string; label: string }[];
};

export const Select: React.FC<SelectProps> = ({ label, name, error, required, register, options, ...props }) => (
  <div className={styles.formGroup}>
    <label className={`${styles.label} ${required ? styles.labelRequired : ''}`} htmlFor={name}>
      {label}
    </label>
    <select
      id={name}
      className={`${styles.select} ${error ? styles.selectError : ''}`}
      {...register(name)}
      {...props}
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && (
      <span className={styles.errorMessage}>
        <AlertCircle size={14} /> {error.message as string}
      </span>
    )}
  </div>
);

type CheckboxRadioProps = BaseProps & {
  register: UseFormRegister<any>;
  options: { value: string; label: string }[];
  type: 'radio' | 'checkbox';
};

export const CheckboxRadioGroup: React.FC<CheckboxRadioProps> = ({ label, name, error, required, register, options, type }) => (
  <div className={styles.formGroup}>
    <label className={`${styles.label} ${required ? styles.labelRequired : ''}`}>
      {label}
    </label>
    <div className={type === 'radio' ? styles.radioGroup : styles.checkboxGroup}>
      {options.map((opt) => (
        <label key={opt.value} className={type === 'radio' ? styles.radioLabel : styles.checkboxLabel}>
          <input
            type={type}
            value={opt.value}
            className={type === 'radio' ? styles.radioInput : styles.checkboxInput}
            {...register(name)}
          />
          {opt.label}
        </label>
      ))}
    </div>
    {error && (
      <span className={styles.errorMessage}>
        <AlertCircle size={14} /> {error.message as string}
      </span>
    )}
  </div>
);

type FileUploadProps = BaseProps & {
  register: UseFormRegister<any>;
  accept: string;
  watchFile: FileList | null;
  onClear: () => void;
  isImage?: boolean;
};

/**
 * File Upload Component with drag-and-drop support and preview generation.
 * Handles both newly uploaded files and existing files (represented as string URLs).
 */
export const FileUpload: React.FC<FileUploadProps> = ({ 
  label, name, error, required, register, accept, watchFile, onClear, isImage 
}) => {
  const isExistingString = typeof watchFile === 'string';
  const file = isExistingString ? null : watchFile?.[0];
  const hasFile = isExistingString || !!file;
  
  let previewUrl = '';
  let fileName = '';
  let fileSize = '';
  
  if (isExistingString) {
    fileName = watchFile.split('/').pop()?.split('\\').pop() || 'Existing File';
    fileSize = 'Existing';
    if (isImage) {
      previewUrl = getFileUrl(watchFile);
    }
  } else if (file) {
    fileName = file.name;
    fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
    if (isImage) {
      try {
        previewUrl = URL.createObjectURL(file);
      } catch (e) {
        // Ignore
      }
    }
  }

  return (
    <div className={styles.formGroup}>
      <label className={`${styles.label} ${required ? styles.labelRequired : ''}`}>
        {label}
      </label>
      
      {!hasFile ? (
        <label className={`${styles.fileUploadArea} ${error ? styles.fileUploadAreaError : ''}`}>
          <UploadCloud className={styles.uploadIcon} />
          <div className={styles.uploadText}>
            <span>Click to upload</span> or drag and drop
          </div>
          <input
            type="file"
            accept={accept}
            className={styles.hiddenInput}
            {...register(name)}
          />
        </label>
      ) : (
        <div className={styles.previewContainer}>
          {isImage && previewUrl ? (
            <img src={previewUrl} alt="Preview" className={styles.imagePreview} />
          ) : (
            <div className={styles.imagePreview} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--input-bg)' }}>
              {isImage ? <ImageIcon /> : <FileText />}
            </div>
          )}
          <div className={styles.fileInfo}>
            <span className={styles.fileName}>{fileName}</span>
            <span className={styles.fileSize}>{fileSize}</span>
            <button type="button" onClick={onClear} className={styles.removeFileBtn}>
              <X size={14} /> Remove
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <span className={styles.errorMessage}>
          <AlertCircle size={14} /> {error.message as string}
        </span>
      )}
    </div>
  );
};

type MultiSelectProps = BaseProps & {
  watch: UseFormWatch<any>;
  setValue: any;
  options: { value: string; label: string }[];
};

export const MultiSelectDropdown: React.FC<MultiSelectProps> = ({ label, name, error, required, watch, setValue, options }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedValues: string[] = watch(name) || [];
  
  const handleSelect = (val: string) => {
    if (!selectedValues.includes(val)) {
      setValue(name, [...selectedValues, val], { shouldValidate: true, shouldDirty: true });
    }
    setIsOpen(false);
  };

  const handleRemove = (e: React.MouseEvent, val: string) => {
    e.stopPropagation();
    setValue(name, selectedValues.filter(v => v !== val), { shouldValidate: true, shouldDirty: true });
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(name, [], { shouldValidate: true, shouldDirty: true });
  };

  const unselectedOptions = options.filter(opt => !selectedValues.includes(opt.value));

  return (
    <div className={styles.formGroup}>
      <label className={`${styles.label} ${required ? styles.labelRequired : ''}`}>
        {label}
      </label>
      
      <div className={styles.multiSelectContainer}>
        <div 
          className={`${styles.input} ${styles.multiSelectTrigger} ${error ? styles.inputError : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className={styles.multiSelectChips}>
            {selectedValues.length > 0 ? (
              selectedValues.map(val => {
                const opt = options.find(o => o.value === val);
                return (
                  <span key={val} className={styles.multiSelectChip}>
                    {opt?.label || val}
                    <button type="button" onClick={(e) => handleRemove(e, val)} className={styles.chipRemoveBtn}>
                      <X size={12} />
                    </button>
                  </span>
                );
              })
            ) : (
              <span className={styles.multiSelectPlaceholder}>Select {label}</span>
            )}
          </div>
          
          <div className={styles.multiSelectActions}>
            {selectedValues.length > 0 && (
              <button type="button" onClick={handleClearAll} className={styles.clearAllBtn}>
                <X size={14} />
              </button>
            )}
            <span className={styles.separator}></span>
            <ChevronDown size={16} className={styles.dropdownIcon} />
          </div>
        </div>
        
        {isOpen && (
          <div className={styles.multiSelectDropdown}>
            {unselectedOptions.length > 0 ? (
              unselectedOptions.map((opt) => (
                <div 
                  key={opt.value} 
                  className={styles.multiSelectOption}
                  onClick={() => handleSelect(opt.value)}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className={styles.noOptions}>No more options</div>
            )}
          </div>
        )}
      </div>

      {error && (
        <span className={styles.errorMessage}>
          <AlertCircle size={14} /> {error.message as string}
        </span>
      )}
    </div>
  );
};

type SearchableSelectProps = BaseProps & {
  options: { value: string; label: string }[];
  setValue: any;
  watch: any;
  placeholder?: string;
  disabled?: boolean;
};

/**
 * Single Select Component with an internal search bar to filter options.
 * Useful for long lists like Countries, States, and Cities.
 */
export const SearchableSelect: React.FC<SearchableSelectProps> = ({ label, name, error, required, options, setValue, watch, placeholder, disabled }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedValue = watch(name);
  const selectedOption = options.find(o => o.value === selectedValue || o.label === selectedValue);

  const filteredOptions = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (val: string) => {
    setValue(name, val, { shouldValidate: true, shouldDirty: true });
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className={styles.formGroup} ref={wrapperRef}>
      <label className={`${styles.label} ${required ? styles.labelRequired : ''}`}>
        {label}
      </label>
      
      <div className={styles.multiSelectContainer}>
        <div 
          className={`${styles.input} ${styles.multiSelectTrigger} ${error ? styles.inputError : ''} ${disabled ? styles.inputDisabled : ''}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          style={{ opacity: disabled ? 0.6 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
          <span className={!selectedOption ? styles.multiSelectPlaceholder : ''}>
            {selectedOption ? selectedOption.label : (placeholder || `Select ${label}`)}
          </span>
          <ChevronDown size={16} className={styles.dropdownIcon} />
        </div>
        
        {isOpen && (
          <div className={styles.multiSelectDropdown}>
            <div className={styles.searchInputWrapper}>
              <Search size={14} className={styles.searchIcon} />
              <input 
                type="text" 
                className={styles.searchInput}
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div 
                  key={opt.value} 
                  className={`${styles.multiSelectOption} ${opt.value === selectedValue ? styles.selectedOption : ''}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className={styles.noOptions}>No results found</div>
            )}
          </div>
        )}
      </div>

      {error && (
        <span className={styles.errorMessage}>
          <AlertCircle size={14} /> {error.message as string}
        </span>
      )}
    </div>
  );
};
