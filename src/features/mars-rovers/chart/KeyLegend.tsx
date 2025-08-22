import styles from './KeyLegend.module.css';

type KeyLegendProps = {
  categories: string[];
  colorScale: d3.ScaleOrdinal<string, string>;
  hiddenCategories: Set<string>;
  toggleCategory: (category: string) => void;
};

function KeyLegend({
  categories,
  colorScale,
  hiddenCategories,
  toggleCategory,
}: KeyLegendProps) {
  const handleToggle = (category: string) => () => toggleCategory(category);

  return (
    <div className={styles.box}>
      <h1 className={styles.title}>Key</h1>
      {categories.map((category) => (
        <label key={category}>
          <input
            type="checkbox"
            checked={!hiddenCategories.has(category)}
            onChange={handleToggle(category)}
            title="Include in chart"
          />
          <span
            className={styles.color}
            style={{ backgroundColor: colorScale(category) }}
          ></span>
          <span>{category}</span>
        </label>
      ))}
    </div>
  );
}

export { KeyLegend };
