import type { TranslationKey } from './translations';
import { Users, GraduationCap, Backpack, School, Handshake, type LucideIcon } from 'lucide-react';

export type RegistrationCategory = 'guardian' | 'teacher' | 'student' | 'school' | 'partner';

export interface FieldConfig {
  name: string;
  type: 'text' | 'email' | 'tel' | 'date';
  labelKey: TranslationKey;
  placeholderKey?: TranslationKey;
  optional?: boolean;
}

export const commonFields: FieldConfig[] = [
  {
    name: 'email',
    type: 'email',
    labelKey: 'register.field.email',
    placeholderKey: 'register.field.email.placeholder',
  },
  {
    name: 'full_name',
    type: 'text',
    labelKey: 'register.field.full_name',
    placeholderKey: 'register.field.full_name.placeholder',
  },
  {
    name: 'phone',
    type: 'tel',
    labelKey: 'register.field.phone',
    placeholderKey: 'register.field.phone.placeholder',
    optional: true,
  },
];

export const categoryFields: Record<RegistrationCategory, FieldConfig[]> = {
  guardian: [
    { name: 'cpf', type: 'text', labelKey: 'register.field.cpf', placeholderKey: 'register.field.cpf.placeholder' },
    {
      name: 'relationship',
      type: 'text',
      labelKey: 'register.field.relationship',
      placeholderKey: 'register.field.relationship.placeholder',
    },
  ],
  teacher: [
    {
      name: 'school_name',
      type: 'text',
      labelKey: 'register.field.school_name',
      placeholderKey: 'register.field.school_name.placeholder',
    },
    { name: 'subject', type: 'text', labelKey: 'register.field.subject', placeholderKey: 'register.field.subject.placeholder' },
  ],
  student: [
    { name: 'birth_date', type: 'date', labelKey: 'register.field.birth_date' },
    {
      name: 'school_name',
      type: 'text',
      labelKey: 'register.field.school_name',
      placeholderKey: 'register.field.school_name.placeholder',
    },
    { name: 'grade', type: 'text', labelKey: 'register.field.grade', placeholderKey: 'register.field.grade.placeholder' },
  ],
  school: [
    {
      name: 'institution_name',
      type: 'text',
      labelKey: 'register.field.institution_name',
      placeholderKey: 'register.field.institution_name.placeholder',
    },
    { name: 'cnpj', type: 'text', labelKey: 'register.field.cnpj', placeholderKey: 'register.field.cnpj.placeholder' },
    {
      name: 'contact_role',
      type: 'text',
      labelKey: 'register.field.contact_role',
      placeholderKey: 'register.field.contact_role.placeholder',
    },
  ],
  partner: [
    {
      name: 'organization_name',
      type: 'text',
      labelKey: 'register.field.organization_name',
      placeholderKey: 'register.field.organization_name.placeholder',
    },
    { name: 'cnpj', type: 'text', labelKey: 'register.field.cnpj', placeholderKey: 'register.field.cnpj.placeholder' },
    {
      name: 'partnership_type',
      type: 'text',
      labelKey: 'register.field.partnership_type',
      placeholderKey: 'register.field.partnership_type.placeholder',
    },
  ],
};

// Sent as category=student with no email of their own, so the guardian's
// dependents reuse the student fields plus the name.
export const dependentFields: FieldConfig[] = [
  {
    name: 'full_name',
    type: 'text',
    labelKey: 'register.field.full_name',
    placeholderKey: 'register.field.full_name.placeholder',
  },
  ...categoryFields.student,
];

export const categories: {
  id: RegistrationCategory;
  icon: LucideIcon;
  labelKey: TranslationKey;
  descKey: TranslationKey;
}[] = [
  { id: 'student', icon: Backpack, labelKey: 'register.category.student', descKey: 'register.category.student.desc' },
  { id: 'guardian', icon: Users, labelKey: 'register.category.guardian', descKey: 'register.category.guardian.desc' },
  { id: 'teacher', icon: GraduationCap, labelKey: 'register.category.teacher', descKey: 'register.category.teacher.desc' },
  { id: 'school', icon: School, labelKey: 'register.category.school', descKey: 'register.category.school.desc' },
  { id: 'partner', icon: Handshake, labelKey: 'register.category.partner', descKey: 'register.category.partner.desc' },
];
