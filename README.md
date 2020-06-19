# OpenCA

OpenCA is an open-source simulator for generation-based 2D cellular automata.
There is no theoretical limit to the size of the model it can simulate, and it currently supports 3^256 = 16777216 concurrent states. Every cell can be made indipendent from the others or share a set of rules globally defined.

## Setup

There are no dependencies, just clone and open it in your favorite web browser.
Alternatively you can try it [here](https://hbar-boi.github.io/OpenCA/).
If you'd rather run it in a node server check out the other branch!

## Usage

First, you'll have to choose the size of your cellular automata grid.
Note that it won't be possible to change it during the simulation, so it's always better to make it oversize rather thank risk having to reset everything to change it. Making it way too large will give you worse performance though.

Then you'll need to define the possible states your cells will be in. Different states are distinguished by a different color, so it won't be possible to create two states with the same color.

Finally you'll set the rules the automata will follow. Here they are called actions.
Essentially, an action puts the cell into some state when and if some state condition on other cells is satisfied.
There are two different kinds of actions, defined by their target: neighborhood or single.

### Actions targeting the neighborhood
This kind of action targets (as the name implies) the cells around the one that's being evaluated.
You'll be able to define the size of said neighborhood, keeping in mind that a size of 1 means the 8 cells surrounding the current one will be targeted and so on.
This action will count how many cells in the neighborhood are currently in the "test" state and put the current one in the "new" state if the condition on the cell count is satisfied.

### Actions targeting a single cell
This kind of action simply checks if the state of another cell on the grid equals to the "test" one and, if so, the current cell is put in the "new" state.

## Running

After setting up your automata rules you can simulate it by clicking on "Start". It's possible to tell the solver to wait for a set amount of time before moving to the next generation. It's also possible to set a target generation that, once reached, stops the simulation. Please note that if the time interval isn't set no update will be drawn until the engine is stopped.

# TODO
- More grid boundary options: torus, cylinder...
- "Paint" mode
