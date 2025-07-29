type KeyLegendProps = {
    categories: string[];
    colorScale: d3.ScaleOrdinal<string, string>;
    hiddenCategories: Set<string>;
    toggleCategory: (category: string) => void;
};

export function KeyLegend({ categories, colorScale, hiddenCategories, toggleCategory }: KeyLegendProps) {
    return (
        <div id="key" className="box">
            <h1>Key</h1>
            {categories.map(category => (
                <label key={category}>
                    <input
                        type="checkbox"
                        checked={!hiddenCategories.has(category)}
                        onChange={() => toggleCategory(category)}
                        title="Include in chart"
                    />
                    <span className="color" style={{ backgroundColor: colorScale(category) }}></span>
                    <span>{category}</span>
                </label>
            ))}
        </div>
    );
}
