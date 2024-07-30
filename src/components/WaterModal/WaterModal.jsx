import WaterForm from '../WaterForm/WaterForm';
import css from './WaterModal.module.scss';

const WaterModal = ({ onAddWater, onEditWater, onClose, idWaterItem }) => {
  const getTitleAndSubtitle = () => {
    if (onAddWater) {
      return {
        title: 'Add water',
        subtitle: 'Choose a value:',
      };
    } else if (onEditWater) {
      return {
        title: 'Edit the entered amount of water',
        subtitle: 'Correct entered data:',
      };
    } else {
      return {
        title: '',
        subtitle: '',
      };
    }
  };

  const { title, subtitle } = getTitleAndSubtitle();

  return (
    <div>
      <h2 className={css.titleModal}>{title}</h2>
      <p className={css.subtitleModal}>{subtitle}</p>
      <WaterForm onClose={onClose} idWaterItem={idWaterItem} />
    </div>
  );
};

export default WaterModal;
