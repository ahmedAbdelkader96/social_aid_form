// Third form step for narrative fields and AI help generation.
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import type { FC, PropsWithChildren } from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { ApplicationFormValues } from '../models/applicationTypes'
import styles from '../styles/ApplicationForm.module.css'

const fieldVariants = {
  hidden: { opacity: 0, y: 22 },
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

interface Step3Props {
  register: UseFormRegister<ApplicationFormValues>
  errors: FieldErrors<ApplicationFormValues>
  onHelp: (field: 'financialSituation' | 'employmentCircumstances' | 'applicationReason') => void
  loadingField: string | null
}

export const Step3: FC<Step3Props> = ({ register, errors, onHelp, loadingField }) => {
  const { t } = useTranslation()

  return (
    <div className={styles.stepGridColumn}>
      <AnimatedFieldLabel delayIndex={0}>
        {t('currentFinancialSituation')}
        <textarea
          {...register('financialSituation', { required: true })}
          className={styles.fieldTextarea}
          aria-invalid={!!errors.financialSituation}
          rows={4}
        />
        {errors.financialSituation && <span className={styles.errorText}>{t('required')}</span>}
        <button
          type="button"
          className={styles.helpButton}
          onClick={() => onHelp('financialSituation')}
          disabled={loadingField === 'financialSituation'}
        >
          {loadingField === 'financialSituation' ? t('loading') : t('helpMeWrite')}
        </button>
      </AnimatedFieldLabel>
      <AnimatedFieldLabel delayIndex={1}>
        {t('employmentCircumstances')}
        <textarea
          {...register('employmentCircumstances', { required: true })}
          className={styles.fieldTextarea}
          aria-invalid={!!errors.employmentCircumstances}
          rows={4}
        />
        {errors.employmentCircumstances && <span className={styles.errorText}>{t('required')}</span>}
        <button
          type="button"
          className={styles.helpButton}
          onClick={() => onHelp('employmentCircumstances')}
          disabled={loadingField === 'employmentCircumstances'}
        >
          {loadingField === 'employmentCircumstances' ? t('loading') : t('helpMeWrite')}
        </button>
      </AnimatedFieldLabel>
      <AnimatedFieldLabel delayIndex={2}>
        {t('reasonForApplying')}
        <textarea
          {...register('applicationReason', { required: true })}
          className={styles.fieldTextarea}
          aria-invalid={!!errors.applicationReason}
          rows={4}
        />
        {errors.applicationReason && <span className={styles.errorText}>{t('required')}</span>}
        <button
          type="button"
          className={styles.helpButton}
          onClick={() => onHelp('applicationReason')}
          disabled={loadingField === 'applicationReason'}
        >
          {loadingField === 'applicationReason' ? t('loading') : t('helpMeWrite')}
        </button>
      </AnimatedFieldLabel>
    </div>
  )
}

