import { KeyboardEvent, forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { ToastContainer, Zoom, toast } from "react-toastify";
import { v4 as uuidv4 } from 'uuid';

import "react-toastify/dist/ReactToastify.min.css";

type Cell = {
  text: string;
  id: string;
};

type CellProps = {
  checkKeyCapture: (event: KeyboardEvent) => void;
  cellRefs: React.MutableRefObject<HTMLDivElement[]>;
  index: string;
  initialText: string;
};

const CellElement = forwardRef<HTMLDivElement, CellProps>(({
  checkKeyCapture,
  cellRefs,
  index,
  initialText,
}: CellProps, ref) => {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    setText(initialText);
  }, [initialText])

  return (
    <div
      className="text-3xl h-16 focus:outline-none w-full overflow-auto"
      contentEditable={true}
      onKeyDownCapture={checkKeyCapture}
      onInput={(e) => setText(e.currentTarget.textContent as string)}
      ref={ref}
      onFocus={(e) => {
        console.log("ON FOCUS");

        const range = document.createRange();

        const sel = document.getSelection();

        range.setStart(e.currentTarget, 1);

        range.collapse(true);

        sel?.removeAllRanges();
        sel?.addRange(range);
      }}
    >
      {text}
    </div>
  );
})

function App() {
  const [count, setCount] = useState(0);

  const [cells, setCells] = useState<Cell[]>([{ text: "Edit me!", id: uuidv4()  }]);

  const currentSelected = useRef(0);

  const cellRefs = useRef<CellElement[]>([]);

  const checkKeyCapture = (event: KeyboardEvent) => {
    console.log(event.key);

    if (event.key === "ArrowUp") {
      if (currentSelected.current > 0) {
        event.preventDefault();

        currentSelected.current = currentSelected.current - 1;

        cellRefs.current[currentSelected.current].focus();
      }
    } else if (event.key === "ArrowDown") {
      if (currentSelected.current < cellRefs.current.length - 1) {
        currentSelected.current = currentSelected.current + 1;

        cellRefs.current[currentSelected.current].focus();
      }
    } else if (event.key === "Enter") {
      event.preventDefault();

      currentSelected.current = currentSelected.current + 1;

      const newCell: Cell = {
        text: "" + currentSelected.current,
        id: uuidv4(),
      };

      console.log(currentSelected.current);

      const cellCopy = [...cells];

      cellCopy.splice(currentSelected.current, 0, newCell);

      console.log({ cellCopy });

      // reorder refs
      const cellRefCopy = [...(cellRefs.current)];

      cellRefCopy.splice(currentSelected.current, 0, null);

      cellRefs.current = cellRefCopy;

      setCells(cellCopy);
    }
  };

  useEffect(() => {
    toast("Updated");
    console.log({ cellRefs });
    cellRefs.current[currentSelected.current].focus();

    cellRefs.current = cellRefs.current.slice(0, cells.length)
  }, [cells.length]);


  return (
    <>
      <div className="fixed">
        <ToastContainer />
      </div>
      <div className="container h-screen mx-auto">
        {cells.map((cell, index) => {
          return (
            <CellElement
              ref={(el) => (cellRefs.current[index] = el as HTMLDivElement)}
              checkKeyCapture={checkKeyCapture}
              cellRefs={cellRefs}
              index={cell.id}
              initialText={cell.text}
            />
          );
        })}
      </div>
    </>
  );
}

export default App;
