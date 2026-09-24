import { z } from 'zod';

export const categoryEnum = z.enum([
  'IDENTITY',
  'INSURANCE',
  'VEHICLE',
  'CERTIFICATION',
  'WARRANTY',
  'SUBSCRIPTION',
  'OTHER',
]);

const optionalDateSchema = z.preprocess((val) => {
  if (!val || val === '' || val === null) return null;
  if (val instanceof Date) return val;
  const parsed = new Date(val as string);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}, z.date().nullable().optional());

export const documentCreateSchema = z
  .object({
    title: z
      .string({ required_error: 'Document title is required' })
      .trim()
      .min(2, 'Title must be at least 2 characters')
      .max(100, 'Title cannot exceed 100 characters'),

    category: categoryEnum,

    documentNumber: z
      .string()
      .trim()
      .max(100, 'Document number cannot exceed 100 characters')
      .nullable()
      .optional()
      .transform((val) => (val === '' ? null : val)),

    issueDate: optionalDateSchema,

    expiryDate: optionalDateSchema,

    notes: z
      .string()
      .trim()
      .max(500, 'Notes cannot exceed 500 characters')
      .nullable()
      .optional()
      .transform((val) => (val === '' ? null : val)),
  })
  .refine(
    (data) => {
      if (data.issueDate && data.expiryDate) {
        return data.issueDate.getTime() <= data.expiryDate.getTime();
      }
      return true;
    },
    {
      message: 'Issue date cannot be after the expiry date',
      path: ['issueDate'],
    }
  );

export const documentUpdateSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, 'Title must be at least 2 characters')
      .max(100, 'Title cannot exceed 100 characters')
      .optional(),

    category: categoryEnum.optional(),

    documentNumber: z
      .string()
      .trim()
      .max(100, 'Document number cannot exceed 100 characters')
      .nullable()
      .optional()
      .transform((val) => (val === '' ? null : val)),

    issueDate: optionalDateSchema,

    expiryDate: optionalDateSchema,

    notes: z
      .string()
      .trim()
      .max(500, 'Notes cannot exceed 500 characters')
      .nullable()
      .optional()
      .transform((val) => (val === '' ? null : val)),
  })
  .refine(
    (data) => {
      if (data.issueDate && data.expiryDate) {
        return data.issueDate.getTime() <= data.expiryDate.getTime();
      }
      return true;
    },
    {
      message: 'Issue date cannot be after the expiry date',
      path: ['issueDate'],
    }
  );

export const documentFilterSchema = z.object({
  search: z.string().trim().optional(),
  category: z
    .enum([
      'ALL',
      'IDENTITY',
      'INSURANCE',
      'VEHICLE',
      'CERTIFICATION',
      'WARRANTY',
      'SUBSCRIPTION',
      'OTHER',
    ])
    .optional(),
  status: z
    .enum(['ALL', 'ACTIVE', 'EXPIRING_SOON', 'EXPIRED', 'NO_EXPIRY'])
    .optional(),
  sortBy: z.enum(['expiryDate', 'createdAt', 'title']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type DocumentCreateInput = z.infer<typeof documentCreateSchema>;
export type DocumentUpdateInput = z.infer<typeof documentUpdateSchema>;
export type DocumentFilterInput = z.infer<typeof documentFilterSchema>;
