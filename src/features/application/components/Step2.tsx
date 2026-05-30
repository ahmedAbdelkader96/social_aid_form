// Second form step for family, employment, and financial details.
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import type { FC, PropsWithChildren } from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { ApplicationFormValues } from '../models/applicationTypes'
import styles from '../styles/ApplicationForm.module.css'

const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
      delay: custom * 0.06,
    },
  }),
}

const AnimatedFieldLabel: FC<PropsWithChildren<{ delayIndex: number }>> = ({ delayIndex, children }) => (
  <motion.label
    className={styles.fieldLabel}
    variants={fieldVariants}
    custom={delayIndex}
    initial="hidden"
    animate="visible"
  >
    {children}
  </motion.label>
)

interface Step2Props {
  register: UseFormRegister<ApplicationFormValues>
  errors: FieldErrors<ApplicationFormValues>
}

export const Step2: FC<Step2Props> = ({ register, errors }) => {
  const { t } = useTranslation()

  return (
    <div className={styles.stepGrid}>
      <AnimatedFieldLabel delayIndex={0}>
        {t('maritalStatus')}
        <select {...register('maritalStatus', { required: true })} className={styles.fieldInput} aria-invalid={!!errors.maritalStatus}>
          <option value="">{t('selectStatus')}</option>
          <option value="single">{t('single')}</option>
          <option value="married">{t('married')}</option>
          <option value="divorced">{t('divorced')}</option>
          <option value="widowed">{t('widowed')}</option>
        </select>
        {errors.maritalStatus && <span className={styles.errorText}>{t('required')}</span>}
      </AnimatedFieldLabel>
      <AnimatedFieldLabel delayIndex={1}>
        {t('dependents')}
        <input type="number" min="0" {...register('dependents', { required: true, valueAsNumber: true })} className={styles.fieldInput} aria-invalid={!!errors.dependents} />
        {errors.dependents && <span className={styles.errorText}>{t('required')}</span>}
      </AnimatedFieldLabel>
      <AnimatedFieldLabel delayIndex={2}>
        {t('employmentStatus')}
        <select {...register('employmentStatus', { required: true })} className={styles.fieldInput} aria-invalid={!!errors.employmentStatus}>
          <option value="">{t('selectStatus')}</option>
          <option value="employed">{t('employed')}</option>
          <option value="unemployed">{t('unemployed')}</option>
          <option value="self-employed">{t('selfEmployed')}</option>
          <option value="student">{t('student')}</option>
        </select>
        {errors.employmentStatus && <span className={styles.errorText}>{t('required')}</span>}
      </AnimatedFieldLabel>
      <AnimatedFieldLabel delayIndex={3}>
        {t('monthlyIncome')}
        <input type="number" min="0" step="0.01" {...register('monthlyIncome', { required: true, valueAsNumber: true })} className={styles.fieldInput} aria-invalid={!!errors.monthlyIncome} />
        {errors.monthlyIncome && <span className={styles.errorText}>{t('required')}</span>}
      </AnimatedFieldLabel>
      <AnimatedFieldLabel delayIndex={4}>
        {t('housingStatus')}
        <select {...register('housingStatus', { required: true })} className={styles.fieldInput} aria-invalid={!!errors.housingStatus}>
          <option value="">{t('selectStatus')}</option>
          <option value="renting">{t('renting')}</option>
          <option value="owning">{t('owning')}</option>
          <option value="living-with-family">{t('livingWithFamily')}</option>
          <option value="temporary">{t('temporaryShelter')}</option>
        </select>
        {errors.housingStatus && <span className={styles.errorText}>{t('required')}</span>}
      </AnimatedFieldLabel>
    </div>
  )
}

