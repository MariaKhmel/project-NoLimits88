import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { GoPlus } from 'react-icons/go';
import { HiOutlineMinus } from 'react-icons/hi';

import { addWaterRecord, editWaterRecord } from '../../redux/water/operations';
import {
  selectSelectedDay,
  selectWaterRecordsOfDay,
} from '../../redux/water/selectors';

import css from './WaterForm.module.scss';
import clsx from 'clsx';

const validationSchema = Yup.object().shape({
  waterAmount: Yup.number()
    .min(50, 'modals.addEdit.errorAdd')
    .max(5000, 'modals.addEdit.errorAdd')
    .required('modals.addEdit.errorAdd'),
  time: Yup.string()
    .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'modals.addEdit.errorEdit')
    .required('modals.addEdit.errorEdit'),
});

const WaterForm = ({ initialData = {}, onClose }) => {
  const { t } = useTranslation();

const WaterForm = ({
  initialData = {},
  onClose,
  idWaterItem,
  onAddWater,
  onEditWater,
}) => {
  const dispatch = useDispatch();
  const waterRecords = useSelector(selectWaterRecordsOfDay);
  const selectedDay = useSelector(selectSelectedDay);

  const defaultValues = {
    waterAmount: initialData.waterAmount || 50,
    time:
      initialData.time ||
      new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const waterAmount = useWatch({ control, name: 'waterAmount' });

  const mlToDecimal = ml => parseFloat((ml / 1000).toFixed(3));

  const handleWaterChange = newValue => setValue('waterAmount', newValue);

  const incrementWater = () => {
    const currentAmount = Number(waterAmount);
    const newValue = currentAmount + 50;
    if (newValue <= 5000) {
      handleWaterChange(newValue);
    }
  };

  const decrementWater = () => {
    const currentAmount = Number(waterAmount);
    if (currentAmount >= 50) {
      const newValue = currentAmount - 50;
      handleWaterChange(newValue);
    }
  };

  const handleKeyboardAmountChange = e => {
    const newValue = Number(e.target.value);
    if (e.target.value.length <= 5 && newValue >= 50 && newValue <= 5000) {
      handleWaterChange(newValue);
    }
  };

  const onSubmitHandler = async data => {
    const [hours, minutes] = data.time.split(':');
    const fullDateTime = new Date(
      Date.UTC(
        new Date(selectedDay).getFullYear(),
        new Date(selectedDay).getMonth(),
        new Date(selectedDay).getDate(),
        hours,
        minutes
      )
    ).toISOString();

    if (onEditWater) {
      await dispatch(
        editWaterRecord({
          amount: mlToDecimal(data.waterAmount),
          date: fullDateTime,
          id: idWaterItem,
        })
      ).unwrap();
    } else {
      await dispatch(
        addWaterRecord({
          amount: mlToDecimal(data.waterAmount),
          date: fullDateTime,
        })
      ).unwrap();
    }
    reset();
    onClose();
  };

  const handleTimeChange = e => {
    const value = e.target.value;
    if (/^([0-1]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      setValue('time', value);
    }
  };

  useEffect(() => {
    if (onEditWater && idWaterItem) {
      const waterItem = waterRecords.find(item => item._id === idWaterItem);
      if (waterItem) {
        setValue('waterAmount', waterItem.amount * 1000);
        const date = new Date(waterItem.date);
        const hours = String(date.getUTCHours()).padStart(2, '0'); // Используем UTC
        const minutes = String(date.getUTCMinutes()).padStart(2, '0'); // Используем UTC
        setValue('time', `${hours}:${minutes}`);
      }
    }
  }, [idWaterItem, waterRecords, setValue, onEditWater]);

  return (
    <form className={css.waterForm} onSubmit={handleSubmit(onSubmitHandler)}>
      <p className={css.text}>{t('modals.addEdit.amount')}</p>
      <div className={css.counterContainer}>
        <button
          type="button"
          className={css.decrementButton}
          onClick={decrementWater}
        >
          <HiOutlineMinus className={css.icon} />
        </button>
        <div className={css.inputWrapper}>
          <span className={css.waterAmountInput}>
            {`${waterAmount} ${t('modals.addEdit.ml')}`}
          </span>
        </div>
        <button
          type="button"
          className={css.incrementButton}
          onClick={incrementWater}
        >
          <GoPlus className={css.icon} />
        </button>
      </div>
      {errors.waterAmount && (
        <span className={css.errorMessage}>
          {t(errors.waterAmount.message)}
        </span>
      )}
      <div className={css.inputContainerTime}>
        <label htmlFor="time" className={css.textTime}>
          {t('modals.addEdit.time')}
        </label>
        <input
          name="time"
          className={`${css.input} ${css.timeInput}`}
          type="time"
          id="time"
          placeholder={t('modals.addEdit.timePlaceholder')}
          {...register('time')}
          onChange={handleTimeChange}
        />
        {errors.time && (
          <span className={css.errorMessage}>{t(errors.time.message)}</span>
        )}
      </div>
      <div className={css.inputContainer}>
        <label htmlFor="waterAmountKeyboard" className={css.settingsTitle}>
          {t('modals.addEdit.value')}
        </label>
        <div className={css.inputWrapper}>
          <input
            className={css.input}
            {...register('waterAmount')}
            type="number"
            id="waterAmountKeyboard"
            min="50"
            onChange={handleKeyboardAmountChange}
          />
        </div>
        {errors.waterAmount && (
          <span className={css.errorMessage}>
            {t(errors.waterAmount.message)}
          </span>
        )}
      </div>
      <button className={clsx(css.settingsButton, 'btn-def')} type="submit">
        {t('modals.addEdit.saveBtn')}
      </button>
    </form>
  );
};

export default WaterForm;
