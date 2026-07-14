# Puzzle — Rotors

> **Source:** [http://intrologic.stanford.edu/puzzles/rotors.html](http://intrologic.stanford.edu/puzzles/rotors.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |  | Introduction to Logic | Tools for Thought |  |
| --- | --- | --- | --- | --- |

 =======================================================================

---

| Rotors |
| --- |

---

 =======================================================================

| A natural number n is a rotor if and only if the decimal representation of n + n is the same as a rotation of the decimal representation of n in which the last digit has been moved to the front.   In other words, the decimal representation n 1 n 2 ... n k -1 n k satisfies the following sum. n 1 n 2 ... n k -1 n k + n 1 n 2 ... n k -1 n k n k n 1 n 2 ... n k -1 What is the smallest rotor?  (Hint: It is a big number.) |  | n 1 | n 2 | ... | n k -1 | n k | + | n 1 | n 2 | ... | n k -1 | n k |  |  |  | n k n 1 n 2 ... n k -1 | n 1 | n 2 | ... | n k -1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | n 1 | n 2 | ... | n k -1 | n k |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| + | n 1 | n 2 | ... | n k -1 | n k |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | n k n 1 n 2 ... n k -1 | n 1 | n 2 | ... | n k -1 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

  ======================================================================= <p>The smallest rotor is 105263157894736842.  To get this, guess that the first digit is a 1 and use constraint propagation to generate the number.   Also called a parasitic number.  Generalize to n-parasitic by multiplying by n.  The number described here is 2-parasitic.</p> =======================================================================
