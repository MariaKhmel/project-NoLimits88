import css from './WaterItem.module.scss';
import icons from '../../img/icons/symbol.svg';

const WaterItem = ({ openWaterModal, openDeleteWaterModal}) => {
  return (
    <li className={css.waterItem}>
      <div className={css.iconWaterWrapp}>
        <svg className={css.iconWater} width="38" height="38">
          <use href={`${icons}#icon-glass`}></use>
        </svg>
      </div>

      <div className={css.waterInfo}>
        <p className={css.waterAmount}>250 ml</p>
        <p className={css.waterTime}>7:00 AM</p>
      </div>

      <div className={css.buttonsBox}>
        <button
          className={css.editBtn}
          onClick={openWaterModal}
          aria-label="Edit the entered amount of water"
        >
          <svg className={css.iconAction} width="14" height="14">
            <use href={`${icons}#icon-edit`}></use>
          </svg>
        </button>
        <button
          className={css.deleteBtn}
          onClick={openDeleteWaterModal}
          aria-label="Delete the entered amount of water"
        >
          <svg className={css.iconAction} width="14" height="14">
            <use href={`${icons}#icon-trash`}></use>
          </svg>
        </button>
      </div>
    </li>
  );
};

export default WaterItem;
