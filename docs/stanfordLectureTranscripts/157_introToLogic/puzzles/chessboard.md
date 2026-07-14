# Puzzle — Chessboard

> **Source:** [http://intrologic.stanford.edu/puzzles/chessboard.html](http://intrologic.stanford.edu/puzzles/chessboard.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |  | Introduction to Logic | Tools for Thought |  |
| --- | --- | --- | --- | --- |

 =======================================================================

---

| Chessboard |
| --- |

---

 =======================================================================

| Consider a standard chessboard with 64 squares with a coin on each square, randomly facing heads or tails up. There is a devil in the room with you and he arbitrarily selects some square and tells you that it is the special square. At this point, you are required to flip one and only one coin on a square of your choice.  A friend then comes in and looks at the board.  His job is to determine the location of the special square correctly solely by looking at the board.  You and your friend can discuss the test beforehand to agree on a strategy, but you are not allowed to communicate in any way once your friend enters the room.  What coin do you flip, and how does your friend determine the special square? |
| --- |

  =======================================================================
<h4>Solution 1</h4>

<xmp>
A chessboard has 64 squares.  So we can view each arrangement of head and tails as a 64 bit number (with 1 representing heads and 0 representing tails).  We can also think of the board as a 6 dimensional cube of size 2; and we can designate each square as a 6 bit number.  For example, square 29 would be 011101, and square 51 would be 110011.

Our solution to the coins problem relies on an interesting way of mapping 64 bit numbers into 6 bit numbers.  To compute the first bit, we take the number of 1s in the upper 32 bits mod 2.  For example, if there were 3 coins showing heads, that would correspond to 1 + 1 + 1 = 1.  To compute the second bit, we take the number of 1s in the second half of each half of the number, i.e. bits 17 - 32 and bits 49 - 64.  To compute the third bit, we take the second half of the second half of each half of the number.  In each case we are considering 32 squares.  We continue in this way until we have assembled all 6 bits.  Note that there are many ways to represent each 6 bit number.

Bit 1 - parity of bits 33-64
Bit 2 - parity of bits 17-32 and 49-64
Bit 3 - parity of bits 9-16 and 25-32 and 41-48 and 57-64
Bit 4 - parity of bits 5-8 and ...
Bit 5 - parity of bits 3-4 and ...
Bit 6 - parity of all even bits

We can use this mapping to solve the chessboard problem as follows.  First, we compute the 6 bit number b for the current arrangement of coins.  Then we compute the 6 bit representation of the square d indicated by the devil.  If the first bit b and d are the same (i.e. the numbers are both greater than 31 or both less than 31), then we focus our attention on the left hand side of the board.  Otherwise, we focus on the right.  Next we compare bit 2 (as defined above) and the second bit of d and again focus on a side based on whether or not they match.  We continue through bit 6, and flip the corresponding bit.

2 bit board (2)
  00 - 0
  10 - 0
  01 - 1
  11 - 1

Board  Square  Change  Result  Result
  00      0       0      10       0
  00      1       1      01       1
  01      0       1      00       0
  01      1       0      11       1
  10      0       0      00       0
  10      1       1      11       1
  11      0       1      10       0
  11      1       0      01       1

4 bit board (2x2)
  0000 - 00
  0001 - 11
  0010 - 10
  0011 - 01
  0100 - 01
  0101 - 10
  0110 - 11
  0111 - 00
  1000 - 00
  1001 - 11
  1010 - 10
  1011 - 01
  1100 - 01
  1101 - 10
  1110 - 11
  1111 - 00

0110:
  1110=11
  0010=10
  0100=01
  0111=00

0000:
  1000=00
  0100=01
  0010=10
  0001=11

1000:
  0000=00
  1100=01
  1010=10
  1001=11
</xmp>

<h4>Solution 2</h4>

<p>The chessboard has 64 squares, which is 2<sup>6</sup>. So we can number the squares in binary from 000000 (=0) to 111111 (=63).</p>

<p>First, you take all of the numbers of the squares on which there are coins facing heads, and perform a bitwise addition modulo 2 on them. This means that for each one of the 6 binary places you add up the bits.  If the final sum is even, you write 0, and if the sum is odd, you write 1. For example, let's say there are only 3 squares with heads, and they are 000111 (=7), 100101 (=37) and 001100 (=12). Then we get:</p>

<center>
000111 &oplus; 100101 &oplus; 001100 = 101110.
</center>

<p>After the devil has chosen the magic square, you subtract the number of that square bitwise modulo 2 from the sum you found before. In this case, let's say that the magic square is 011101 (=29). Subtract this modulo 2 from the sum 101110 you found before:</p>

<center>
1,0,1,1,1,0 - 0,1,1,1,0,1 = 1,-1,0,0,1,-1 mod 2 = 1,1,0,0,1,1
</center>

<p>The result is 110011 = 51, so all you need to do is to flip square number 51 so that it shows heads. (Obviously, you can also add instead of subtract, since it's the same modulo 2; but I think subtracting makes it easier to understand how this works.)</p>

Next, your friend comes into the room. He again performs a bitwise addition modulo 2 on all the squares on which there are coins facing heads, including, of course, the one you flipped. He gets:</p>

<center>
000111 &oplus; 100101 &oplus; 001100 &oplus; 110011 = 011101
</center>

<p>Which is, of course, the number of the magic square!</p>

<p>But wait, what happens if the coin you need to flip already shows heads? Well, then you simply flip it so it shows tails. You can check and see that the sum modulo 2 of the squares with coins showing heads would still give your friend the magic square.</p>

<p>Note that this solution works for a chessboard of any size, as long as the number of squares is a power of 2.</p>
<h4>Solution 3 (Unconfirmed)</h4>

<p>Start with a 2x2 board.  We might have all heads, one head, two heads, three heads, or 4 heads.  In the case of all heads or all tails, flip the coin on the square indicated.  In the case of two heads, flip a coin so that the  indicated square is different from the others.  If there are three heads or three tails flip a coin as follows.  If the square is number 1, make them all the same.  If the square is two, make a vertical line.  If the square is three, make a horizontal line.  If the square is 4, make a diagonal.</p>

<p>To do a 4x4 board, we look at the column of the indicated square.  We wish to single out this column, so we can look at the parity of the number of heads in each column and attempt to make that different from the parity of those in the other columns.  We can switch a coin in any space of those columns to switch the parity, so this is equivalent to just working with 4 spaces each representing the column to flip a coin in.  We can then map these 4 spaces to a certain square of the 2x2 reducing this to a problem we already solved.  This means we can find what column to flip a coin in. Now we must find the row.  We can use this exact same procedure to find what row to flip a coin in.  This means we can solve this problem for the 4x4.</p>

<p>To solve this for an 8x8, we cut the 8x8 into 4 4x4 squares. We then can place these on top of each others to get a 4x4x4 cube.  Now we use the same procedure as in the 4*4 to isolate the row, column, and finally height of the selected square.</p>
 =======================================================================

*Difficulty: difficult*
