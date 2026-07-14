# Puzzle — Prisoners

> **Source:** [http://intrologic.stanford.edu/puzzles/prisoners.html](http://intrologic.stanford.edu/puzzles/prisoners.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |  | Introduction to Logic | Tools for Thought |  |
| --- | --- | --- | --- | --- |

 =======================================================================

---

| Prisoners |
| --- |

---

 =======================================================================

| One hundred prisoners are lined up, one behind the other, all facing forward.  On each prisoner's head is a hat, either red or black. Each prisoner can see the hats of all the people in front of him, but he cannot see his own hat and he cannot see the hats of the people behind him.  Starting with the prisoner in the back of the line (the one that can see all 99 other prisoners), the prison warden asks the prisoner what color hat he is wearing.  Each prisoner can hear the guesses of all of the prisoners behind him.  If a prisoner correctly guesses his hat color, he is set free.  If he guesses wrong, he is executed. The prisoners are allowed to agree in advance on an algorithm to use, and you can assume that they all agree to follow the agreed-upon algorithm.  The prisoners are NOT allowed to provide each other with any additional clues once the hats are placed on their heads.  (For example, tapping shoulders or modulating their voices are not allowed.)  The only information each prisoner has is the guesses for the prisoners behind them, and the hats on the prisoners in front of them.  Design an algorithm for the prisoners to follow that saves the most prisoners from execution.  How many are you able to save? |
| --- |

  ======================================================================= <p>Each prisoner says red or black to convey the parity of the number of red hats in front of him.  If there are just 2 prisoners, the prisoner in front knows his own hat color immediately.  If there are three, the second prisoner can determine his hat color by comparing the parity spoken by the prisoner behind him and the parity of the number of hats in front of him.  Using the algorithm, 99 prisoners can be saved with certainty, and there is a chance that the 100th prisoner will be saved as well.</p> =======================================================================
