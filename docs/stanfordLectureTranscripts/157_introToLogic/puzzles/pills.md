# Puzzle — Pills

> **Source:** [http://intrologic.stanford.edu/puzzles/pills.html](http://intrologic.stanford.edu/puzzles/pills.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |  | Introduction to Logic | Tools for Thought |  |
| --- | --- | --- | --- | --- |

 =======================================================================

---

| Pills |
| --- |

---

 =======================================================================

| A wise man has been accused of a capital crime and is sentenced to death.  The king decides to see how wise the man is.  He gives the man 12  pills.  All are identical in size, shape, color, smell, etc.  All contain a deadly poison except one , and that pill has a different weight from the others.  The wise man is given a balance and told that he can make at most three weighings.  He must then take a pill of his choice.  What should he do?  You can assume that the wise man knows that the safe pill has a different weight, but he does not know whether it is heavier or lighter than the others. |
| --- |

  ======================================================================= So that the following plan can be followed, let us number the pills
from 1 to 12.  For the first weighing let us put on the left pan pills
1,2,3,4 and on the right pan pills 5,6,7,8.

There are two possibilities.  Either they balance, or they don't.  If
they balance, then the good pill is in the group 9,10,11,12.  So for
our second weighing we would put 1,2 in the left pan and 9,10 on the
right.  If these balance then the good pill is either 11 or 12.

Weigh pill 1 against 11.  If they balance, the good pill is number 12.
If they do not balance, then 11 is the good pill.

If 1,2 vs 9,10 do not balance, then the good pill is either 9 or 10.
Again, weigh 1 against 9.  If they balance, the good pill is number
10, otherwise it is number 9.

That was the easy part.

What if the first weighing 1,2,3,4 vs 5,6,7,8 does not balance? Then
any one of these pills could be the safe pill.  Now, in order to
proceed, we must keep track of which side is heavy for each of the
following weighings.

Suppose that 5,6,7,8 is the heavy side.  We now weigh 1,5,6 against
2,7,8.  If they balance, then the good pill is either 3 or 4.
Weigh 4 against 9, a known bad pill.  If they balance then the good
pill is 3, otherwise it is 4.

Now, if 1,5,6 vs 2,7,8 does not balance, and 2,7,8 is the heavy side,
then either 7 or 8 is a good, heavy pill, or 1 is a good, light pill.

For the third weighing, weigh 7 against 8.  Whichever side is heavy is
the good pill. If they balance, then 1 is the good pill. Should the
weighing of 1,5, 6 vs 2,7,8 show 1,5,6 to be the heavy side, then
either 5 or 6 is a good heavy pill or 2 is a light good pill. Weigh 5
against 6.  The heavier one is the good pill.  If they balance, then 2
is a good light pill. =======================================================================
