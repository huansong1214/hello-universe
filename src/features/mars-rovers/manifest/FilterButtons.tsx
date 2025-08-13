import { Button } from '@/components/ui/Button';

import styles from './FilterButtons.module.css';

type FilterStatus = 'all' | 'active' | 'complete';

type FilterButtonsProps = {
  filterStatus: FilterStatus;
  onChange: (status: FilterStatus) => void;
};

const FilterButtons = ({ filterStatus, onChange }: FilterButtonsProps) => {
  function handleAllClick() {
    onChange('all');
  }

  function handleActiveClick() {
    onChange('active');
  }

  function handleCompleteClick() {
    onChange('complete');
  }

  return (
    <div className={styles.filterButtons}>
      <Button active={filterStatus === 'all'} onClick={handleAllClick}>
        All
      </Button>
      <Button active={filterStatus === 'active'} onClick={handleActiveClick}>
        Active
      </Button>
      <Button active={filterStatus === 'complete'} onClick={handleCompleteClick}>
        Complete
      </Button>
    </div>
  );
};

export default FilterButtons;
