import { useEffect, useState } from "react";

// The home grid: 6 columns by 8 rows filling the viewport under the 56 px header, with
// 8 px of padding around it and 8 px gaps (see pages/home.tsx).
const HEADER = 56;
const PADDING = 8;
const GAP = 8;
const COLUMNS = 6;
const ROWS = 8;
const GRID_FROM = 1024;

/** Size of a cell spanning `cols` x `rows` on the home grid for a viewport. */
export function homeCellSize(viewportWidth: number, viewportHeight: number, cols: number, rows: number) {
  // Below the lg breakpoint the home stacks its cards and lets them size themselves;
  // the sandbox keeps the smallest desktop cell there.
  const width = Math.max(viewportWidth, GRID_FROM);
  const height = Math.max(viewportHeight, 720);
  const column = (width - 2 * PADDING - (COLUMNS - 1) * GAP) / COLUMNS;
  const row = (height - HEADER - 2 * PADDING - (ROWS - 1) * GAP) / ROWS;
  return {
    width: Math.round(column * cols + GAP * (cols - 1)),
    height: Math.round(row * rows + GAP * (rows - 1)),
  };
}

/** The size a card will have on the home in this window, kept current on resize. */
export function useHomeCell(cols: number, rows: number) {
  const read = () => homeCellSize(window.innerWidth, window.innerHeight, cols, rows);
  const [size, setSize] = useState(read);
  useEffect(() => {
    const onResize = () => setSize(homeCellSize(window.innerWidth, window.innerHeight, cols, rows));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [cols, rows]);
  return size;
}
