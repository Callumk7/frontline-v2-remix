#!/bin/bash

# Define the directory path
DIR="/path/to/your/directory"

# Use grep in combination with xargs and sed to search and replace the text
grep -rl 'useFilterStore' $DIR | xargs sed -i 's/useFilterStore/useCollectionStore/g'

