# Puzzle — Wine

> **Source:** [http://intrologic.stanford.edu/puzzles/wine.html](http://intrologic.stanford.edu/puzzles/wine.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |  | Introduction to Logic | Tools for Thought |  |
| --- | --- | --- | --- | --- |

 =======================================================================

---

| Wine |
| --- |

---

 =======================================================================

| The King of a small country invites 1000 senators to his annual party. As a tradition, each senator brings the King a bottle of wine. Soon after, the Queen discovers that one of the senators is trying to assassinate the King by giving him a bottle of poisoned wine. Unfortunately, they do not know which senator, nor which bottle of wine is poisoned, and the poison is completely indiscernible. However, the King has 10 prisoners he plans to execute. He decides to use them as taste testers to determine which bottle of wine contains the poison. The poison when taken has no effect on the prisoner until exactly 24 hours later when the infected prisoner suddenly dies. The King needs to determine which bottle of wine is poisoned so that the festivities can continue as planned. However, he  has time for only one round of testing. How can the King administer the wine to the prisoners to ensure that he is guaranteed to have found the poisoned wine bottle? |
| --- |

  ======================================================================= Label each bottle with both its decimal number and binary equivalent.  Now each bottle serves as a code describing which prisoners are to drink from it. In this system, a one means the prisoner drinks from it, a zero means the prisoner doesn’t.  For example, only Prisoner J should drink from bottle one since its binary is 0000000001. Whereas, Prisoners I and G should drink from bottle ten whose binary is 0000001010 because it has 1's in the columns that match up with prisoners I and G.  Continue this process until you have given out sips of wine from every bottle. After 24 hours, line up the prisoners in order and note which ones have been poisoned with ones and mark the rest with zeros. Convert this number back into decimal to reveal which bottle was poisoned. =======================================================================
