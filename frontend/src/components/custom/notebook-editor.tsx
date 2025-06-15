import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Plus, Trash2, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { isEmpty } from "radash";
import { cn } from "@/lib/utils";

interface Cell {
  id: string;
  input: string;
  output: string | null;
  isLoading: boolean;
}

const NotebookCell: React.FC<{
  cell: Cell;
  onCellUpdate: (id: string, input: string) => void;
  onCellRun: (id: string) => void;
  onCellDelete: (id: string) => void;
  onCellAdd: (id: string) => void;
}> = ({ cell, onCellUpdate, onCellRun, onCellDelete, onCellAdd }) => {
  return (
    <Card className="group">
      <CardContent className="p-2">
        <div className="flex flex-col space-y-2">
          <div className="relative w-full">
            <Textarea
              value={cell.input}
              onChange={(e) => onCellUpdate(cell.id, e.target.value)}
              placeholder="Enter your query or code here..."
              className="w-full border-none focus:ring-0 resize-none font-mono p-4 pr-40 break-all"
              rows={3}
            />
            <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background p-1 rounded-lg border">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onCellRun(cell.id)}
                disabled={cell.isLoading}
              >
                <Play className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onCellAdd(cell.id)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onCellDelete(cell.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {cell.isLoading && (
            <div className="flex items-center space-x-2 p-4 bg-muted rounded-md">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyst AI is thinking...</span>
            </div>
          )}
          {cell.output && !cell.isLoading && (
            <div className="p-4 bg-muted rounded-md">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {cell.output}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const createNewCell = (input = ""): Cell => ({
  id: `cell-${Date.now()}-${Math.random()}`,
  input,
  output: null,
  isLoading: false,
});

export const NotebookEditor: React.FC = () => {
  const [cells, setCells] = useState<Cell[]>([]);
  const hasCells = !isEmpty(cells);

  // TODO: The logic will be implemented differently (now just for demonstration)
  const handleUpdateCell = (id: string, input: string) => {
    setCells((prevCells) =>
      prevCells.map((cell) => (cell.id === id ? { ...cell, input } : cell))
    );
  };

  const handleRunCell = async (id: string) => {
    const cellToRun = cells.find((c) => c.id === id);
    if (!cellToRun || !cellToRun.input.trim()) return;

    setCells((prevCells) =>
      prevCells.map((cell) =>
        cell.id === id ? { ...cell, isLoading: true, output: null } : cell
      )
    );

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const responseContent = `This is a simulated AI response to your query: "${cellToRun.input}". This response is structured like a notebook cell output.`;

      setCells((prevCells) =>
        prevCells.map((cell) =>
          cell.id === id
            ? { ...cell, isLoading: false, output: responseContent }
            : cell
        )
      );
    } catch (error) {
      console.error("Error running cell:", error);
      setCells((prevCells) =>
        prevCells.map((cell) =>
          cell.id === id
            ? {
                ...cell,
                isLoading: false,
                output: "Sorry, I ran into an error.",
              }
            : cell
        )
      );
    }
  };

  const handleDeleteCell = (id: string) => {
    setCells((prevCells) => prevCells.filter((cell) => cell.id !== id));
  };

  const handleAddCell = (afterId: string) => {
    setCells((prevCells) => {
      const newCell = createNewCell();
      const index = prevCells.findIndex((cell) => cell.id === afterId);
      const newCells = [...prevCells];
      newCells.splice(index + 1, 0, newCell);
      return newCells;
    });
  };

  const handleAddCellAtEnd = () => {
    setCells((prev) => [...prev, createNewCell()]);
  };

  return (
    <div className="h-full w-full">
      <div className="space-y-4">
        {cells.map((cell) => (
          <NotebookCell
            key={cell.id}
            cell={cell}
            onCellUpdate={handleUpdateCell}
            onCellRun={handleRunCell}
            onCellDelete={handleDeleteCell}
            onCellAdd={handleAddCell}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <Button
          onClick={handleAddCellAtEnd}
          variant="outline"
          className={cn("w-full cursor-pointer", hasCells && "w-1/2")}
        >
          <Plus className="h-4 w-4" />
          Add Cell
        </Button>
        <Button
          onClick={handleAddCellAtEnd}
          variant="outline"
          className={cn("w-1/2 cursor-pointer", hasCells ? "flex" : "hidden")}
        >
          <Plus className="h-4 w-4" />
          Add to Pipeline
        </Button>
      </div>
    </div>
  );
};
