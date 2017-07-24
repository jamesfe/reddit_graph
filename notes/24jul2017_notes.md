# 24 July 2017 Notes

## Making a new visualization

I'm happy to say that I've gotten to a point in comfort here where I think I'll start trying new forms of visualizations.  That's kind of a goal that I had from the beginning!  Hurray!

The next viz is going to be a time plot showing the start and end dates of long-term writers.  The data comes looking like this:

```
[
  {
    "start": "02-2017",
    "end": "23-2017"
  },
  {
  }
]
```

The array is full of objects like this.  My plan is to draw a line from the start to the end point at a random height on my graph.  We'll see how it goes - the random height is a sort of "jitter" to make the graph more readable.  

What's an alternative to this viz?  I would say a histogram showing unique authors per day.  Maybe I'll write a quick little JS thingy to do that sooner or later.

## Other Stuff

- Learning how to separate files so I can make graphs more individually modular.
- Splitting CSS out and managing that as a file
- Modularizing and refactoring
- Writing tests that are meaningful

## TO DO List

I've been bad about this - I should start to do a coverage report and focus on increasing coverage.  

- [ ] Unit Tests
- [ ] Make a smaller JSON
- [ ] Refactor again if possible?
- [ ] Remove references to specific selectors
- [ ] Longevity Graph

