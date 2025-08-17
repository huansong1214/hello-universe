import * as d3 from 'd3';
import { useEffect, useState, useRef, useMemo } from 'react';

import styles from './CameraChart.module.css';
import { InfoBox } from './InfoBox';
import { KeyLegend } from './KeyLegend';

const CATEGORIES: string[] = [
  'Engineering',
  'Science',
  'Entry/Descent/Landing',
];

type Item = {
  name: string;
  sol_count: number;
  category: string;
};

const width = 600;
const height = 400;
const margin = { top: 20, right: 10, bottom: 20, left: 50 };

export default function CameraChart({ rover }: { rover: string }) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(
    new Set(),
  );
  const [selectedCamera, setSelectedCamera] = useState<Item | null>(null);

  // use a static list of categories
  const categories = CATEGORIES;

  // memoize color scale based on categories
  const colorScale = useMemo(
    () =>
      d3
        .scaleOrdinal<string, string>()
        .domain(categories)
        .range(d3.schemeCategory10),
    [categories],
  );

  // memoize filtered items based on items and hiddenCategories
  const filtered = useMemo(
    () => items.filter((d) => !hiddenCategories.has(d.category)),
    [items, hiddenCategories],
  );

  // memoize xScale based on filtered
  const xScale = useMemo(
    () =>
      d3
        .scaleBand()
        .domain(filtered.map((d) => d.name))
        .range([margin.left, width - margin.right])
        .padding(0.3),
    [filtered],
  );

  // memoize yScale based on filtered
  const yScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, d3.max(filtered, (d) => d.sol_count) ?? 0])
        .range([height - margin.bottom, margin.top])
        .nice(),
    [filtered],
  );

  useEffect(() => {
    if (!rover) {
      console.error('No rover provided.');
      return;
    }

    fetch(`/api/mars-rovers/${rover}/chart`)
      .then((response) => response.json())
      .then((data: Item[]) => {
        setItems(data);
        setSelectedCamera(null); // reset selection on data load
        setHiddenCategories(new Set()); // reset filters
      })
      .catch(console.error);
  }, [rover]);

  useEffect(() => {
    if (!svgRef.current || filtered.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const bottomAxis = d3.axisBottom(xScale).tickValues([]);
    const leftAxis = d3.axisLeft(yScale).tickFormat(d3.format('~s'));

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(bottomAxis);

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(leftAxis)
      .selectAll('text')
      .attr('class', 'y-axis-number');

    svg
      .append('text')
      .text('Sol Count')
      .attr('class', 'y-axis-label')
      .attr('text-anchor', 'middle')
      .attr(
        'transform',
        `translate(12,${margin.top + (height - margin.top - margin.bottom) / 2}) rotate(270)`,
      );

    svg
      .selectAll<SVGRectElement, Item>('rect')
      .data(filtered, (d) => d.name)
      .join('rect')
      .attr('x', (d) => xScale(d.name) ?? 0)
      .attr('y', (d) => yScale(d.sol_count))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => yScale(0) - yScale(d.sol_count))
      .attr('fill', (d) => colorScale(d.category) as string)
      .attr('class', 'rect')
      .on('mouseover', (event, d) => {
        setSelectedCamera(d);
      })
      .on('mouseout', () => setSelectedCamera(null));
  }, [filtered, xScale, yScale, colorScale]);

  function toggleCategory(category: string) {
    const newHidden = new Set(hiddenCategories);
    if (hiddenCategories.has(category)) {
      newHidden.delete(category);
    } else {
      newHidden.add(category);
      // if selected camera is in this category, deselect it
      if (selectedCamera?.category === category) {
        setSelectedCamera(null);
      }
    }
    setHiddenCategories(newHidden);
  }

  return (
    <div className={styles.cameraChartContainer}>
      <svg ref={svgRef} width={width} height={height} />

      <div className={styles.sideBar}>
        <InfoBox selectedCamera={selectedCamera} />
        <KeyLegend
          categories={categories}
          colorScale={colorScale}
          hiddenCategories={hiddenCategories}
          toggleCategory={toggleCategory}
        />
      </div>
    </div>
  );
}
