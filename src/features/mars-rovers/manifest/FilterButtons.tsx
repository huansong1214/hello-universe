import { Button } from '@/components/ui/Button';

import styles from './FilterButtons.module.css';

type FilterButtonsProps = {
  filterStatus: 'all' | 'active' | 'complete';
  onChange: (status: 'all' | 'active' | 'complete') => void;
};

const FilterButtons = ({ filterStatus, onChange }: FilterButtonsProps) => (
  <div className={styles.filterButtons}>
    <Button active={filterStatus === 'all'} onClick={() => onChange('all')}>
      All
    </Button>
    <Button
      active={filterStatus === 'active'}
      onClick={() => onChange('active')}
    >
      Active
    </Button>
    <Button
      active={filterStatus === 'complete'}
      onClick={() => onChange('complete')}
    >
      Complete
    </Button>
  </div>
);

export default FilterButtons;
