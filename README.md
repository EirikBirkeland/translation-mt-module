# translation-mt-module
A module which outputs a machine translation adjusted to the user's input

This is a module which will return a machine translation based on the user's input.

Key words: predictive typing, model adaptation
Sample input example: OpenNMT output

1. The user's translation should be shipped off to the server
2. The server should return an updated MT suggestion based on the user's translation, including any ancillary data (tags, any provenance data)

# External infrastructure to think about
- a queue -- to restrict the number of requests made to the server
- WIP
