# Puzzle — Nim

> **Source:** [http://intrologic.stanford.edu/puzzles/nim.html](http://intrologic.stanford.edu/puzzles/nim.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |  | Introduction to Logic | Tools for Thought |  |
| --- | --- | --- | --- | --- |

 =======================================================================

---

| Nim |
| --- |

---

 =======================================================================

| Nim is a game of strategy played with coins arranged in piles.  For the purposes of this puzzle, you can assume there are just three piles - one with 7 coins, one with 5 coins, and one with 3 coins.  There are two players. When it is a player's move, he or she can take any number of coins from any pile. The person must take at least one coin on each turn, but the person cannot take coins from more than one pile.  The winner is the player who makes the last move, so that there are no coins left after that move.  When the game starts, you get to choose whether to go first or second.  What is your strategy for winning the game?  Optional: Devise a strategy that guarantees a win for any finite number of coins and any finite number of piles. |
| --- |

  ======================================================================= Let's start by playing with some examples. Suppose the two players are called A and B, and suppose that A goes first. Suppose there are two heaps with a coin each. Then clearly, player B is guaranteed to win: A has to take one of the two coins, leaving B to take the last one.

Now suppose that there are two heaps, one of which contains two coins and the other one. Now player A has a winning strategy: take one of the coins in the two-coin heap. This leaves two heaps with a coin each and B to go next. And as we saw in the previous example, this means that A will win.

Let's do one more: suppose that there are two heaps with two coins each. Now player B has a winning strategy. If A takes an entire heap, then B should take the remaining heap and win. If A takes only one coin of one of the heaps, then we are in the same situation as in the previous example, with B to go first. Therefore, B is guaranteed to win if she takes one coin from the two-coin heap.

The secret to finding the winning strategy hinges on writing the sizes of the heaps (the number of coins in each heap) in binary, and then adding those numbers up — but not using the ordinary way of adding numbers, but something appropriately called Nim addition.

To add some given binary numbers using Nim addition, you first write them underneath each other, as you might for ordinary addition. Then you look at each of the columns in turn. If the number of 1s in a column is odd, you write a 1 underneath it; if it's even, you write a 0 underneath it. Doing this for each column gives a new binary number, and that's the result of the Nim addition.

When Charles Bouton analyzed the game of Nim, he figured out two facts which hold the key to the winning strategy.

Fact 1: Suppose it's your turn and the Nim sum of the number of coins in the heaps is equal to 0. Then whatever you do, the Nim sum of the number of coins after your move will not be equal to 0.

Fact 2: Suppose it's your turn and the Nim sum of the number of coins in the heap is not equal to 0. Then there is a move which ensures that the Nim sum of the number of coins in the heaps after your move is equal to 0.

Now suppose you are player A, so you go first. Also suppose that the Nim sum of the number of coins in the heaps is not equal to 0. Your strategy will be this: if possible always make a move that reduces the next Nim sum, the Nim sum after your move, to 0. This would then mean that whatever player B does next, by fact 1 the move would turn the next Nim sum into a number that's not 0.

Let's have a go, keeping track of the Nim sums in a table:

Player Nim sum	Can this be reduced to 0? Next Nim sum
A	not 0	Yes	0
B	0	No	not 0
A	not 0	Yes	0
B	0	No	not 0
A	not 0	Yes	0

This ping-pong between zero and non-zero Nim sums means that you are guaranteed a win! If player B were to win, she would have to make a move that leaves over no coins at all. That is; she would have to make a move that results in a zero Nim sum which, as we can see, is impossible. Your moves, on the other hand, always reduce the Nim sum to zero. And at some point in the game, the zero Nim sum will correspond to there actually being zero coins left — you've won.

This shows that if the Nim sum of coins in the heaps at the start of the game is not 0, then player A has a winning strategy. The strategy is to always make a move that reduces the next Nim sum to 0. (You can check that this is the strategy played by player A in the example at the beginning of this article.)

See <a href='https://plus.maths.org/content/play-win-nim'>solution</a>.

For a more intuitive explanation, see http://jdh.hamkins.org/win-at-nim-the-secret-mathematical-strategy/ .

 =======================================================================
