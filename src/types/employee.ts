import { z } from "zod";

export const EmployeeSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .regex(/^[^0-9]*$/, "Numbers are not allowed in first name"),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .regex(/^[^0-9]*$/, "Numbers are not allowed in last name"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),

  mobile: z
    .string()
    .trim()
    .min(1, "Mobile number is required")
    .regex(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),

  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const age =
        (new Date().getTime() - new Date(date).getTime()) /
        (1000 * 60 * 60 * 24 * 365.25);
      return age >= 18;
    }, "Employee must be at least 18 years old"),

  gender: z.enum(["Male", "Female", "Other"], {
    message: "Gender is required",
  }),

  department: z.enum(
    ["Development", "QA", "HR", "Marketing", "Sales"],
    {
      message: "Department is required",
    }
  ),

  skills: z
    .array(z.string())
    .min(1, "Please select at least one skill"),

  country: z.string().min(1, "Country is required"),

  state: z.string().min(1, "State is required"),

  city: z.string().min(1, "City is required"),

  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .min(10, "Address must be at least 10 characters"),

  profileImage: z
    .any()
    .refine((val) => (typeof val === 'string' && val.trim().length > 0) || (val && val.length > 0), "Profile image is required.")
    .refine(
      (val) => typeof val === 'string' || !val?.length || val?.[0]?.size <= 5000000,
      "Max file size is 5MB."
    )
    .refine(
      (val) =>
        typeof val === 'string' || !val?.length ||
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          val?.[0]?.type
        ),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),

  resume: z
    .any()
    .refine((val) => (typeof val === 'string' && val.trim().length > 0) || (val && val.length > 0), "Resume is required.")
    .refine(
      (val) => typeof val === 'string' || !val?.length || val?.[0]?.size <= 10000000,
      "Max file size is 10MB."
    )
    .refine(
      (val) =>
        typeof val === 'string' || !val?.length ||
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(val?.[0]?.type),
      "Only .pdf, .doc and .docx formats are supported."
    ),

  preferredMode: z
    .array(z.string())
    .min(1, "Please select at least one preferred working mode"),
});

export type EmployeeFormData = z.infer<typeof EmployeeSchema>;