import type { TranslationKey } from './translations';
import { Users, GraduationCap, Backpack, School, Handshake, type LucideIcon } from 'lucide-react';

export type RegistrationCategory = 'guardian' | 'teacher' | 'student' | 'school' | 'partner';

export interface FieldOption {
  /** Código estável guardado no estado do form — o texto enviado à API vem de `labelKey`, traduzido no idioma ativo. */
  value: string;
  labelKey: TranslationKey;
}

export interface FieldConfig {
  name: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'select';
  labelKey: TranslationKey;
  placeholderKey?: TranslationKey;
  optional?: boolean;
  /** Só para type: 'select'. A opção de value 'other' revela um campo de texto livre ao lado. */
  options?: FieldOption[];
}

export const OTHER_OPTION_VALUE = 'other';

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
      type: 'select',
      labelKey: 'register.field.relationship',
      placeholderKey: 'register.field.relationship.select',
      options: [
        { value: 'mother', labelKey: 'register.field.relationship.mother' },
        { value: 'father', labelKey: 'register.field.relationship.father' },
        { value: 'grandmother', labelKey: 'register.field.relationship.grandmother' },
        { value: 'grandfather', labelKey: 'register.field.relationship.grandfather' },
        { value: 'uncleAunt', labelKey: 'register.field.relationship.uncleAunt' },
        { value: 'legalGuardian', labelKey: 'register.field.relationship.legalGuardian' },
        { value: OTHER_OPTION_VALUE, labelKey: 'register.field.relationship.other' },
      ],
    },
  ],
  teacher: [
    {
      name: 'school_name',
      type: 'text',
      labelKey: 'register.field.school_name',
      placeholderKey: 'register.field.school_name.placeholder',
    },
    {
      name: 'subject',
      type: 'select',
      labelKey: 'register.field.subject',
      placeholderKey: 'register.field.subject.select',
      options: [
        { value: 'math', labelKey: 'register.field.subject.math' },
        { value: 'portuguese', labelKey: 'register.field.subject.portuguese' },
        { value: 'physics', labelKey: 'register.field.subject.physics' },
        { value: 'chemistry', labelKey: 'register.field.subject.chemistry' },
        { value: 'biology', labelKey: 'register.field.subject.biology' },
        { value: 'history', labelKey: 'register.field.subject.history' },
        { value: 'geography', labelKey: 'register.field.subject.geography' },
        { value: 'english', labelKey: 'register.field.subject.english' },
        { value: 'arts', labelKey: 'register.field.subject.arts' },
        { value: 'pe', labelKey: 'register.field.subject.pe' },
        { value: 'computing', labelKey: 'register.field.subject.computing' },
        { value: OTHER_OPTION_VALUE, labelKey: 'register.field.subject.other' },
      ],
    },
  ],
  student: [
    // A data de nascimento é perguntada na inscrição do evento, onde ela serve
    // ao termo do responsável e ao crachá. Perguntar duas vezes só produzia uma
    // cópia que envelhecia sem ninguém usar.
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
      type: 'select',
      labelKey: 'register.field.contact_role',
      placeholderKey: 'register.field.contact_role.select',
      options: [
        { value: 'principal', labelKey: 'register.field.contact_role.principal' },
        { value: 'coordinator', labelKey: 'register.field.contact_role.coordinator' },
        { value: 'secretary', labelKey: 'register.field.contact_role.secretary' },
        { value: 'teacher', labelKey: 'register.field.contact_role.teacher' },
        { value: OTHER_OPTION_VALUE, labelKey: 'register.field.contact_role.other' },
      ],
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
      type: 'select',
      labelKey: 'register.field.partnership_type',
      placeholderKey: 'register.field.partnership_type.select',
      options: [
        { value: 'sponsorship', labelKey: 'register.field.partnership_type.sponsorship' },
        { value: 'mentorship', labelKey: 'register.field.partnership_type.mentorship' },
        { value: 'venue', labelKey: 'register.field.partnership_type.venue' },
        { value: 'promotion', labelKey: 'register.field.partnership_type.promotion' },
        { value: 'materials', labelKey: 'register.field.partnership_type.materials' },
        { value: OTHER_OPTION_VALUE, labelKey: 'register.field.partnership_type.other' },
      ],
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
