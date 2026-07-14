# Puzzle — Safecracking

> **Source:** [http://intrologic.stanford.edu/puzzles/safecracking.html](http://intrologic.stanford.edu/puzzles/safecracking.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |  | Introduction to Logic | Tools for Thought |  |
| --- | --- | --- | --- | --- |

 =======================================================================

---

| Safecracking |
| --- |

---

 =======================================================================

| There is a combination safe with four switches on the front, each with three positions (low, medium, and high).  If the switches are set into an opening combination, then  when you try to open the safe, it will open; otherwise, no  dice.  In general, there are 3^4 = 81 possible combinations.  However, this is a cheap safe; and only two of the switches actually matter; if you set those two switches right, the safe will open.  Unfortunately, you do not know which are the important switches or which positions work.  What is the minimum number of combinations you must try that will *guarantee* to open the safe?  What is your plan? |
| --- |

  ======================================================================= <p>Consider the case of two binary switches, one of which is broken.  The marked combinations suffice,</p>

<xmp>
  00
* 01
* 10
  11
</xmp>

<p>Now consider three binary switches, one of which is broken.  We need just the marked combinations in this case.</p>

<xmp>
  000
* 001
* 010
  011
* 100
  101
  110
* 111
</xmp>

<p>The full problem.  Three switches with three positions (0, 1, 2), only two of which matter.  Nine combinations required.  See below.  Basically, we just need to be sure that every combination of each of the three pairs of switches is included.</p>

000
011
022
101
112
120
202
210
221

<p>Interesting exercise - *prove* that the solution to the first problem using our proof methods!</p>

 =======================================================================
