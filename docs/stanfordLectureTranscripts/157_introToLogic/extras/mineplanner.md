# Extra — Mineplanner

> **Source:** [http://intrologic.stanford.edu/extras/mineplanner.html](http://intrologic.stanford.edu/extras/mineplanner.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |  | Introduction to Logic | Tools for Thought |  |
| --- | --- | --- | --- | --- |

 =======================================================================

---

| Mineplanner |
| --- |

---

 =======================================================================

| 1 2 3 4 5 6 7 8 1 2 3 4 5 6 7 8 ~EY:mine(1,Y)
AX:(mine(X,1) => mine(1,X))
AY:(mine(8,Y) => mine(1,Y))
AY:(~mine(1,Y) & ~mine(8,Y) => ~mine(Y,8))
~EX:mine(X,X)
EY:mine(5,Y)
mine(5,3) \| mine(5,4)
~mine(5,3) Mineplanner is a tool for use in designing mine finding games.  There is an 8x8 board, and your plan is to place a mine in one of cells.  There is also text box below the board.  Your job is to write logical expressions in the box in such a way that they uniquely determine the cell containing the mine.  To help you along, you can click Show Free Cells as you proceed to see which cells must be free according to your constraints.  Ideally, each constraint should eliminate some cells from consideration, and all constraints must be needed to determine the cell containing the mine.  The constraints must be written in the language of relational logic.  The vocabulary consists of eight object constants 1, ..., 8 and the single binary relation constant mine .  (The sentence mine (2,3) means that there is a mine in row 2 and column 3 of the board.)  The formulas in the initial text box show one way this can be done.  (Click Show free cells to see that this set of constraints uniquely defines the cell in the fifth row and fourth column.  Your job is to design a different set of constraints that defines this cell or some other cell of your choosing. |  | 1 2 3 4 5 6 7 8 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |  | 1 2 3 4 5 6 7 8 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | 1 2 3 4 5 6 7 8 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 1 2 3 4 5 6 7 8 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 1 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 4 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 5 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 6 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 7 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 8 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

  =======================================================================
