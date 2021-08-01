# web-chess
A web based chess engine using DCP and many other fun things.

### Our progress: 
| Features | Priority | Completion Status | Description |
| ---------| ---------|-------------------|------------|
| Chess GUI | High | Not completely complete | Create chess GUI using react.
| Piece class | High | Not complete | Create chess Piece class with necessary data.
| Bitboard | High | Not complete | Create bitboard representatoin of React chessBoard. 

### How to build a chess engine 101
* Create an chess board interface. We chose to make ours in the web using React. The minimum functionality is defined by having a visible chess board, where pieces can be selected and moved around. 
* Implement some sort of Piece class where we can record the following data:
    * Piece type
    * Piece colour
    * Piece value (might not be needed in the class representation but will be needed somewhere.)
    * Array of legal moves. 
* Have a bitBoard representation of the chess board. The purpose of this is to have some sort of lightweight representation of the chessboard where we will be able to easily create a tree of moves while using minimal resouces, allowing for maximum search depth.
* Design a board ranking algorithm. This will take in a chess board, and output a number, something like a negative number that favours black, and a positive number that favours white. This is how most traditional chess engines operate. We could have several parameters:
    * Total number of pieces ~alive~ (piece value summation)
    * Pieces under attack
    * King under check
    * has Castled. etc.....
* A search tree. This is essentially the AI component. It will go through each set of moves, and every move after that etc and create and tree of moves. The minimax algorithm is the best way for the AI to pick a move based on this tree. Now considering that for every given chess position there are approximately 35 moves it doesn't take long for the tree to blow up tremendously. After only a depth of 4 we have approximately 35^4=1500625 nodes. This isn't great. So we prune the tree using alpha-beta tree pruning. Ez.
* And were done except for the fact that we havent accomplished anything that we set out to do. This is explained in the following.

### We are trying to build a sophisticated chess engine that does several things:
* Uses the Distributed Compute Protocol (DCP) to perform the search tree generation. In reality i don't think this should be too hard since any given node only needs to know about its immediately children. This means a given slice would only compute about 35 boards, which is more than manageable. The tricky part is pruning in a distributed way, which i currently don't know how. In theory we should be able to create a much larger tree this way, since we have access to ~more resources~. 
* Some kind of ML for Board ranking. This document is not being written by an ML expert but from what I understand some sort of neural net could be created that trains on a dataset of tons of chess boards with given ratings, and learns to rate any given chess board this way. We would need some sort of large data set to accomplish this but I existing chess engines like the one on chess.com already rank active boards so there may be a way to pick from that. 
* Distributed tree pruning. Using DCP will only really work effectively if we are able to prune our search tree in a distributed way as well. This should be possible, however, at this moment i haven't thought about it enough but i'm pretty confident it can be done.

## Some good resources for building a chess engine:
* alpha-beta pruning:
    * http://web.cs.ucla.edu/~rosen/161/notes/alphabeta.html
    * https://www.javatpoint.com/ai-alpha-beta-pruning
* minimax:
    * https://en.wikipedia.org/wiki/Minimax
* more on engines:
    * https://www.youtube.com/watch?v=pUyURF1Tqvg